// ========================================================
// Google Analytics 4 (optional).
// Does nothing until both are true:
//   1. GA_MEASUREMENT_ID below is set (from analytics.google.com,
//      looks like "G-XXXXXXXXXX"), and
//   2. the visitor has allowed analytics in the cookie banner.
// IP anonymisation and no ad features: privacy-friendly by default.
// ========================================================
export const GA_MEASUREMENT_ID = '';

const CONSENT_KEY = 'pulse_cookie_consent_v1';
let loaded = false;

function analyticsAllowed() {
  try {
    return !!JSON.parse(localStorage.getItem(CONSENT_KEY) || '{}').analytics;
  } catch {
    return false;
  }
}

function load() {
  if (loaded || !GA_MEASUREMENT_ID || typeof window === 'undefined' || !analyticsAllowed()) return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // Page views are sent by trackPageView (the site changes pages without reloading)
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
}

/** Call once on start: loads GA if allowed, and again if consent is given later */
export function initAnalytics() {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;
  load();
  window.addEventListener('pulse-cookie-consent-updated', () => {
    load();
    trackPageView();
  });
}

/** Send a page view for the current address */
export function trackPageView() {
  if (!loaded || !window.gtag) return;
  window.gtag('event', 'page_view', { page_location: window.location.href, page_title: document.title });
}
