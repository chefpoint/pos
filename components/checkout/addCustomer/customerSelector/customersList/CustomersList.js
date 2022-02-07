import styles from './CustomersList.module.css';

import { useContext, useState } from 'react';
import { GlobalContext } from '../../../../../utils/global-context';
import useSWR from 'swr';
import CustomersListRow from './customersListRow/CustomersListRow';

export default function CustomersList() {
  const { data: customers } = useSWR('/api/customers');

  return (
    <div className={styles.listContainer}>
      {customers ? customers.map((customer, index) => <CustomersListRow key={index} customer={customer} />) : <Loading />}
    </div>
  );
}
