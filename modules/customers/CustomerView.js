import useSWR from 'swr';
import { styled } from '@stitches/react';
import { useContext } from 'react';
import { Appstate } from '../../context/Appstate';
import { CurrentOrder } from '../../context/CurrentOrder';
import Pannel from '../../components/Pannel';
import Button from '../../components/Button';
import ButtonBar from '../../components/ButtonBar';
import { LoadingOverlay } from '@mantine/core';
import CustomerCreateOrEdit from '@/components/CustomerCreateOrEdit/CustomerCreateOrEdit';
import { DateTime } from 'luxon';

/* * */
/* CUSTOMER VIEW */
/* Explanation needed. */
/* * */

/* */
/* STYLES */

const InputGrid = styled('div', {
  display: 'grid',
  placeItems: 'stretch',
  placeContent: 'stretch',
  gridTemplateColumns: '1fr 1fr',
  gap: '$md',
  marginBottom: '$md',
});

const GridCell = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$sm',
  backgroundColor: '$gray2',
  padding: '$md',
  borderRadius: '$sm',
});

const Label = styled('div', {
  fontSize: '12px',
  color: '$gray12',
  fontWeight: '$medium',
  textTransform: 'uppercase',
});

const Value = styled('div', {
  fontSize: '23px',
  color: '$gray12',
});

/* */
/* LOGIC */

export default function CustomerView({ customer_id }) {
  //

  const appstate = useContext(Appstate);
  const currentOrder = useContext(CurrentOrder);

  const { data: customer } = useSWR(`/api/customers/${customer_id}`, { revalidateOnMount: true });

  function handleAdd() {
    currentOrder.setCustomer(customer);
    appstate.setOverlay();
  }

  function handleEdit() {
    appstate.setOverlay(<CustomerCreateOrEdit customer={customer} />);
  }

  function handleRemove() {
    currentOrder.setCustomer();
    appstate.setOverlay();
  }

  return (
    <Pannel title={customer?.first_name || customer?.last_name ? `${customer.first_name} ${customer.last_name}` : 'Em Atualização...'}>
      {!customer && <LoadingOverlay visible={true} />}
      <InputGrid>
        <GridCell>
          <Label>Nome</Label>
          <Value>{customer?.first_name || customer?.first_name ? `${customer.first_name} ${customer.last_name}` : '-'}</Value>
        </GridCell>
        <GridCell>
          <Label>Data de Nascimento</Label>
          <Value>
            {customer?.birthday
              ? DateTime.fromISO(customer.birthday)
                  .setLocale('pt-pt')
                  .toLocaleString({
                    ...DateTime.DATE_SHORT,
                    month: 'long',
                  })
              : '-'}
          </Value>
        </GridCell>
        <GridCell>
          <Label>NIF</Label>
          <Value>{customer?.tax_number ? `${customer?.tax_region}${customer.tax_number}` : '-'}</Value>
        </GridCell>
        <GridCell>
          <Label>Email de Contacto</Label>
          <Value>{customer?.contact_email || '-'}</Value>
        </GridCell>
        <GridCell>
          <Label>Enviar Faturas?</Label>
          <Value>{customer?.send_invoices ? 'Sim' : 'Não'}</Value>
        </GridCell>
        <GridCell>
          <Label>Nr. Cartão TP</Label>
          <Value>{customer?.reference || '-'}</Value>
        </GridCell>
      </InputGrid>
      <ButtonBar>
        {currentOrder.customer && currentOrder.customer._id === customer_id ? (
          <Button color={'danger'} onClick={handleRemove}>
            Desassociar
          </Button>
        ) : (
          <Button onClick={handleAdd}>Associar este Cliente</Button>
        )}
        <Button color={'secondary'} onClick={handleEdit}>
          Editar
        </Button>
      </ButtonBar>
    </Pannel>
  );
}
