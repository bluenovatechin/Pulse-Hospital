import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Phone, Calendar, ArrowUp } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { WhatsAppIcon } from './components/ui';
import { useRoute, navigateTo, Link } from './router';
import useReveal from './hooks/useReveal';
import { HOSPITAL_INFO, getDoctor, getFacility, getDepartment } from './data/hospitalContent';
import { SITE_URL, getPageMeta, pagePath } from './data/seo';

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
const DepartmentPage = lazyPage(() => import('./pages/DepartmentPage'));
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
      const facility = getFacility(param);
      return facility ? <FacilityPage {...props} facility={facility} /> : <NotFoundPage {...props} />;
    }
    case 'departments': {
      if (!param) return <DepartmentsPage {...props} />;
      const department = getDepartment(param);
      return department ? <DepartmentPage {...props} department={department} /> : <NotFoundPage {...props} />;
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

  // Old links such as /doctors/4 move to the doctor's name URL
  useEffect(() => {
    if (page === 'doctors' && param) {
      const d = getDoctor(param);
      if (d && d.slug !== param) navigateTo('doctors', d.slug, { replace: true });
    }
  }, [page, param]);

  // Start each new page at the top
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [page, param]);

  // Once the browser is idle, fetch the other pages so later clicks switch instantly
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => PAGE_LOADERS.forEach((preload) => preload().catch(() => {})));
    return () => cancel(id);
  }, []);

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
        <a
          className="fab er"
          href={HOSPITAL_INFO.phoneHref}
          aria-label={lang === 'en' ? 'Call emergency' : 'ઇમરજન્સી કૉલ'}
          data-tooltip={lang === 'en' ? 'Emergency: 63533 44875' : 'ઇમરજન્સી: ૬૩૫૩૩ ૪૪૮૭૫'}
        >
          <Phone size={20} strokeWidth={2.2} />
        </a>
        <Link
          to="book-appointment"
          className="fab book"
          aria-label={lang === 'en' ? 'Book appointment' : 'એપોઇન્ટમેન્ટ બુક કરો'}
          data-tooltip={lang === 'en' ? 'Book Appointment' : 'સ્લોટ બુક કરો'}
        >
          <Calendar size={20} strokeWidth={2.2} />
        </Link>
      </div>
    </div>
  );
}
