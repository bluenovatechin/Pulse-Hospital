import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { Phone, Calendar, X, ArrowUp, UserCheck } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import { useRoute } from './router';
import { lockScroll, unlockScroll } from './components/ui';
import useReveal from './hooks/useReveal';
import { HOSPITAL_INFO, getDoctor, getFacility } from './data/hospitalContent';
import { SITE_URL, getPageMeta, pagePath } from './data/seo';

// Everything except the home page loads on demand, keeping the first download small
const FacilitiesPage = lazy(() => import('./pages/FacilitiesPage'));
const DepartmentsPage = lazy(() => import('./pages/DepartmentsPage'));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const NextWeekBooking = lazy(() => import('./components/NextWeekBooking'));
const AppointmentSlipModal = lazy(() => import('./components/AppointmentSlipModal'));
const AppointmentLookupModal = lazy(() => import('./components/AppointmentLookupModal'));
const FacilityDrawer = lazy(() => import('./components/DetailDrawers').then((m) => ({ default: m.FacilityDrawer })));
const DoctorDrawer = lazy(() => import('./components/DetailDrawers').then((m) => ({ default: m.DoctorDrawer })));

// Keep <head> in step with the current page (title, description, canonical, share tags)
function useDocumentMeta(page, param) {
  useEffect(() => {
    const { title, description } = getPageMeta(page, param);
    const url = SITE_URL + pagePath(page, param);
    document.title = title;
    const set = (selector, attr, value) => document.querySelector(selector)?.setAttribute(attr, value);
    set('meta[name="description"]', 'content', description);
    set('link[rel="canonical"]', 'href', url);
    set('meta[property="og:title"]', 'content', title);
    set('meta[property="og:description"]', 'content', description);
    set('meta[property="og:url"]', 'content', url);
    set('meta[name="twitter:title"]', 'content', title);
    set('meta[name="twitter:description"]', 'content', description);
  }, [page, param]);
}

export default function App() {
  const [route, navigate] = useRoute();
  const [lang, setLang] = useState('en');
  const [showTop, setShowTop] = useState(false);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState(null);
  const [lookupModalOpen, setLookupModalOpen] = useState(false);

  const { page, param } = route;
  const anyModalOpen = bookingModalOpen || lookupModalOpen || !!confirmedAppointment;

  // Jump to top when the page changes (opening a panel keeps the scroll position)
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [page]);

  useReveal();
  useDocumentMeta(page, param);

  useEffect(() => {
    document.documentElement.lang = lang === 'gu' ? 'gu' : 'en';
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the top-most modal; lock page scroll while one is open
  useEffect(() => {
    if (!anyModalOpen) return;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (confirmedAppointment) setConfirmedAppointment(null);
      else if (lookupModalOpen) setLookupModalOpen(false);
      else setBookingModalOpen(false);
    };
    document.addEventListener('keydown', onKey);
    lockScroll();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [anyModalOpen, confirmedAppointment, lookupModalOpen]);

  const openBooking = useCallback((docId = null) => {
    setPreselectedDoctorId(docId);
    setBookingModalOpen(true);
  }, []);

  const handleBookingSuccess = (appointment) => {
    setBookingModalOpen(false);
    setConfirmedAppointment(appointment);
  };

  // Detail panels live in the URL (#/facilities/icu, #/doctors/4)
  const openFacility = (id) => navigate('facilities', id);
  const openDoctor = (id) => navigate('doctors', id);
  const closePanel = useCallback(() => navigate(page, null, { replace: true }), [navigate, page]);

  const facility = page === 'facilities' && param ? getFacility(param) : null;
  const doctor = page === 'doctors' && param ? getDoctor(param) : null;

  const pageProps = { lang, param, onNavigate: navigate, onBook: openBooking };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activePage={page}
        onNavigate={navigate}
        onOpenBooking={() => openBooking(null)}
        onOpenLookup={() => setLookupModalOpen(true)}
        lang={lang}
        setLang={setLang}
      />

      <main style={{ flex: 1 }} key={page} className="page-enter">
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
        {page === 'home' && <HomePage {...pageProps} onOpenLookup={() => setLookupModalOpen(true)} />}
        {page === 'facilities' && <FacilitiesPage {...pageProps} onOpenFacility={openFacility} />}
        {page === 'departments' && <DepartmentsPage {...pageProps} onOpenFacility={openFacility} />}
        {page === 'doctors' && <DoctorsPage {...pageProps} onOpenDoctor={openDoctor} />}
        {page === 'gallery' && <GalleryPage {...pageProps} />}
        {page === 'about' && <AboutPage {...pageProps} />}
        {page === 'contact' && <ContactPage {...pageProps} />}
        {page === 'privacy' && <PrivacyPolicyPage {...pageProps} />}
        {page === 'terms' && <TermsPage {...pageProps} />}
        </Suspense>
      </main>

      <Footer
        onNavigate={navigate}
        onOpenBooking={() => openBooking(null)}
        onOpenLookup={() => setLookupModalOpen(true)}
        lang={lang}
      />

      <Suspense fallback={null}>
      {/* Detail panels */}
      {facility && (
        <FacilityDrawer facility={facility} lang={lang} onClose={closePanel} onBook={openBooking} onOpenDoctor={openDoctor} />
      )}
      {doctor && (
        <DoctorDrawer doctor={doctor} lang={lang} onClose={closePanel} onBook={openBooking} onOpenFacility={openFacility} />
      )}
      </Suspense>

      {/* Desktop floating buttons */}
      <div className="fab-stack">
        {showTop && (
          <button className="fab top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" title="Back to top">
            <ArrowUp size={20} />
          </button>
        )}
        <a className="fab er" href={HOSPITAL_INFO.phoneHref} aria-label="Call emergency" title="Call emergency"><Phone size={22} /></a>
        <button className="fab book" onClick={() => openBooking(null)} aria-label="Book appointment" title="Book appointment"><Calendar size={22} /></button>
      </div>

      {/* Mobile bottom action bar */}
      <nav className="mobile-bar" aria-label="Quick actions">
        <a className="er" href={HOSPITAL_INFO.phoneHref}><Phone size={18} /> {lang === 'en' ? 'Emergency' : 'ઇમરજન્સી'}</a>
        <button onClick={() => setLookupModalOpen(true)}><UserCheck size={18} /> {lang === 'en' ? 'My booking' : 'મારી બુકિંગ'}</button>
        <button className="book" onClick={() => openBooking(null)}><Calendar size={18} /> {lang === 'en' ? 'Book slot' : 'બુક કરો'}</button>
      </nav>

      {/* Booking modal */}
      {bookingModalOpen && (
        <div className="modal-overlay booking-modal-overlay" style={{ zIndex: 110 }} onClick={() => setBookingModalOpen(false)}>
          <div
            className="booking-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Book an appointment"
          >
            {/* Always visible close button - stays pinned at top-right even when scrolling */}
            <button
              onClick={() => setBookingModalOpen(false)}
              aria-label="Close booking modal"
              title="Close (Esc)"
              className="booking-modal-close-btn"
            >
              <X size={19} />
            </button>

            {/* Scrollable appointment content with luxury scroller */}
            <div className="booking-modal-scroll">
              <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
                <NextWeekBooking
                  preselectedDoctorId={preselectedDoctorId}
                  onBookingSuccess={handleBookingSuccess}
                  lang={lang}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={null}>
      {confirmedAppointment && (
        <AppointmentSlipModal appointment={confirmedAppointment} onClose={() => setConfirmedAppointment(null)} lang={lang} />
      )}

      {lookupModalOpen && (
        <AppointmentLookupModal
          onClose={() => setLookupModalOpen(false)}
          onViewSlip={(appt) => {
            setLookupModalOpen(false);
            setConfirmedAppointment(appt);
          }}
          lang={lang}
        />
      )}
      </Suspense>
    </div>
  );
}
