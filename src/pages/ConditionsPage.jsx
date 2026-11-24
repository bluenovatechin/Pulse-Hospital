import React from 'react';
import { Calendar, Phone, ArrowRight, BookOpen } from 'lucide-react';
import { PageHero, Icon } from '../components/ui';
import { Link } from '../router';
import { HOSPITAL_INFO, PHOTOS, DEPARTMENTS } from '../data/hospitalContent';
import { CONDITIONS, isPublished, PUBLISHED_CONDITIONS } from '../data/conditions';

// Health conditions hub: /conditions. Lists the published condition pages,
// grouped by department. While no page is published yet, drafts are listed
// (marked as drafts) so doctors can review them; the hub is then hidden
// from search engines and menus.
export default function ConditionsPage({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  const gu = lang === 'gu';
  const list = PUBLISHED_CONDITIONS.length ? PUBLISHED_CONDITIONS : CONDITIONS;
  const groups = DEPARTMENTS.map((d) => ({ dept: d, items: list.filter((c) => c.department === d.id) })).filter((g) => g.items.length);

  return (
    <div>
      <PageHero
        photo={PHOTOS.consult1}
        photoAlt={t('Consultation room at Pulse Hospital, Modasa', 'પલ્સ હોસ્પિટલ, મોડાસાનો કન્સલ્ટેશન રૂમ')}
        crumbs={t('Health conditions', 'રોગો અને સારવાર')}
        eyebrow={t('Health conditions', 'રોગો અને સારવાર')}
        title={t('Conditions we treat in Modasa', 'મોડાસામાં અમે જે રોગોની સારવાર કરીએ છીએ')}
        text={t(
          'Plain-language guides to common illnesses treated at Pulse Hospital: symptoms, warning signs, tests, treatment and prevention.',
          'પલ્સ હોસ્પિટલમાં સારવાર થતા સામાન્ય રોગોની સરળ માહિતી: લક્ષણો, ચેતવણીનાં ચિહ્નો, તપાસ, સારવાર અને બચાવ.'
        )}
        note={{
          icon: <BookOpen size={20} />,
          title: t('Written for patients', 'દર્દીઓ માટે'),
          text: t('General information, not a diagnosis', 'સામાન્ય માહિતી, નિદાન નહીં')
        }}
        actions={
          <>
            <Link to="book-appointment" className="btn btn-primary">
              <Calendar size={17} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}
            </Link>
            <a className="btn btn-secondary" href={HOSPITAL_INFO.phoneHref}>
              <Phone size={17} /> {t('24x7 emergency', '૨૪x૭ ઇમરજન્સી')}
            </a>
          </>
        }
      />

      <section className="section">
        <div className="container-wide cond-hub">
          {groups.map(({ dept, items }) => (
            <section key={dept.id} className="cond-group" aria-labelledby={`cg-${dept.id}`}>
              <h2 id={`cg-${dept.id}`}>
                <span className="dp-icon"><Icon name={dept.icon} size={20} /></span>
                {gu ? (dept.titleGujarati || dept.title) : dept.title}
              </h2>
              <div className="cond-grid">
                {items.map((c) => (
                  <Link key={c.slug} to="conditions" param={c.slug} className="cond-card" data-reveal>
                    <span className="cond-card-name">
                      {gu ? c.nameGu : c.name}
                      {!isPublished(c) && <span className="cond-tag">Draft</span>}
                    </span>
                    <span className="cond-card-alt">{gu ? c.name : c.nameGu}</span>
                    <span className="cond-card-text">{gu ? c.summaryGu : c.summary}</span>
                    <span className="cond-card-more">{t('Read more', 'વધુ વાંચો')} <ArrowRight size={15} /></span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
