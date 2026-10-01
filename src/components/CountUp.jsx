import React, { useEffect, useRef, useState } from 'react';

/**
 * Extracts numeric parts from strings like "2000+", "5000+", "70+", "16", "24x7", "100%", etc.
 */
function parseNumber(val) {
  if (typeof val === 'number') {
    return { prefix: '', target: val, suffix: '', hasNumber: true, isFloat: !Number.isInteger(val), decimals: 0, hasCommas: val >= 1000 };
  }
  const str = String(val ?? '').trim();
  const match = str.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!match) {
    return { prefix: '', target: 0, suffix: str, hasNumber: false, isFloat: false, decimals: 0, hasCommas: false };
  }
  const prefix = match[1];
  const rawNum = match[2].replace(/,/g, '');
  const suffix = match[3];
  const target = parseFloat(rawNum);
  if (isNaN(target)) {
    return { prefix: '', target: 0, suffix: str, hasNumber: false, isFloat: false, decimals: 0, hasCommas: false };
  }
  const isFloat = rawNum.includes('.');
  const decimals = isFloat ? (rawNum.split('.')[1] || '').length : 0;
  const hasCommas = match[2].includes(',') || target >= 1000;
  return { prefix, target, suffix, hasNumber: true, isFloat, decimals, hasCommas };
}

export default function CountUp({ value, duration = 1600, className = '' }) {
  const ref = useRef(null);
  // Default to the original value string for SSR and instant crawling
  const [display, setDisplay] = useState(value);
  const parsed = parseNumber(value);

  useEffect(() => {
    // If not a numeric string or if user requests reduced motion, display directly
    if (!parsed.hasNumber) {
      setDisplay(value);
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      setDisplay(value);
      return;
    }

    const node = ref.current;
    if (!node) return;

    let animFrame = null;
    let started = false;

    const startAnimation = () => {
      if (started) return;
      started = true;

      const startTime = performance.now();
      const { target, prefix, suffix, isFloat, decimals, hasCommas } = parsed;

      // Smooth exponential deceleration
      const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = easeOutExpo(progress) * target;

        let formatted;
        if (isFloat) {
          formatted = current.toFixed(decimals);
        } else {
          const rounded = Math.round(current);
          formatted = hasCommas ? rounded.toLocaleString('en-IN') : String(rounded);
        }

        if (progress < 1) {
          setDisplay(`${prefix}${formatted}${suffix}`);
          animFrame = requestAnimationFrame(tick);
        } else {
          // Guarantee final exact number without rounding artifact
          const finalNum = isFloat
            ? target.toFixed(decimals)
            : hasCommas
            ? target.toLocaleString('en-IN')
            : String(target);
          setDisplay(`${prefix}${finalNum}${suffix}`);
        }
      };

      // Start from 0 immediately on viewport intersection
      const initialZero = isFloat ? (0).toFixed(decimals) : '0';
      setDisplay(`${prefix}${initialZero}${suffix}`);
      animFrame = requestAnimationFrame(tick);
    };

    // Trigger when scrolled into viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={`count-up ${className}`}>
      {display}
    </span>
  );
}
