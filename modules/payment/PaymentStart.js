import { styled } from '@stitches/react';
import Pannel from '../../components/Pannel';
import Animation from '../../components/Animation';
import { useContext, useEffect, useRef, useCallback } from 'react';
import { Appstate } from '../../context/Appstate';
import { CurrentOrder } from '../../context/CurrentOrder';
import transactionManager from '../../services/transactionManager';
import PaymentResult from './PaymentResult';

/* * */
/* PAYMENT START */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  margin: '0 -$md',
  padding: '30px',
  paddingTop: '$md',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$md',
  minWidth: '400px',
});

const LoadingWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '60px',
  width: '200px',
  overflow: 'hidden',
  marginTop: '$lg',
});

const OrderTotal = styled('div', {
  fontSize: '60px',
  color: '$primary5',
  fontWeight: '$bold',
});

const PaymentMethod = styled('div', {
  fontSize: '15px',
  textTransform: 'uppercase',
  color: '$primary5',
  fontWeight: '$medium',
});

/* */
/* LOGIC */

export default function PaymentStart() {
  //

  const appstate = useContext(Appstate);
  const currentOrder = useContext(CurrentOrder);

  const alreadySentTransaction = useRef(false);

  const initiatePayment = useCallback(async () => {
    try {
      const result = await transactionManager.create(appstate, currentOrder);
      appstate.setOverlay(
        <PaymentResult
          color={'success'}
          title={currentOrder.totals.total.toFixed(2) + '€'}
          subtitle={result.invoice?.number || result.payment?.method_label}
        />
      );
      currentOrder.clear();
    } catch (err) {
      console.log(err);
      appstate.setOverlay(<PaymentResult color={'danger'} title={'Erro'} subtitle={'Tente novamente'} error={err} />);
    }
  }, [appstate, currentOrder]);

  // Run on component mount
  useEffect(() => {
    // Check if transaction has been already processed:
    // Learn more: https://github.com/reactwg/react-18/discussions/18
    if (!alreadySentTransaction.current) {
      initiatePayment();
      alreadySentTransaction.current = true;
    }
  }, [initiatePayment]);

  return (
    <Pannel>
      <Container>
        <OrderTotal>{currentOrder.totals.total.toFixed(2) + '€'}</OrderTotal>
        <PaymentMethod>{currentOrder.payment.method_label}</PaymentMethod>
        <LoadingWrapper>
          <Animation name={'loading-dots'} />
        </LoadingWrapper>
      </Container>
    </Pannel>
  );
}
