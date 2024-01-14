'use client';

/* * */

import useSWR from 'swr';
import pjson from '@/root/package.json';
import styles from './AppStatus.module.css';
import { Appstate } from '@/contexts/Appstate';
import { CurrentOrder } from '@/contexts/CurrentOrder';
import { IconAntenna, IconRefresh } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';

/* * */

export default function AppStatus() {
  //

  // A. Setup variables

  const appstate = useContext(Appstate);
  const currentOrder = useContext(CurrentOrder);

  //
  // B. Fetch data

  const { data: versionData, isLoading: versionLoading, error: versionError } = useSWR('/api/version');

  //
  // C. Transform data

  useEffect(() => {
    if (!currentOrder.hasItems && !currentOrder.hasCustomer && !currentOrder.hasCard) {
      if (versionData && versionData.latest !== pjson.version) {
        window.location.reload();
      }
    }
  }, [currentOrder.hasCard, currentOrder.hasCustomer, currentOrder.hasItems, versionData]);

  //
  // D. Render components

  return (
    <div className={`${styles.container} ${versionLoading && styles.waiting} ${versionError && styles.error} ${versionData && styles.connected}`}>
      <p className={styles.appVersion}>{pjson.version}</p>
      <p className={styles.locationName}>{appstate.device?.location?.title || '• • •'}</p>
      <div className={styles.iconWrapper}>
        <IconAntenna size={20} />
      </div>
      <div className={styles.iconWrapper}>
        <IconRefresh size={20} />
      </div>
    </div>
  );

  //
}
