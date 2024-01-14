'use client';

/* * */

import { useEffect, useContext } from 'react';
import { Appstate } from '../../context/Appstate';
import { useRouter, useParams } from 'next/navigation';
import { styled } from '@stitches/react';
import useSWR from 'swr';
import Loading from '@/components/Loading';
import Overlay from '@/components/Overlay';
import FolderGrid from '../../modules/folders/FolderGrid';
import ProductGrid from '../../modules/products/ProductGrid';
import OrderDetails from '../../modules/order/OrderDetails';
import OrderTotals from '../../modules/order/OrderTotals';
import UserButton from '../../modules/users/UserButton';
import Discounts from '../../modules/discounts/Discounts';
import StatusBar from '../../modules/reports/StatusBar';
import CustomerButton from '@/components/CustomerButton/CustomerButton';
import AppWrapper from '@/components/AppWrapper/AppWrapper';

/* * */
/* POINT OF SALE */
/* The starting point of the app. */
/* * */

/* */
/* STYLES */

const Container = styled('div', {
  position: 'fixed',
  top: '0',
  left: '0',
  display: 'flex',
  flexDirection: 'column',
  gap: '$md',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  minHeight: 'var(--window-inner-height)',
  width: '100%',
  height: '100%',
  padding: '$sm',
  backgroundColor: '$gray0',
});

const RegisterWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '$md',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  width: '100%',
  height: '100%',
  backgroundColor: '$gray0',
});

const ProductsContainer = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'stretch',
});

const CheckoutPannel = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  minWidth: '350px',
  borderRadius: '$md',
  backgroundColor: '$gray0',
  boxShadow: '$md',
  overflow: 'scroll',
});

const InnerCheckoutWrapper = styled('div', {
  height: '100%',
  flexGrow: 0,
  display: 'flex',
  overflow: 'hidden',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export default function PointOfSale() {
  //

  const router = useRouter();
  const params = useParams();

  const { data: device } = useSWR(params.device_code && `/api/devices/${params.device_code}`);
  const { data: customers } = useSWR('/api/customers/');

  const appstate = useContext(Appstate);

  // Set device data in Appstate
  useEffect(() => {
    if (params.device_code && !device?.isError) appstate.setDevice(device);
    else router.push('/'); // Navigate to index.js
  }, [appstate, device, params.device_code, router]);

  /* */
  /* RENDER */

  return device && customers ? <AppWrapper /> : <Loading />;
}
