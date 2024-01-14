/* * */

import useSWR from 'swr';
import styles from './CustomerButton.module.css';
import { useEffect, useContext, useRef, useCallback } from 'react';
import { Appstate } from '@/contexts/Appstate';
import { CurrentOrder } from '@/contexts/CurrentOrder';
import CustomerList from '../../modules/customers/CustomerList';
import CustomerView from '../../modules/customers/CustomerView';
import AppButton from '@/components/AppButton/AppButton';
import AssociateOnlyNIF from '@/components/AssociateOnlyNIF/AssociateOnlyNIF';
import { Icon123, IconBackspace, IconUserCheck, IconUserSearch } from '@tabler/icons-react';

/* * */

export default function CustomerButton() {
  //

  //
  // A. Setup variables

  const appstate = useContext(Appstate);
  const currentOrder = useContext(CurrentOrder);
  const hasCardReaderTimeout = useRef(false);
  const keyPressesString = useRef('');

  //
  // B. Fetch data

  const { data: allCustomersData } = useSWR('/api/customers/');

  //
  // C. Handle actions

  const handleKeyPress = useCallback(
    (event) => {
      // The card reader 'types' the Card ID as if it was a regular keyboard,
      // and finishes every read with the 'Enter' key. Pick on this cue to find the matching customer.
      // Even though every Card ID seems to have 10 digits, I don't know for sure if that is the case due to my limited testing abilities.
      // For this reason, the solution below was chosen instead of slicing the last X characters of the string.
      if (!currentOrder.hasCustomer) {
        if (event.key === 'Enter' && !keyPressesString.current) {
          keyPressesString.current = '';
        } else if (event.key === 'Enter') {
          const matchedCustomer = allCustomersData.find((entries) => entries.reference === keyPressesString.current);
          if (matchedCustomer) currentOrder.setCustomer(matchedCustomer);
          else currentOrder.setCard(keyPressesString.current);
          keyPressesString.current = '';
        } else {
          if (!keyPressesString.current) keyPressesString.current = '';
          keyPressesString.current += event.key;
          // Check if a timeout is not already set && if cardReader is not empty, to avoid clearing an already empty variable.
          if (!hasCardReaderTimeout.current && keyPressesString.current) {
            // The card reader device is very fast at 'typing' the Card ID. But it is not possible to differentiate
            // between the reader and regular key presses. Due to this, if keys are pressed in another context of the app,
            // they will be inclued in the card reader variable. For this, a timeout is set to clear the variable
            // 500 miliseconds after the first keypress.
            hasCardReaderTimeout.current = true;
            setTimeout(() => {
              keyPressesString.current = '';
              hasCardReaderTimeout.current = false;
            }, 500);
          }
        }
      }
    },
    [currentOrder, allCustomersData]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [appstate, currentOrder, handleKeyPress]);

  function handleAddCustomer() {
    appstate.setOverlay(<CustomerList />);
  }

  function handleChangeCustomer() {
    appstate.setOverlay(<CustomerView customer_id={currentOrder.customer._id} />);
  }

  function handleChangeNIF() {
    appstate.setOverlay(<AssociateOnlyNIF />);
  }

  function handleClearCardIdString() {
    currentOrder.setCard(null);
  }

  //
  // D. Render components

  return (
    <div className={styles.container}>
      {currentOrder.hasCustomer ? (
        currentOrder.customer.isOnlyNif ? (
          <AppButton className={styles.appButton} onClick={handleChangeNIF}>
            <div className={styles.iconWrapperLeft}>
              <Icon123 size={25} />
            </div>
            <p className={styles.label}>{currentOrder.customer.tax_country + currentOrder.customer.tax_number}</p>
          </AppButton>
        ) : (
          <AppButton className={styles.appButton} onClick={handleChangeCustomer}>
            <div className={styles.iconWrapperLeft}>
              <IconUserCheck size={25} />
            </div>
            <p className={styles.label}>{(currentOrder.customer?.first_name || '') + ' ' + (currentOrder.customer?.last_name || '')}</p>
          </AppButton>
        )
      ) : currentOrder.hasCard ? (
        <AppButton color="success" className={styles.appButton}>
          <p className={styles.label} onClick={handleAddCustomer}>
            {currentOrder.card}
          </p>
          <div className={styles.iconWrapperRight} onClick={handleClearCardIdString}>
            <IconBackspace size={25} />
          </div>
        </AppButton>
      ) : (
        <AppButton color="secondary" className={styles.appButton} onClick={handleAddCustomer}>
          <div className={styles.iconWrapperLeft}>
            <IconUserSearch size={25} />
          </div>
          <p className={styles.label}>Associar Cliente</p>
        </AppButton>
      )}
    </div>
  );
}
