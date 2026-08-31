import styles from './Wrap.module.css';

export default function Wrap({ className = '', children }) {
  return <div className={`${styles.wrap} ${className}`}>{children}</div>;
}
