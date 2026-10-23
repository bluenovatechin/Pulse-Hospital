import React, { useState, useEffect } from 'react';
import { ShieldCheck, Settings, X, Check, Cookie } from 'lucide-react';
import { Link } from '../router';

const COOKIE_STORAGE_KEY = 'pulse_cookie_consent_v1';

export default function CookieConsentBanner({ lang = 'en' }) {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const t = (en, gu) => (lang === 'en' ? en : gu);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_STORAGE_KEY);
      if (!saved) {
        // Small delay so page renders first without CLS
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      } else {
        const parsed = JSON.parse(saved);
        setAnalyticsEnabled(!!parsed.analytics);
      }
    } catch {
      // ignore localStorage errors
    }

    // Expose global hook to reopen preferences from footer or privacy policy
    window.openPulseCookieSettings = () => {
      setShowPreferences(true);
      setVisible(true);
    };

    return () => {
      delete window.openPulseCookieSettings;
    };
  }, []);

  const saveConsent = (analytics) => {
    const consent = {
      essential: true,
      analytics,
      date: new Date().toISOString()
    };
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, JSON.stringify(consent));
    } catch {}

    setAnalyticsEnabled(analytics);
    setVisible(false);
    setShowPreferences(false);

    // Notify analytics listeners if any
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pulse-cookie-consent-updated', { detail: consent }));
    }
  };

  const handleAcceptAll = () => saveConsent(true);
  const handleEssentialOnly = () => saveConsent(false);
  const handleSaveCustom = () => saveConsent(analyticsEnabled);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label={t('Cookie Consent', 'કુકીઝ સંમતિ')}
      className="cookie-banner-wrap"
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 720,
        margin: '0 auto',
        zIndex: 9999,
        background: '#ffffff',
        border: '1.5px solid var(--border-soft, #e2e8f0)',
        borderRadius: 'var(--radius-lg, 12px)',
        boxShadow: '0 20px 40px rgba(9, 52, 55, 0.18)',
        padding: '20px 24px',
        animation: 'slideUp 260ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-sm, 8px)',
            background: 'var(--mint-soft, #e8f5f1)',
            color: 'var(--primary, #0e655c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          aria-hidden="true"
        >
          <Cookie size={20} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-navy, #093437)', margin: 0 }}>
              {t('Privacy & Cookie Choices', 'તમારી પ્રાઇવસી અને કુકીઝ પસંદગી')}
            </h3>
            <button
              onClick={handleEssentialOnly}
              aria-label={t('Close and accept essential only', 'બંધ કરો')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted, #64748b)',
                cursor: 'pointer',
                padding: 4
              }}
            >
              <X size={18} />
            </button>
          </div>

          <p style={{ fontSize: 13.5, color: 'var(--text-body, #334155)', lineHeight: 1.55, margin: '0 0 14px' }}>
            {t(
              'We use essential storage to save your appointment slips and preferred doctor selections locally on this device. Optional analytics cookies help us monitor site performance without profiling.',
              'આ સાઇટ તમારા બુકિંગ સ્લિપ અને ડૉક્ટર પસંદગીને તમારા ડિવાઇસ પર સાચવવા જરૂરી સ્ટોરેજનો ઉપયોગ કરે છે. વધારાના એનાલિટિક્સ સાઇટ પર્ફોર્મન્સ સુધારવા વપરાય છે.'
            )}{' '}
            <Link to="privacy" style={{ color: 'var(--primary, #0e655c)', fontWeight: 600, textDecoration: 'underline' }}>
              {t('Read Privacy Policy', 'પ્રાઇવસી પોલિસી વાંચો')}
            </Link>
          </p>

          {showPreferences && (
            <div
              style={{
                background: 'var(--cream, #f8fafc)',
                border: '1px solid var(--border-soft, #e2e8f0)',
                borderRadius: 'var(--radius-sm, 8px)',
                padding: '12px 14px',
                marginBottom: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 10
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: 13, color: 'var(--brand-navy, #093437)' }}>
                    {t('Essential Cookies (Required)', 'જરૂરી કુકીઝ (ફરજિયાત)')}
                  </strong>
                  <p style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
                    {t('Required for booking slips, schedule slots & language.', 'સ્લોટ પસંદગી અને ભાષા માટે અનિવાર્ય.')}
                  </p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary, #0e655c)' }}>{t('Always Active', 'હંમેશા સક્રિય')}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-soft, #e2e8f0)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: 13, color: 'var(--brand-navy, #093437)' }}>
                    {t('Performance & Analytics', 'એનાલિટિક્સ અને પર્ફોર્મન્સ')}
                  </strong>
                  <p style={{ fontSize: 12, color: 'var(--text-muted, #64748b)', margin: '2px 0 0' }}>
                    {t('Aggregated page visits to optimize page speed (no ad profiling).', 'સાઇટ સ્પીડ માપવા માટે અનામી મુલાકાતો.')}
                  </p>
                </div>
                <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: 'var(--primary, #0e655c)' }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{analyticsEnabled ? t('Enabled', 'ચાલુ') : t('Disabled', 'બંધ')}</span>
                </label>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 700 }}
            >
              <Check size={15} /> {t('Accept All', 'બધા સ્વીકારો')}
            </button>

            <button
              type="button"
              onClick={handleEssentialOnly}
              className="btn btn-secondary btn-sm"
            >
              {t('Essential Only', 'માત્ર જરૂરી')}
            </button>

            {showPreferences ? (
              <button
                type="button"
                onClick={handleSaveCustom}
                className="btn btn-outline btn-sm"
              >
                {t('Save Choices', 'પસંદગી સાચવો')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 13, color: 'var(--text-muted, #64748b)' }}
              >
                <Settings size={14} /> {t('Customize Preferences', 'કસ્ટમાઇઝ કરો')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
