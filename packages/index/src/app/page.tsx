import { Box } from '@chakra-ui/react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Steps } from '@/components/Steps';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

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
    <div style={{ minHeight: '100vh' }} suppressHydrationWarning>
      <Header />
      <Hero />
      <Box id="steps">
        <Steps />
      </Box>
      <Footer />
    </div>
  );
}
