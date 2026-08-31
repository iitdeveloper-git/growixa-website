import styles from './Tag.module.css';

export default function Tag({ status, label }) {
  return <span className={`${styles.tag} ${styles[status]}`}>{label}</span>;
}
