import React from 'react';

/**
 * Official Pulse Hospital & I.C.U Logo Component
 * Uses the official rendered.png medical cross emblem provided by Pulse Hospital
 */
const BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
export const OFFICIAL_LOGO_SRC = `${BASE_URL}/rendered.png`;

export default function PulseLogo({ 
  size = 42, 
  showText = true, 
  variant = 'default', // 'default' | 'light' (for dark navy/green backgrounds) | 'mark-only'
  tagline = true,
  lang = 'en',
  className = ''
}) {
  const isLight = variant === 'light';

  return (
    <div 
      className={`pulse-logo-wrapper ${className}`}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: Math.max(10, Math.round(size * 0.28)),
        textDecoration: 'none',
        lineHeight: 1
      }}
    >
      {/* Official Pulse Hospital Cross Emblem */}
      <img
        src={OFFICIAL_LOGO_SRC}
        alt="Pulse Hospital & I.C.U"
        width={size}
        height={size}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: 'contain',
          flexShrink: 0,
          filter: isLight 
            ? 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.45))' 
            : 'drop-shadow(0 2px 6px rgba(9, 52, 55, 0.16))'
        }}
      />

      {/* Typography: PULSE HOSPITAL & I.C.U / CARING FOR LIFE */}
      {showText && variant !== 'mark-only' && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span 
              style={{ 
                fontFamily: "'Outfit', var(--font-heading), sans-serif",
                fontSize: Math.max(16, Math.round(size * 0.44)), 
                fontWeight: 900, 
                letterSpacing: '-0.02em',
                color: isLight ? '#ffffff' : 'var(--brand-navy, #093437)',
                whiteSpace: 'nowrap'
              }}
            >
              PULSE HOSPITAL
            </span>
            <span 
              style={{ 
                fontFamily: "'Outfit', var(--font-heading), sans-serif",
                fontSize: Math.max(14, Math.round(size * 0.38)), 
                fontWeight: 800, 
                color: isLight ? '#86efac' : 'var(--brand-olive, #386e2e)',
                whiteSpace: 'nowrap'
              }}
            >
              &amp; I.C.U
            </span>
          </div>

          {tagline && (
            <div 
              style={{ 
                fontSize: Math.max(10, Math.round(size * 0.23)), 
                fontWeight: 700, 
                letterSpacing: '0.14em',
                color: isLight ? 'rgba(255, 255, 255, 0.82)' : 'var(--brand-olive, #386e2e)',
                textTransform: 'uppercase',
                marginTop: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{lang === 'gu' ? 'જીવનની સંભાળ • મોડાસા' : 'CARING FOR LIFE • MODASA'}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
