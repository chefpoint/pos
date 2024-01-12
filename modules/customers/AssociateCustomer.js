import { styled } from '@stitches/react';
import useSWR from 'swr';
import { useEffect, useContext, useRef, useCallback, useState } from 'react';
import { Appstate } from '../../context/Appstate';
import { CurrentOrder } from '../../context/CurrentOrder';
import Button from '../../components/Button';
import CustomerList from './CustomerList';
import CustomerView from './CustomerView';
import AssociateOnlyNIF from '../../components/AssociateOnlyNIF/AssociateOnlyNIF';
import { FaUserPlus, FaUserCheck, FaUserTimes } from 'react-icons/fa';

/* * */
/* ASSOCIATE CUSTOMER */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  margin: '$sm',
});

const CustomerButton = styled(Button, {
  width: '100%',
  height: '50px',
  padding: 0,
});

const Icon = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '25px',
  height: '100%',
  aspectRatio: '9/8',
  borderRightWidth: '$md',
  borderRightStyle: 'solid',
  borderRightColor: 'inherit',
});

const Label = styled('p', {
  width: '100%',
  fontSize: '18px',
  fontWeight: '$medium',
  textTransform: 'uppercase',
  textAlign: 'center',
});

/* */
/* LOGIC */

export default function AssociateCustomer() {
  //

  const { data: customers } = useSWR('/api/customers/');

  const appstate = useContext(Appstate);
  const currentOrder = useContext(CurrentOrder);

  const hasCardReaderTimeout = useRef(false);
  const cardReader = useRef('');

  const handleKeyPress = useCallback(
    (event) => {
      // The card reader 'types' the Card ID as if it was a regular keyboard,
      // and finishes every read with the 'Enter' key. Pick on this cue to find the matching customer.
      // Even though every Card ID seems to have 10 digits, I don't know for sure if that is the case due to my limited testing abilities.
      // For this reason, the solution below was chosen instead of slicing the last X characters of the string.
      if (!currentOrder.hasCustomer) {
        if (event.key == 'Enter') {
          const matchedCustomer = customers.find((entries) => entries.reference === cardReader.current); // === is exact match
          if (matchedCustomer) currentOrder.setCustomer(matchedCustomer);
          else console.log('Customer Not Found.'); // Use this to display an error in the UI
          cardReader.current = '';
        } else {
          if (!cardReader.current) cardReader.current = '';
          cardReader.current += event.key;
          // Check if a timeout is not already set && if cardReader is not empty, to avoid clearing an already empty variable.
          if (!hasCardReaderTimeout.current && cardReader.current) {
            // The card reader device is very fast at 'typing' the Card ID. But it is not possible to differentiate
            // between the reader and regular key presses. Due to this, if keys are pressed in another context of the app,
            // they will be inclued in the card reader variable. For this, a timeout is set to clear the variable
            // 100 miliseconds after the first keypress.
            hasCardReaderTimeout.current = true;
            setTimeout(() => {
              cardReader.current = '';
              hasCardReaderTimeout.current = false;
            }, 500);
          }
        }
      }
    },
    [currentOrder, customers]
  );

  // // Card Reader
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      // Cleanup on component unmount (before next re-render)
      // Read more: https://stackoverflow.com/a/56800795
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [appstate, currentOrder, handleKeyPress]);

  // Handlers

  function handleAddCustomer() {
    appstate.setOverlay(<CustomerList />);
  }

  function handleChangeNIF() {
    appstate.setOverlay(<AssociateOnlyNIF />);
  }

  function handleChangeCustomer() {
    appstate.setOverlay(<CustomerView customer_id={currentOrder.customer._id} />);
  }

  /* */
  /* RENDER */

  return (
    <Container>
      {currentOrder.hasCustomer ? (
        currentOrder.customer.isOnlyNif ? (
          <CustomerButton onClick={handleChangeNIF}>
            <Icon>
              <FaUserTimes />
            </Icon>
            <Label>{currentOrder.customer.tax_country + currentOrder.customer.tax_number}</Label>
          </CustomerButton>
        ) : (
          <CustomerButton onClick={handleChangeCustomer}>
            <Icon>
              <FaUserCheck />
            </Icon>
            <Label>{(currentOrder.customer?.first_name || '') + ' ' + (currentOrder.customer?.last_name || '')}</Label>
          </CustomerButton>
        )
      ) : (
        <CustomerButton color={'secondary'} onClick={handleAddCustomer}>
          <Icon>
            <FaUserPlus />
          </Icon>
          <Label>Associar Cliente</Label>
        </CustomerButton>
      )}
    </Container>
  );
}
