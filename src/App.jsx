import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Phone, Calendar, ArrowUp, UserCheck } from 'lucide-react';
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
const FacilitiesPage = lazy(() => import('./pages/FacilitiesPage'));
const FacilityPage = lazy(() => import('./pages/FacilityPage'));
const DepartmentsPage = lazy(() => import('./pages/DepartmentsPage'));
const DepartmentPage = lazy(() => import('./pages/DepartmentPage'));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage'));
const DoctorPage = lazy(() => import('./pages/DoctorPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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

      {/* Mobile bottom action bar */}
      <nav className="mobile-bar" aria-label="Quick actions">
        <a className="er" href={HOSPITAL_INFO.phoneHref}>
          <Phone size={17} strokeWidth={2.2} /> {lang === 'en' ? 'Emergency' : 'ઇમરજન્સી'}
        </a>
        <a
          className="wa"
          href={`https://wa.me/${HOSPITAL_INFO.whatsappNumber}?text=${encodeURIComponent(
            lang === 'en'
              ? 'Hello Pulse Hospital, I would like to inquire about appointments and medical services.'
              : 'નમસ્તે પલ્સ હોસ્પિટલ, મારે એપોઇન્ટમેન્ટ અને સારવાર વિશે માહિતી મેળવવી છે.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon size={19} /> {lang === 'en' ? 'WhatsApp' : 'વોટ્સએપ'}
        </a>
        <Link to="my-appointments">
          <UserCheck size={17} strokeWidth={2.2} /> {lang === 'en' ? 'Booking' : 'બુકિંગ'}
        </Link>
        <Link to="book-appointment" className="book">
          <Calendar size={17} strokeWidth={2.2} /> {lang === 'en' ? 'Book Slot' : 'બુક કરો'}
        </Link>
      </nav>
    </div>
  );
}
