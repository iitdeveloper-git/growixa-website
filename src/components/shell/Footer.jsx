import { Link } from 'react-router-dom';
import Wrap from '../layout/Wrap';
import { STAGES } from '../../content/stages';
import { SOLUTIONS } from '../../content/nav';
import styles from './Footer.module.css';

const PRODUCT = [
  { to: '/pricing', label: 'Pricing' },
  { to: '/sandbox', label: 'Try the sandbox' },
  { to: '/stack-calculator', label: 'Stack calculator' },
  { to: '/roadmap', label: 'Roadmap' },
];

const COMPANY = [
  { to: '/about', label: 'About' },
  { to: '/security', label: 'Security' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className={styles.ftr}>
      <Wrap>
        <div className={styles.grid}>
          <div>
            <Link to="/" className={styles.brand}>
              Growixa
            </Link>
            <p className={styles.blurb}>
              The go-to-market engine for companies that don&rsquo;t have a go-to-market team yet.
            </p>
          </div>

          <nav className={styles.col} aria-label="The Engine">
            <h2 className={styles.h}>The Engine</h2>
            <ul>
              {STAGES.map((s) => (
                <li key={s.id}>
                  <Link to={s.path}>
                    <i style={{ background: `var(--${s.hue})` }} aria-hidden="true" />
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Product">
            <h2 className={styles.h}>Product</h2>
            <ul>
              {PRODUCT.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Solutions">
            <h2 className={styles.h}>Solutions</h2>
            <ul>
              {SOLUTIONS.map((s) => (
                <li key={s.id}>
                  <Link to={s.path}>For {s.name.toLowerCase()}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Company">
            <h2 className={styles.h}>Company</h2>
            <ul>
              {COMPANY.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.base}>
          <span>&copy; 2026 Growixa. Built by a small team in public.</span>
          <span>
            Campaigns and contacts are live. Find and Create are in beta. Qualify ships Q4.
          </span>
        </div>
      </Wrap>
    </footer>
  );
}
