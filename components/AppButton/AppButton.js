/* * */

import styles from './AppButton.module.css';

/* * */

export default function AppButton({ color = 'primary', className, children, ...props }) {
  return (
    <div className={`${styles.container} ${styles[color]} ${className}`} {...props}>
      {children}
    </div>
  );
}
