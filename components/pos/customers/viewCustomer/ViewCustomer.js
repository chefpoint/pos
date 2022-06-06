import styles from './ViewCustomer.module.css';

import { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../../../services/context';

import Pannel from '../../../common/pannel/container/Pannel';
import Button from '../../../common/button/Button';
import AddOnlyNIF from '../addOnlyNif/AddOnlyNIF';

import CustomersListRow from '../customersListRow/CustomersListRow';
import Loading from '../../../common/loading/Loading';
import useSWR, { useSWRConfig } from 'swr';
import Icon from '../../../common/icon/Icon';
import CustomerInput from '../customerInput/CustomerInput';

export default function ViewCustomer({ customer }) {
  //
  const { data: customers, mutate } = useSWR('/api/customers/*');

  const { currentOrder, overlay } = useContext(GlobalContext);

  const [editMode, setEditMode] = useState(false);

  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerTaxCountry, setCustomerTaxCountry] = useState('');
  const [customerTaxNumber, setCustomerTaxNumber] = useState('');
  const [customerReference, setCustomerReference] = useState('');
  const [customerBirthday, setCustomerBirthday] = useState('');

  useEffect(() => {
    if (!editMode) {
      const c = customers.find((entries) => entries._id == customer._id);
      setCustomerFirstName(c?.name?.first);
      setCustomerLastName(c?.name?.last);
      setCustomerEmail(c?.email);
      setCustomerTaxCountry(c?.tax?.country);
      setCustomerTaxNumber(c?.tax?.number);
      setCustomerReference(c?.reference);
      setCustomerBirthday(c?.birthday);
    }
  }, [customers, customer._id, editMode]);

  function handleAdd() {
    currentOrder.setCustomer(customer);
    overlay.setComponent();
  }

  function handleEdit() {
    setEditMode(true);
  }

  async function handleSave() {
    // Build the object
    const updatedCustomer = {
      ...customer,
      name: {
        first: customerFirstName,
        last: customerLastName,
      },
      email: customerEmail,
      tax: {
        country: customerTaxCountry,
        number: customerTaxNumber,
      },
      reference: customerReference,
      birthday: customerBirthday,
    };

    await fetch('/api/customers/' + customer._id, {
      method: 'PUT',
      body: JSON.stringify(updatedCustomer),
    })
      .then((res) => {
        if (res.ok) {
          if (currentOrder.hasCustomer) currentOrder.setCustomer(updatedCustomer);
          const indexOfUpdatedCustomer = customers.findIndex((entries) => entries._id == customer._id);
          customers[indexOfUpdatedCustomer] = updatedCustomer;
          mutate(customers);
          setEditMode(false);
        } else throw new Error('Something went wrong but positive.');
      })
      .catch((err) => {
        console.log(err);
        throw new Error('Something went wrong.');
      });
  }

  function handleCancel() {
    setEditMode(false);
  }

  function handleRemove() {
    currentOrder.setCustomer();
    overlay.setComponent();
  }

  return (
    <Pannel title={customer.name.first}>
      <div className={styles.customerInfo}>
        <CustomerInput label={'Nome'} value={customerFirstName} onChange={setCustomerFirstName} editMode={editMode} />
        <CustomerInput label={'Apelido'} value={customerLastName} onChange={setCustomerLastName} editMode={editMode} />
        <CustomerInput label={'Email'} value={customerEmail} onChange={setCustomerEmail} editMode={editMode} />
        <CustomerInput label={'Região Fiscal'} value={customerTaxCountry} onChange={setCustomerTaxCountry} editMode={editMode} />
        <CustomerInput label={'NIF'} value={customerTaxNumber} onChange={setCustomerTaxNumber} editMode={editMode} />
        <CustomerInput label={'Referência'} value={customerReference} onChange={setCustomerReference} editMode={editMode} />
        <CustomerInput label={'Data de Nascimento'} value={customerBirthday} onChange={setCustomerBirthday} editMode={editMode} />
        <CustomerInput label={'ID'} value={customer?._id} editMode={editMode} />
      </div>
      <div className={styles.buttonsContainer}>
        {editMode ? (
          <>
            <Button label={'Guardar Alterações'} type={'secondary'} action={handleSave} />
            <Button label={'Descartar'} type={'danger'} action={handleCancel} />
          </>
        ) : (
          <>
            {currentOrder.customer ? (
              <Button label={'Desassociar'} type={'danger'} action={handleRemove} />
            ) : (
              <Button label={'Associar este Cliente'} type={'primary'} action={handleAdd} />
            )}
            <Button label={'Editar'} type={'secondary'} action={handleEdit} />
          </>
        )}
      </div>
    </Pannel>
  );
}
