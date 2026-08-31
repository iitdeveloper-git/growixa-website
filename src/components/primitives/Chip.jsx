import styles from './Chip.module.css';

export default function Chip({ hue = 'create', className = '', children }) {
  return (
    <span
      className={`${styles.chip} ${className}`}
      style={{ '--c': `var(--${hue})`, '--cl': `var(--${hue}-l)`, '--cd': `var(--${hue}-d)` }}
    >
      {children}
    </span>
  );
}
