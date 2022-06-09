import Pannel from '../../../../common/pannel/container/Pannel';
import Button from '../../../../common/button/Button';
import useSWR from 'swr';

import Animation from '../../../../../utils/Animation';

import styles from './PaidByCard.module.css';

import { useContext, useState } from 'react';
import { GlobalContext } from '../../../../../services/context';
import transactionManager from '../../../../../utils/transactionManager';

export default function PaidByCard() {
  const { currentOrder, overlay } = useContext(GlobalContext);
  const { data: device } = useSWR('/api/devices/A73HK2');

  const [isLoading, setIsLoading] = useState(false);

  // Run on initialize component
  (function initiateCardRequest() {
    console.log('initiated');
  })();

  function handleCancelPayment() {
    overlay.setComponent();
  }

  async function handleSubmitPayment() {
    try {
      setIsLoading(true);
      await transactionManager.createTransaction(currentOrder.items, currentOrder.customer, currentOrder.discounts, 'card', device.location);
      currentOrder.clear();
      overlay.setComponent();
    } catch (err) {
      alert('error');
    }
  }

  return (
    <Pannel>
      {isLoading ? (
        <div className={styles.player}>
          <Animation name={'loading-dots'} />
        </div>
      ) : (
        <>
          <div className={styles.container}>
            <div className={styles.orderTotal}>{currentOrder.totals.total.toFixed(2) + '€'}</div>
            <div className={styles.paymentMethod}>Multibanco</div>
          </div>
          <div className={styles.buttons}>
            <Button label={'Pago'} type={'primary'} action={handleSubmitPayment} />
            <Button label={'Cancelar'} type={'muted'} action={handleCancelPayment} />
          </div>
        </>
      )}
    </Pannel>
  );
}
