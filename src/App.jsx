import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsentBanner from './components/CookieConsentBanner';
import HomePage from './pages/HomePage';
import { WhatsAppIcon } from './components/ui';
import { useRoute, navigateTo, scrollToId, currentSection } from './router';
import useReveal from './hooks/useReveal';
import { HOSPITAL_INFO, getDoctor, getFacility, getDepartment } from './data/hospitalContent';
import { SITE_URL, getPageMeta, pagePath } from './data/seo';
import { facilityPageId } from './data/siteStructure';
import { getCondition } from './data/conditions';
import { initAnalytics, trackPageView } from './lib/analytics';

// Everything except the home page loads on demand, keeping the first download small.
// At build time every page is pre-rendered to HTML (scripts/prerender.js).
// Once a page's code has been fetched it renders straight away, so page
// transitions never flash the loading placeholder.
const PAGE_LOADERS = [];
function lazyPage(loader) {
  let Loaded = null;
  const load = () => loader().then((m) => { Loaded = m.default; return m; });
  const Lazy = lazy(load);
  PAGE_LOADERS.push(load);
  return function Page(props) {
    // Chosen once per mount, so a page already on screen is never swapped out
    const [Component] = useState(() => Loaded || Lazy);
    return <Component {...props} />;
  };
}

const FacilitiesPage = lazyPage(() => import('./pages/FacilitiesPage'));
const FacilityPage = lazyPage(() => import('./pages/FacilityPage'));
const DepartmentsPage = lazyPage(() => import('./pages/DepartmentsPage'));
const ConditionsPage = lazyPage(() => import('./pages/ConditionsPage'));
const ConditionPage = lazyPage(() => import('./pages/ConditionPage'));
const DoctorsPage = lazyPage(() => import('./pages/DoctorsPage'));
const DoctorPage = lazyPage(() => import('./pages/DoctorPage'));
const GalleryPage = lazyPage(() => import('./pages/GalleryPage'));
const AboutPage = lazyPage(() => import('./pages/AboutPage'));
const ContactPage = lazyPage(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazyPage(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazyPage(() => import('./pages/TermsPage'));
const BookingPage = lazyPage(() => import('./pages/BookingPage'));
const AppointmentsPage = lazyPage(() => import('./pages/AppointmentsPage'));
const NotFoundPage = lazyPage(() => import('./pages/NotFoundPage'));

// Keep <head> in step with the current page (title, description, canonical, share tags)
function useDocumentMeta(page, param) {
  useEffect(() => {
    const { title, description, noindex } = getPageMeta(page, param);
    const url = SITE_URL + pagePath(page, param);
    document.title = title;
    const set = (selector, attr, value) => document.querySelector(selector)?.setAttribute(attr, value);
    set('meta[name="description"]', 'content', description);
    set('meta[name="robots"]', 'content', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    set('link[rel="canonical"]', 'href', url);
    set('meta[property="og:title"]', 'content', title);
    set('meta[property="og:description"]', 'content', description);
    set('meta[property="og:url"]', 'content', url);
    set('meta[name="twitter:title"]', 'content', title);
    set('meta[name="twitter:description"]', 'content', description);
  }, [page, param]);
}

/** Pick the page component for a route */
function renderPage(page, param, props) {
  switch (page) {
    case 'home':
      return <HomePage {...props} />;
    case 'doctors': {
      if (!param) return <DoctorsPage {...props} />;
      const doctor = getDoctor(param);
      return doctor ? <DoctorPage {...props} doctor={doctor} /> : <NotFoundPage {...props} />;
    }
    case 'facilities': {
      if (!param) return <FacilitiesPage {...props} />;
      // A facility shown as a section renders the page it is on (its own
      // page or /facilities); the address is then tidied to <page>#<section>
      const owner = facilityPageId(param);
      if (owner) return <FacilityPage {...props} facility={getFacility(owner)} />;
      return getFacility(param) ? <FacilitiesPage {...props} /> : <NotFoundPage {...props} />;
    }
    case 'departments': {
      // All departments are on one page; /departments/<id> jumps to its section
      if (!param || getDepartment(param)) return <DepartmentsPage {...props} />;
      return <NotFoundPage {...props} />;
    }
    case 'conditions': {
      if (!param) return <ConditionsPage {...props} />;
      const condition = getCondition(param);
      return condition ? <ConditionPage {...props} condition={condition} /> : <NotFoundPage {...props} />;
    }
    case 'book-appointment':
      return <BookingPage {...props} doctor={param ? getDoctor(param) : null} />;
    case 'my-appointments':
      return <AppointmentsPage {...props} appointmentId={param} />;
    case 'gallery':
      return <GalleryPage {...props} />;
    case 'about':
      return <AboutPage {...props} />;
    case 'contact':
      return <ContactPage {...props} />;
    case 'privacy':
      return <PrivacyPolicyPage {...props} />;
    case 'terms':
      return <TermsPage {...props} />;
    default:
      return <NotFoundPage {...props} />;
  }
}

/** `url` is only passed when pre-rendering on the server */
export default function App({ url }) {
  const [route, navigate] = useRoute(url);
  const [lang, setLang] = useState('en');
  const [showTop, setShowTop] = useState(false);
  const { page, param } = route;

  // Old links move to their current address:
  //   /doctors/4                 -> /doctors/<name>
  //   /departments/kidney        -> /departments#kidney
  //   /facilities/isolation      -> /facilities/icu#isolation
  //   /facilities/lab, /pharmacy -> /facilities#lab, /facilities#pharmacy
  useEffect(() => {
    if (page === 'doctors' && param) {
      const d = getDoctor(param);
      if (d && d.slug !== param) navigateTo('doctors', d.slug, { replace: true });
    }
    if (page === 'departments' && param && getDepartment(param)) {
      navigateTo('departments', null, { replace: true, hash: param });
    }
    if (page === 'facilities' && param && getFacility(param)) {
      const owner = facilityPageId(param);
      if (!owner) navigateTo('facilities', null, { replace: true, hash: param });
      else if (owner !== param) navigateTo('facilities', owner, { replace: true, hash: param });
    }
  }, [page, param]);

  // Start each new page at the top, or at the section in the address (#id)
  useEffect(() => {
    const section = currentSection();
    if (!section) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    // On a first visit the page code finishes loading a moment later and
    // re-renders, so repeat the jump once the page has settled
    scrollToId(section, false);
    const timers = [350, 900].map((ms) => setTimeout(() => {
      if (currentSection() === section) scrollToId(section, false);
    }, ms));
    return () => timers.forEach(clearTimeout);
  }, [page, param]);

  // Once the browser is idle, fetch the other pages so later clicks switch instantly
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => PAGE_LOADERS.forEach((preload) => preload().catch(() => { })));
    return () => cancel(id);
  }, []);

  // Optional Google Analytics (only with an ID set and the visitor's consent)
  useEffect(() => { initAnalytics(); }, []);
  useEffect(() => {
    const id = setTimeout(trackPageView, 0); // after the title has updated
    return () => clearTimeout(id);
  }, [page, param]);

  useReveal(page, param);
  useDocumentMeta(page, param);

  useEffect(() => {
    document.documentElement.lang = lang === 'gu' ? 'gu' : 'en';
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Pages still receive the old callbacks; they now simply change the URL
  const props = {
    lang,
    param,
    onNavigate: navigate,
    onBook: (doctorId) => navigate('book-appointment', doctorId ? getDoctor(doctorId)?.slug : null),
    onOpenDoctor: (id) => navigate('doctors', getDoctor(id)?.slug || id),
    onOpenFacility: (id) => navigate('facilities', id),
    onOpenLookup: () => navigate('my-appointments')
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activePage={page} lang={lang} setLang={setLang} />

      <main style={{ flex: 1 }} key={`${page}/${param || ''}`} className="page-enter">
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
          {renderPage(page, param, props)}
        </Suspense>
      </main>

      <Footer lang={lang} />
      <CookieConsentBanner lang={lang} />

      {/* Floating contact & navigation buttons (bottom-right) */}
      <div className="fab-stack" role="region" aria-label="Quick contact actions">
        {showTop && (
          <button
            className="fab top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={lang === 'en' ? 'Back to top' : 'ઉપર જાઓ'}
            data-tooltip={lang === 'en' ? 'Back to top' : 'ઉપર જાઓ'}
          >
            <ArrowUp size={19} strokeWidth={2.2} />
          </button>
        )}
        <a
          className="fab wa"
          href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent(
            lang === 'en'
              ? 'Hello Pulse Hospital, I would like to inquire about appointments and medical services.'
              : 'નમસ્તે પલ્સ હોસ્પિટલ, મારે એપોઇન્ટમેન્ટ અને સારવાર વિશે માહિતી મેળવવી છે.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={lang === 'en' ? 'Chat on WhatsApp' : 'વોટ્સએપ પર સંપર્ક કરો'}
          data-tooltip={lang === 'en' ? 'Chat on WhatsApp' : 'વોટ્સએપ'}
        >
          <WhatsAppIcon size={28} />
        </a>
      </div>
    </div>
  );
}
