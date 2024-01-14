'use client';

/* * */

import styles from './AppWrapper.module.css';
import { useEffect, useContext } from 'react';
import { Appstate } from '@/contexts/Appstate';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import FolderGrid from '../../modules/folders/FolderGrid';
import ProductGrid from '../../modules/products/ProductGrid';
import OrderDetails from '../../modules/order/OrderDetails';
import OrderTotals from '../../modules/order/OrderTotals';
import UserButton from '../../modules/users/UserButton';
import Discounts from '../../modules/discounts/Discounts';
import StatusBar from '../../modules/reports/StatusBar';
import Loading from '@/components/Loading';
import Overlay from '@/components/Overlay';
import CustomerButton from '@/components/CustomerButton/CustomerButton';
import AppStatus from '@/components/AppStatus/AppStatus';

/* * */

export default function AppWrapper() {
  //

  //
  // A. Setup variables

  const router = useRouter();
  const params = useParams();
  const appstate = useContext(Appstate);

  //
  // B. Fetch data

  const { data: deviceData, error: deviceError } = useSWR(params.device_code && `/api/devices/${params.device_code}`);
  const { data: allCustomersData } = useSWR('/api/customers/');

  //
  // C. Transform data

  useEffect(() => {
    if (params.device_code && !deviceError) appstate.setDevice(deviceData);
    else router.push('/');
  }, [appstate, deviceData, deviceError, params.device_code, router]);

  //
  // D. Render components

  return deviceData && allCustomersData ? (
    <div className={styles.container}>
      <div className={styles.registerWrapper}>
        <div className={styles.productsWrapper}>
          <FolderGrid />
          <ProductGrid />
        </div>
        <div className={styles.checkoutPanel}>
          {/* <UserButton /> */}
          <CustomerButton />
          <div className={styles.innerCheckoutWrapper}>
            <OrderDetails />
            <Discounts />
          </div>
          <OrderTotals />
        </div>
      </div>
      <div className={styles.bottomRowWrapper}>
        <StatusBar />
        <AppStatus />
      </div>
      <Overlay />
    </div>
  ) : (
    <Loading />
  );

  //
}
