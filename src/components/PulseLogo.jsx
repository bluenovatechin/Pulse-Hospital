import React from 'react';

/**
 * Official Pulse Hospital & I.C.U Logo Component
 * Images are generated from brand/pulse-logo.png by scripts/generate-logos.mjs:
 *   logo-emblem.webp     cross emblem only
 *   logo-name.webp       "PULSE HOSPITAL & I.C.U / CARING FOR LIFE" wordmark
 *   logo-name-light.webp same wordmark for dark backgrounds
 */
const BASE_URL = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
export const LOGO_EMBLEM_SRC = `${BASE_URL}/logo-emblem.webp`;
const LOGO_NAME_SRC = `${BASE_URL}/logo-name.webp`;
const LOGO_NAME_LIGHT_SRC = `${BASE_URL}/logo-name-light.webp`;

// Natural size of the generated wordmark (keeps width/height attributes exact)
const NAME_W = 540;
const NAME_H = 70;

export default function PulseLogo({
  size = 42,
  showText = true,
  variant = 'default', // 'default' | 'light' (for dark navy/green backgrounds) | 'mark-only'
  className = ''
}) {
  const isLight = variant === 'light';
  // The wordmark is drawn a little larger than in the print lockup so it stays readable at header sizes
  const nameHeight = Math.round(size * 0.58);
  const nameWidth = Math.round((nameHeight * NAME_W) / NAME_H);

  const emblem = (
    <img
      src={LOGO_EMBLEM_SRC}
      alt={showText && variant !== 'mark-only' ? '' : 'Pulse Hospital & I.C.U'}
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: 'contain', flexShrink: 0, display: 'block' }}
    />
  );

  return (
    <div
      className={`pulse-logo-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.max(8, Math.round(size * 0.24)),
        lineHeight: 1
      }}
    >
      {isLight ? (
        // White tile so the navy part of the cross stays visible on dark backgrounds
        <span
          style={{
            display: 'inline-flex',
            padding: Math.round(size * 0.12),
            background: '#ffffff',
            borderRadius: Math.round(size * 0.28),
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
            flexShrink: 0
          }}
        >
          {emblem}
        </span>
      ) : (
        emblem
      )}

      {showText && variant !== 'mark-only' && (
        <img
          src={isLight ? LOGO_NAME_LIGHT_SRC : LOGO_NAME_SRC}
          alt="Pulse Hospital & I.C.U, Caring for Life"
          width={nameWidth}
          height={nameHeight}
          style={{ width: nameWidth, height: nameHeight, maxWidth: '100%', objectFit: 'contain', display: 'block' }}
        />
      )}
    </div>
  );
}
