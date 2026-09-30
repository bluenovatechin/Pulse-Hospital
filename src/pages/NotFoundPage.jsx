import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { PageHero } from '../components/ui';
import { Link } from '../router';

export default function NotFoundPage({ lang = 'en' }) {
  const t = (en, gu) => (lang === 'en' ? en : gu);
  return (
    <PageHero
      crumbs={t('Page not found', 'પેજ મળ્યું નહીં')}
      eyebrow="404"
      title={t('We couldn’t find that page', 'આ પેજ મળ્યું નહીં')}
      text={t('The link may be old or mistyped. These pages might help:', 'લિંક જૂની અથવા ખોટી હોઈ શકે. આ પેજ ઉપયોગી થઈ શકે:')}
      actions={
        <>
          <Link to="home" className="btn btn-primary">{t('Go to the home page', 'મુખ્ય પૃષ્ઠ')} <ArrowRight size={17} /></Link>
          <Link to="doctors" className="btn btn-secondary">{t('Our doctors', 'અમારા ડૉક્ટરો')}</Link>
          <Link to="book-appointment" className="btn btn-secondary"><Calendar size={17} /> {t('Book an appointment', 'એપોઇન્ટમેન્ટ બુક કરો')}</Link>
        </>
      }
    />
  );
}
