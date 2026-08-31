import styles from './Section.module.css';

export function hueVars(hue) {
  if (!hue) return undefined;
  return {
    '--hue': `var(--${hue})`,
    '--hue-l': `var(--${hue}-l)`,
    '--hue-d': `var(--${hue}-d)`,
  };
}

export default function Section({ id, tint, dark, hue, className = '', children }) {
  const cls = [styles.sec, tint && styles.tint, dark && styles.dark, className]
    .filter(Boolean)
    .join(' ');
  return (
    <section id={id} className={cls} style={hueVars(hue)}>
      {children}
    </section>
  );
}
