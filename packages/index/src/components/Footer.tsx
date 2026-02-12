'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="footer">
      <div className="container container-xl">
        <p className="footer-text">{t('footer')}</p>
      </div>
    </footer>
  );
}
