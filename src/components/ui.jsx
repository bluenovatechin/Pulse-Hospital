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
import CountUp from './CountUp';

export { CountUp };

// Official crisp WhatsApp vector icon (authentic brand mark)
export function WhatsAppIcon({ size = 20, className = '', color, style = {}, ...props }) {
  if (color) {
    return (
      <svg
        viewBox="0 0 346 346"
        width={size}
        height={size}
        fill={color}
        className={className}
        aria-hidden="true"
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
        {...props}
      >
        <path d="M173,0C77.45,0,0,77.45,0,173c0,31.43,8.38,60.91,23.04,86.31L0,346l89.87-21.25c24.67,13.54,53,21.25,83.13,21.25,95.55,0,173-77.45,173-173S268.55,0,173,0ZM173,315.01c-28.91,0-55.81-8.64-78.24-23.48l-53.1,13.52,14.89-50.75c-16.11-23.03-25.56-51.06-25.56-81.3,0-78.43,63.58-142.01,142.01-142.01s142.01,63.58,142.01,142.01-63.58,142.01-142.01,142.01Z" />
        <path d="M213.54,195.84l41.86,19.73c1.92.91,3.15,2.85,2.98,4.97-.45,5.51-2.66,16.55-12.56,26.44-27.93,27.93-78.09-3.67-80.13-4.89-12.34-6.63-24.06-15.49-35.17-26.61-11.11-11.11-19.98-22.84-26.61-35.17-1.22-2.04-32.82-52.19-4.89-80.13,9.9-9.9,20.93-12.1,26.44-12.56,2.12-.17,4.07,1.06,4.97,2.98l19.73,41.86c.93,1.98.52,4.33-1.02,5.88l-14.71,14.71c-3.18,3.18-4.12,8.13-1.92,12.06,5.37,9.63,12.59,18.9,20.95,27.43,8.53,8.36,17.8,15.58,27.43,20.95,3.93,2.19,8.88,1.26,12.06-1.92l14.71-14.71c1.55-1.55,3.9-1.96,5.88-1.02Z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 175.216 175.552"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      {...props}
    >
      <path
        fill="#ffffff"
        d="m12.966 161.238 10.439-38.114a73.42 73.42 0 0 1-9.821-36.772c.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"
      />
      <path
        fill="#25D366"
        d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523h.023c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.235-17.928z"
      />
      <path
        fill="#ffffff"
        fillRule="evenodd"
        d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
      />
    </svg>
  );
}

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
export function PageHero({ eyebrow, title, text, photo, photoAlt = '', crumbs, actions, facts = [], factsLabel, factsNote, note, aside }) {
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
            <div className="milestones">
              {factsLabel && <span className="milestones-period">{factsLabel}</span>}
              <dl className="hero-facts">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt><CountUp value={f.value} /></dt>
                    <dd>{f.label}</dd>
                  </div>
                ))}
              </dl>
              {factsNote && <p className="milestones-note gujarati-text">{factsNote}</p>}
            </div>
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
