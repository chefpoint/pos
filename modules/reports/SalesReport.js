import { styled } from '@stitches/react';
import Pannel from '../../components/Pannel';
import SummaryBox from './SummaryBox';
import { DatePicker } from '@mantine/dates';
import { useContext, useEffect, useState } from 'react';
import ItemsList from './ItemsList';
import { Appstate } from '../../context/Appstate';
import useSWR from 'swr';

/* * */
/* SALES REPORT */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
  minWidth: '300px',
  minHeight: '300px',
});

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto',
  gap: '$md',
  gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))',
});

/* */
/* LOGIC */

export default function SalesReport() {
  //

  const appstate = useContext(Appstate);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [totalSoldAmount, setTotalSoldAmount] = useState();
  const [cashAmount, setCashAmount] = useState();
  const [cardAmount, setCardAmount] = useState();

  const { data: transactions } = useSWR(
    '/api/transactions/filter' +
      `?location_id=${appstate.device.location._id}` +
      `&date_start=${selectedDate.toISOString()}` +
      `&date_end=${selectedDate.toISOString()}`
  );

  useEffect(() => {
    // Check if transactions is set
    if (!transactions) return;
    // Define local variables
    let totalSoldAmount = 0;
    let cashAmount = 0;
    let cardAmount = 0;
    // For each transaction
    transactions.forEach((transaction) => {
      // Check if it has invoice
      if (transaction.invoice) {
        totalSoldAmount += Number(transaction.invoice.amount_net);
        if (transaction.payment.method_value === 'cash') {
          cashAmount += Number(transaction.invoice.amount_gross);
        } else if (transaction.payment.method_value === 'card') {
          cardAmount += Number(transaction.invoice.amount_gross);
        }
      }
    });
    setTotalSoldAmount(totalSoldAmount);
    setCashAmount(cashAmount);
    setCardAmount(cardAmount);
  }, [selectedDate, transactions]);

  function formatSoldItems() {
    // Check if transactions is set
    if (!transactions) return [];
    // Setup local variable
    const combinedItems = [];
    // Loop through all transactions
    for (const transaction of transactions) {
      // Loop through each item in each transaction
      for (const item of transaction.items) {
        const index = combinedItems.findIndex((ci) => ci.variation_id === item.variation_id);
        if (index < 0) {
          combinedItems.push({
            variation_id: item.variation_id,
            product_title: item.product_title,
            variation_title: item.variation_title,
            qty: item.qty,
          });
        } else {
          combinedItems[index].qty += 1;
        }
      }
    }
    return combinedItems.sort((a, b) => b.qty - a.qty);
  }

  return (
    <Pannel title={'Relatório de Vendas'}>
      <Wrapper>
        <DatePicker
          size='xl'
          value={selectedDate}
          onChange={setSelectedDate}
          maxDate={new Date()}
          dropdownType={'modal'}
        />
        <Grid>
          <SummaryBox
            title={'Total de Vendas s/ IVA'}
            value={totalSoldAmount ? `${totalSoldAmount.toFixed(2)}€` : '0.00€'}
          />
          <SummaryBox title={'Valor em Caixa'} value={cashAmount ? `${cashAmount.toFixed(2)}€` : '0.00€'} />
          <SummaryBox title={'Valor em Multibanco'} value={cardAmount ? `${cardAmount.toFixed(2)}€` : '0.00€'} />
        </Grid>
        <ItemsList data={formatSoldItems()} />
      </Wrapper>
    </Pannel>
  );
}
