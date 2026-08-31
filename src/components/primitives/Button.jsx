import styles from './Button.module.css';

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const extra = Component === 'button' ? { type: rest.type ?? 'button' } : {};
  return (
    <Component
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      {...extra}
      {...rest}
    >
      {children}
    </Component>
  );
}
