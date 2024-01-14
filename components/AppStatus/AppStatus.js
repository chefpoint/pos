/* * */

import styles from './AppStatus.module.css';
import { Appstate } from '@/contexts/Appstate';
import { IconAntenna, IconRefresh } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';

/* * */

export default function AppStatus() {
  //

  // A. Setup variables

  const appstate = useContext(Appstate);
  const [connectionStatus, setConnectionStatus] = useState('waiting');

  //
  // B. Transform data

  useEffect(() => {
    const detectConnection = setInterval(async () => {
      try {
        // const res = await fetch(`https://static-global-s-msn-com.akamaized.net/hp-neu/sc/2b/a5ea21.ico?d=${Date.now()}`);
        const res = await fetch(`/api/version/?d=${Date.now()}`);
        if (res.ok) setConnectionStatus('connected');
        else throw new Error('Network failed.');
      } catch (err) {
        setConnectionStatus('error');
      }
    }, 5000);
    return () => clearInterval(detectConnection);
  });

  //
  // C. Render components

  return (
    <div className={`${styles.container} ${connectionStatus === 'waiting' && styles.waiting} ${connectionStatus === 'connected' && styles.connected} ${connectionStatus === 'error' && styles.error}`}>
      <p className={styles.locationName}>{appstate.device?.location?.title || 'Loading'}</p>
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
