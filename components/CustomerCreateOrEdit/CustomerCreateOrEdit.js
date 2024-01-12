/* * */

import styles from './CustomerCreateOrEdit.module.css';
import useSWR from 'swr';
import { useContext, useState, useEffect, useRef } from 'react';
import { Appstate } from '@/contexts/Appstate';
import { CurrentOrder } from '@/contexts/CurrentOrder';
import API from '../../services/API';

import Pannel from '@/components/Pannel';
import Button from '@/components/Button';
import ButtonBar from '@/components/ButtonBar';

import { useForm, yupResolver } from '@mantine/form';
import { TextInput, LoadingOverlay, Switch } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import Schema from '../../schemas/Customer';
import CustomerList from '../../modules/customers/CustomerList';
import CustomerView from '../../modules/customers/CustomerView';

/* * */

export default function CustomerCreateOrEdit({ customer }) {
  //

  //
  // A. Setup variables

  const appstate = useContext(Appstate);
  const currentOrder = useContext(CurrentOrder);

  const hasUpdatedFields = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  //
  // B. Fetch data

  const { mutate: allCustomersMutate } = useSWR('/api/customers/');
  const { mutate: customerMutate } = useSWR(customer && `/api/customers/${customer._id}`);

  //
  // C. Setup form

  const form = useForm({
    schema: yupResolver(Schema),
    initialValues: {
      first_name: '',
      last_name: '',
      tax_region: 'PT',
      tax_number: '',
      contact_email: '',
      send_invoices: true,
      reference: '',
      birthday: '',
    },
  });

  //
  // D. Transform data

  useEffect(() => {
    if (!hasUpdatedFields.current && customer) {
      form.setValues({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        tax_region: customer.tax_region || 'PT',
        tax_number: customer.tax_number || '',
        contact_email: customer.contact_email || '',
        send_invoices: customer.send_invoices,
        reference: customer.reference || '',
        birthday: customer.birthday ? new Date(customer.birthday) : '',
      });
      hasUpdatedFields.current = true;
    }
  }, [customer, form]);

  //
  // E. Handle actions

  function handleCancel() {
    // If editing existing customer
    if (customer) appstate.setOverlay(<CustomerView customer_id={customer._id} />);
    // If creating a new customer
    else appstate.setOverlay(<CustomerList />);
  }

  async function handleSave() {
    try {
      setIsError(false);
      setIsLoading(true);
      if (!form.isValid()) return;
      if (customer) {
        // Update existing customer
        const response = await API({ service: 'customers', operation: 'edit', resourceId: customer._id, method: 'PUT', body: form.values });
        appstate.setOverlay(<CustomerView customer_id={customer._id} />);
        currentOrder.setCustomer(response);
        customerMutate();
      } else {
        // Create new customer
        const response = await API({ service: 'customers', operation: 'create', method: 'POST', body: form.values });
        appstate.setOverlay(<CustomerView customer_id={response._id} />);
        currentOrder.setCustomer(response);
        customerMutate();
      }
      allCustomersMutate();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsError(err.message);
      setIsLoading(false);
    }
  }

  //
  // F. Render components

  return (
    <Pannel title={form.values.first_name || form.values.last_name ? `${form.values.first_name} ${form.values.last_name}` : 'Novo Cliente'}>
      <LoadingOverlay visible={isLoading} />
      {isError && <div className={styles.errorNotice}>{isError}</div>}
      <div className={styles.inputGrid}>
        <TextInput placeholder={'Nome'} size={'xl'} {...form.getInputProps('first_name')} />
        <TextInput placeholder={'Apelido'} size={'xl'} {...form.getInputProps('last_name')} />
        <TextInput placeholder={'Nr. Cartão TP'} size={'xl'} {...form.getInputProps('reference')} />
        <DatePicker placeholder={'Data de Nascimento'} size={'xl'} {...form.getInputProps('birthday')} />
        <TextInput placeholder={'Região Fiscal'} maxLength={2} size={'xl'} {...form.getInputProps('tax_region')} />
        <TextInput placeholder={'Número de Contribuinte'} maxLength={11} size={'xl'} {...form.getInputProps('tax_number')} />
        <TextInput placeholder={'Email de Contacto'} size={'xl'} {...form.getInputProps('contact_email')} />
        <Switch label="Enviar Faturas por Email" size={'xl'} checked={form.values.send_invoices} onChange={({ currentTarget }) => form.setFieldValue('send_invoices', currentTarget.checked)} />
      </div>
      <ButtonBar>
        <Button as={'button'} color={'secondary'} onClick={handleSave}>
          Guardar Alterações
        </Button>
        <Button color={'danger'} onClick={handleCancel}>
          Descartar
        </Button>
      </ButtonBar>
    </Pannel>
  );

  //
}
