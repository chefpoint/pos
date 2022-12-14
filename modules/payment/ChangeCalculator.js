import { styled } from '@stitches/react';
import { useContext, useState } from 'react';
import { Appstate } from '../../context/Appstate';
import { CurrentOrder } from '../../context/CurrentOrder';
import Pannel from '../../components/Pannel';
import Keypad from '../../components/Keypad';
import Button from '../../components/Button';
import PaymentStart from '../../modules/payment/PaymentStart';

/* * */
/* CHANGE CALCULATOR */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$lg',
});

const Row = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '$lg',
});

const AmountsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'stretch',
  borderWidth: '$md',
  borderStyle: 'solid',
  borderColor: '$gray6',
  borderRadius: '$md',
});

const Group = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '$sm',
  justifyContent: 'space-between',
  padding: '$md',
});

const OrderTotalGroup = styled(Group, {
  color: '$gray12',
});

const TotalMoneyGroup = styled(Group, {
  color: '$primary5',
});

const ChangeGroup = styled(Group, {
  color: '$success5',
});

const Line = styled('div', {
  width: '100%',
  padding: '1px',
  height: '1px',
  minHeight: '1px',
  maxHeight: '1px',
  backgroundColor: '$gray6',
});

const Label = styled('div', {
  fontSize: '15px',
  fontWeight: '$bold',
  textTransform: 'uppercase',
});

const Value = styled('div', {
  fontSize: '30px',
  fontWeight: '$bold',
  textTransform: 'uppercase',
});

/* */
/* LOGIC */

export default function ChangeCalculator() {
  //

  const appstate = useContext(Appstate);
  const currentOrder = useContext(CurrentOrder);

  const [totalMoney, setTotalMoney] = useState(0);

  function handleClick(value) {
    // Convert the Number to String so it can be concatenated
    const totalMoneyString = String(totalMoney);
    const newValueString = totalMoneyString + value;
    setTotalMoney(Number(newValueString));
  }

  function handleDeleteValue() {
    const totalMoneyString = String(totalMoney);
    let newValueString = totalMoneyString.substring(0, totalMoneyString.length - 1);
    if (newValueString.length < 1) newValueString = 0;
    setTotalMoney(Number(newValueString));
  }

  function calculateChange() {
    // Divide totalMoney by 100 to get real value with decimals
    const totalMoneyAmount = Number(totalMoney) / 100;
    let change = totalMoneyAmount - currentOrder.totals.total;
    if (change < 0) change = 0;
    return change.toFixed(2);
  }

  function handleInitiatePayment() {
    appstate.setOverlay(<PaymentStart />);
  }

  return (
    <Pannel title={'Calcular Troco'}>
      <Container>
        <Row>
          <AmountsContainer>
            <OrderTotalGroup>
              <Label>Total da Compra</Label>
              <Value>{currentOrder.totals.total.toFixed(2) + '€'}</Value>
            </OrderTotalGroup>
            <Line />
            <TotalMoneyGroup>
              <Label>Cliente deu</Label>
              <Value>{(totalMoney / 100).toFixed(2) + '€'}</Value>
            </TotalMoneyGroup>
            <Line />
            <ChangeGroup>
              <Label>Troco</Label>
              <Value>{calculateChange() + '€'}</Value>
            </ChangeGroup>
          </AmountsContainer>
          <Keypad onClick={handleClick} onDelete={handleDeleteValue} />
        </Row>
        <Button onClick={handleInitiatePayment}>Finalizar Pagamento</Button>
      </Container>
    </Pannel>
  );
}
