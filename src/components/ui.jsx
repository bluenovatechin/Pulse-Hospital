// ========================================================
// Shared presentational building blocks
// ========================================================
import React from 'react';
import {
  ChevronRight, Activity, HeartPulse, Scan, Scissors, BedDouble, BedSingle, HandHeart,
  ShieldPlus, Siren, MonitorDot, Droplets, Microscope, Wind, Stethoscope, ClipboardPlus,
  Pill, Armchair, Soup, Brain, CheckCircle2, Accessibility, Bone
} from 'lucide-react';
import { photoSrcSet } from '../data/hospitalContent';
import { Link } from '../router';

// Icons referenced by name from data/hospitalContent.js.
// Using a new icon name in the data? Import it above and add it here.
const ICONS = {
  Activity, HeartPulse, Scan, Scissors, BedDouble, BedSingle, HandHeart, ShieldPlus, Siren,
  MonitorDot, Droplets, Microscope, Wind, Stethoscope, ClipboardPlus, Pill, Armchair, Soup, Brain, CheckCircle2,
  Accessibility, Bone
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
        <Photo src={photo} alt={alt} sizes="(max-width: 720px) 100vw, 33vw" />
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

// Responsive <img> for the hospital photos (phones get the 640px file)
export function Photo({ src, alt = '', sizes = '(max-width: 720px) 100vw, 50vw', eager = false, ...rest }) {
  return (
    <img
      src={src}
      srcSet={photoSrcSet(src)}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      {...rest}
    />
  );
}

/**
 * Inner-page hero: a calm, light split layout.
 * Left: breadcrumb, eyebrow, title, intro, actions and up to three short facts.
 * Right: one framed hospital photo (with an optional floating note), or any
 * custom `aside` such as a doctor's profile card.
 *
 * `crumbs` is the trail after "Home": a string for a top-level page, or
 * [{ label, to, param }] for deeper pages (the last item is the current page).
 */
export function PageHero({ eyebrow, title, text, photo, photoAlt = '', crumbs, actions, facts = [], note, aside }) {
  const trail = !crumbs ? [] : Array.isArray(crumbs) ? crumbs : [{ label: crumbs }];
  return (
    <section className="page-hero">
      <div className="container-wide page-hero-grid">
        <div className="page-hero-main page-enter">
          {trail.length > 0 && (
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="home">Home</Link>
              {trail.map((c, i) => (
                <React.Fragment key={c.label}>
                  <ChevronRight size={13} aria-hidden="true" />
                  {i < trail.length - 1 && c.to
                    ? <Link to={c.to} param={c.param}>{c.label}</Link>
                    : <span aria-current="page">{c.label}</span>}
                </React.Fragment>
              ))}
            </nav>
          )}

          {eyebrow && <span className="hero-eyebrow">{eyebrow}</span>}
          <h1 className="page-hero-title">{title}</h1>
          {text && <p className="page-hero-desc">{text}</p>}
          {actions && <div className="page-hero-actions">{actions}</div>}

          {facts.length > 0 && (
            <dl className="hero-facts">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.value}</dt>
                  <dd>{f.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {aside && <div className="page-hero-media page-enter" style={{ animationDelay: '90ms' }}>{aside}</div>}

        {!aside && photo && (
          <div className="page-hero-media page-enter" style={{ animationDelay: '90ms' }}>
            <div className="hero-frame">
              <Photo src={photo} alt={photoAlt} eager sizes="(max-width: 1023px) 100vw, 45vw" />
            </div>
            {note && (
              <div className="hero-note">
                <span className="hero-note-icon">{note.icon}</span>
                <span>
                  <strong>{note.title}</strong>
                  <small>{note.text}</small>
                </span>
              </div>
            )}
          </div>
        )}
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

// Ref-counted page scroll lock, so stacked overlays (menu + lightbox)
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

// Stagger helper for reveal animations
export const delay = (i, step = 70) => ({ '--d': `${Math.min(i, 8) * step}ms` });
