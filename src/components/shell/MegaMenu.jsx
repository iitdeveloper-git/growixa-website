import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Tag from '../primitives/Tag';
import { hueVars } from '../layout/Section';
import { STATUS } from '../../content/stages';
import styles from './MegaMenu.module.css';

export default function MegaMenu({ label, items, footer }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);
  const panelId = `mega-${label.toLowerCase()}`;

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    // Grace period so a diagonal pointer path toward the panel does not
    // close it while crossing the gap beside the trigger.
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        cancelClose();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        cancelClose();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  // Hover only where a real pointer exists; touch devices use click.
  const hoverable = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  return (
    <div
      className={`${styles.item} ${open ? styles.open : ''}`}
      ref={ref}
      onMouseEnter={hoverable ? () => { cancelClose(); setOpen(true); } : undefined}
      onMouseLeave={hoverable ? scheduleClose : undefined}
    >
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={(e) => {
          const fromPointer = e.detail > 0;
          setOpen((v) => (hoverable && fromPointer ? true : !v));
        }}
      >
        {label}
        <svg className={styles.caret} width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M3.5 5.5L7 9l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div id={panelId} className={styles.panel} hidden={!open}>
        <div className={styles.grid}>
          {items.map((it) => (
            <Link
              key={it.id}
              to={it.path}
              className={styles.entry}
              style={hueVars(it.hue)}
              onClick={() => setOpen(false)}
            >
              <span className={styles.plate} aria-hidden="true" />
              <span className={styles.text}>
                <span className={styles.name}>
                  {it.name}
                  {it.statusLabel ? (
                    <Tag
                      status={it.status}
                      label={
                        it.status === STATUS.SOON ? `Coming ${it.statusLabel}` : it.statusLabel
                      }
                    />
                  ) : null}
                </span>
                <span className={styles.blurb}>{it.blurb}</span>
              </span>
            </Link>
          ))}
        </div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </div>
  );
}
