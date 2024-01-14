/* * */

import styles from './AppButton.module.css';

/* * */

export default function AppButton({ color = 'primary', disabled = false, className, children, ...props }) {
  return (
    <div className={`${styles.container} ${!disabled && styles[color]} ${disabled && styles.disabled} ${className}`} {...props}>
      {children}
    </div>
  );
}
