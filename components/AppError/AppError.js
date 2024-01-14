'use client';

/* * */

import styles from './AppError.module.css';
import { useEffect, useState } from 'react';

/* * */

export default function AppError({ type = 'invalid_device_code' }) {
  //

  //
  // A. Setup variables

  const [reloadInSeconds, setReloadInSeconds] = useState(10);

  //
  // B. Transform data

  useEffect(() => {
    const interval = setInterval(() => {
      if (reloadInSeconds === 1) window.location.reload();
      else setReloadInSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [reloadInSeconds]);

  //
  // C. Render components

  if (type === 'invalid_device_code') {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Invalid Code</h1>
        <h2 className={styles.subtitle}>Shake your device to fix</h2>
      </div>
    );
  } else {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Ocorreu um Erro</h1>
        <h2 className={styles.subtitle}>A app vai reiniciar em {reloadInSeconds} segundos</h2>
      </div>
    );
  }

  //
}
