import React from 'react';

/**
 * Official Pulse Hospital & I.C.U Logo Component
 * Recreated accurately from the official hospital brochure (1.jpeg)
 * Features the signature Medical Cross with dynamic Pulse Wave ribbon
 * Colors:
 * - Olive Forest Green (#386e2e)
 * - Deep Medical Pine / Teal Navy (#093437 / #0d4a46)
 * - Pure White Contour separation
 */
export default function PulseLogo({ 
  size = 42, 
  showText = true, 
  variant = 'default', // 'default' | 'light' (for dark navy/green backgrounds) | 'mark-only'
  tagline = true,
  lang = 'en',
  className = ''
}) {
  const isLight = variant === 'light';
  
  // Emblem dimensions
  const emblemWidth = size;
  const emblemHeight = size;

  return (
    <div 
      className={`pulse-logo-wrapper ${className}`}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: Math.max(10, size * 0.26),
        textDecoration: 'none',
        lineHeight: 1
      }}
    >
      {/* Dynamic Vector Logo Mark (Cross + Pulse Wave) */}
      <svg 
        width={emblemWidth} 
        height={emblemHeight} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          {/* Forest / Olive Green gradient for the cross arms */}
          <linearGradient id={`plGreen-${size}-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#4ca33e' : '#387332'} />
            <stop offset="100%" stopColor={isLight ? '#38832c' : '#275822'} />
          </linearGradient>

          {/* Deep Teal Navy gradient for the dynamic swoop ribbon */}
          <linearGradient id={`plTeal-${size}-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#29807a' : '#0d4a4d'} />
            <stop offset="100%" stopColor={isLight ? '#125458' : '#072e31'} />
          </linearGradient>

          <filter id={`plShadow-${size}`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000000" floodOpacity={isLight ? 0.25 : 0.12} />
          </filter>
        </defs>

        <g filter={`url(#plShadow-${size})`}>
          {/* Top Arm of Cross (Olive Green) with rounded top corners */}
          <path 
            d="M 37 14 C 37 6.8 42.8 1 50 1 C 57.2 1 63 6.8 63 14 L 63 35 C 57.5 39 49.5 40 40 38.5 C 38.2 38.2 37 36.5 37 34.5 Z" 
            fill={`url(#plGreen-${size}-${variant})`} 
          />

          {/* Bottom Arm of Cross (Olive Green) with rounded bottom corners */}
          <path 
            d="M 37 63 C 44 61.5 53 62 61 65 C 62.4 65.5 63 67 63 68.5 L 63 86 C 63 93.2 57.2 99 50 99 C 42.8 99 37 93.2 37 86 Z" 
            fill={`url(#plGreen-${size}-${variant})`} 
          />

          {/* Left Arm of Cross (Olive Green) with rounded left corners */}
          <path 
            d="M 14 37 C 6.8 37 1 42.8 1 50 C 1 57.2 6.8 63 14 63 L 37 63 C 36.2 55 36.2 45 37 37 Z" 
            fill={`url(#plGreen-${size}-${variant})`} 
          />

          {/* Crisp White Contour Gap behind the ribbon */}
          <path 
            d="M 1 50 C 18 47 31 59 47 62 C 67 65 82 48 97 38 C 103 34 108 38 106 44 C 94 59 77 75 58 74 C 39 73 24 61 1 61 Z" 
            fill={isLight ? '#092f32' : '#ffffff'} 
            stroke={isLight ? '#092f32' : '#ffffff'} 
            strokeWidth="5" 
            strokeLinejoin="round" 
          />

          {/* Dynamic Wave / Swoosh Ribbon (Deep Teal Navy) */}
          <path 
            d="M 1 50 C 18 47 31 59 47 62 C 67 65 82 48 97 38 C 103 34 108 38 106 44 C 94 59 77 75 58 74 C 39 73 24 61 1 61 Z" 
            fill={`url(#plTeal-${size}-${variant})`} 
          />

          {/* Right Arm rounded tip (Deep Teal Navy) */}
          <path 
            d="M 86 37 C 93.2 37 99 42.8 99 50 C 99 57.2 93.2 63 86 63 L 72 63 C 81 55 86 45 86 37 Z" 
            fill={`url(#plTeal-${size}-${variant})`} 
          />

          {/* Vital ECG Pulse Wave line inside the ribbon */}
          <path 
            d="M 16 53 Q 28 55 36 60 T 52 64 Q 68 64 84 49" 
            stroke="#5ce5d5" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeOpacity="0.45" 
            fill="none" 
          />
        </g>
      </svg>

      {/* Typography: PULSE HOSPITAL & I.C.U / CARING FOR LIFE */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span 
              style={{ 
                fontFamily: "'Outfit', var(--font-heading), sans-serif",
                fontSize: Math.max(16, size * 0.44), 
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
                fontSize: Math.max(14, size * 0.38), 
                fontWeight: 800, 
                color: isLight ? '#6ee7b7' : 'var(--brand-olive, #386e2e)',
                whiteSpace: 'nowrap'
              }}
            >
              &amp; I.C.U
            </span>
          </div>

          {tagline && (
            <div 
              style={{ 
                fontSize: Math.max(10, size * 0.23), 
                fontWeight: 700, 
                letterSpacing: '0.14em',
                color: isLight ? 'rgba(255, 255, 255, 0.78)' : 'var(--brand-olive, #386e2e)',
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
