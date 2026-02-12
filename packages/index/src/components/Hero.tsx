'use client';

import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations();

  return (
    <div className="hero">
      {/* Animated background gradient */}
      <div className="hero-bg" />

      <div className="container">
        <div className="hero-content">
          {/* Main Slogan - positioned higher */}
          <div className="hero-title-wrapper">
            <h1 className="hero-title">{t('heroTitle')}</h1>
          </div>

          {/* CTA Button - positioned lower with more spacing */}
          <div className="hero-cta">
            <a href="#steps">
              <button className="btn btn-primary btn-lg">{t('ctaButton')}</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
