'use client';

/* * */

import styles from './AppError.module.css';
import { useEffect, useState } from 'react';

/* * */

export default function AppError({ message }) {
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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ocorreu um Erro</h1>
      <h2 className={styles.subtitle}>{message || 'Erro Desconhecido'}</h2>
      <h2 className={styles.subtitle}>A app vai reiniciar em {reloadInSeconds} segundos</h2>
    </div>
  );

  //
}
