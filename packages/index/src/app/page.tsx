'use client';

import { Box } from '@chakra-ui/react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Steps } from '@/components/Steps';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <Box minH="100vh">
      <Header />
      <Hero />
      <Box id="steps">
        <Steps />
      </Box>
      <Footer />
    </Box>
  );
}
