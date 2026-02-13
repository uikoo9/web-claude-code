import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Steps } from '@/components/Steps';
import { Footer } from '@/components/Footer';
import { AuthCallback } from '@/components/AuthCallback';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

// Generate dynamic metadata based on locale
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: t('heroTitle'),
    description: t('heroSubtitle'),
  };
}

export default function Home() {
  return (
    <div className="page-container" suppressHydrationWarning>
      <Suspense fallback={null}>
        <AuthCallback />
      </Suspense>
      <Header />
      <Hero />
      <Steps />
      <Footer />
    </div>
  );
}
