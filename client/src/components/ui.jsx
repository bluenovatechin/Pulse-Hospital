// ========================================================
// Shared presentational building blocks
// ========================================================
import React, { useEffect, useRef } from 'react';
import {
  X, ChevronRight, Activity, HeartPulse, Scan, Scissors, BedDouble, BedSingle, HandHeart,
  ShieldPlus, Siren, MonitorDot, Droplets, Microscope, Wind, Stethoscope, ClipboardPlus,
  Pill, Armchair, Soup, Brain
} from 'lucide-react';

// Icons referenced by name from data/hospitalContent.js.
// Using a new icon name in the data? Import it above and add it here.
const ICONS = {
  Activity, HeartPulse, Scan, Scissors, BedDouble, BedSingle, HandHeart, ShieldPlus, Siren,
  MonitorDot, Droplets, Microscope, Wind, Stethoscope, ClipboardPlus, Pill, Armchair, Soup, Brain
};

// Render a lucide icon by name (names are stored in the data file)
export function Icon({ name, size = 20, ...rest }) {
  const Cmp = ICONS[name] || Activity;
  return <Cmp size={size} {...rest} />;
}

// Doctors have no portrait photos, so each gets a coloured monogram
export function Avatar({ doctor, size = '' }) {
  const [c1, c2] = doctor.colors || [];
  return (
    <span className={`avatar ${size}`} style={{ '--av1': c1, '--av2': c2 }} aria-hidden="true">
      {doctor.initials}
    </span>
  );
}

// Photo if we have one, illustrated icon tile otherwise
export function Media({ photo, icon, alt = '', className = '', iconSize = 56, shade = false, children }) {
  if (photo) {
    return (
      <div className={`photo ${shade ? 'photo-shade' : ''} ${className}`}>
        <img src={photo} alt={alt} loading="lazy" />
        {children}
      </div>
    );
  }
  return (
    <div className={`art ${className}`}>
      <Icon name={icon} size={iconSize} strokeWidth={1.4} />
      {children}
    </div>
  );
}

export function PageHero({ eyebrow, title, text, photo, crumbs, onHome, children }) {
  return (
    <section className="page-hero">
      {photo && (
        <div className="page-hero-bg" aria-hidden="true">
          <img src={photo} alt="" />
        </div>
      )}
      <div className="container-wide page-enter">
        {crumbs && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <button onClick={onHome}>Home</button>
            <ChevronRight size={13} />
            <span>{crumbs}</span>
          </nav>
        )}
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, text, center = false, children }) {
  return (
    <div className={`section-head ${center ? 'center' : ''}`} data-reveal>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}

// Ref-counted page scroll lock, so stacked overlays (drawer + modal)
// don't unlock each other when one closes.
let lockCount = 0;
export function lockScroll() {
  lockCount += 1;
  document.body.classList.add('no-scroll');
}
export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (!lockCount) document.body.classList.remove('no-scroll');
}

// Right-side detail panel. Closes on Escape or backdrop click.
export function Drawer({ onClose, label, children }) {
  const panelRef = useRef(null);

  useEffect(() => {
    // Ignore Escape while a modal is stacked on top of the drawer
    const onKey = (e) => e.key === 'Escape' && !document.querySelector('.modal-overlay') && onClose();
    document.addEventListener('keydown', onKey);
    lockScroll();
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [onClose]);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="drawer-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        {children}
      </aside>
    </div>
  );
}

// Stagger helper for reveal animations
export const delay = (i, step = 70) => ({ '--d': `${Math.min(i, 8) * step}ms` });
