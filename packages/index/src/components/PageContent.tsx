'use client';

import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Steps } from '@/components/Steps';
import { Footer } from '@/components/Footer';
import { AuthCallback } from '@/components/AuthCallback';
import { Suspense, useState } from 'react';
import Image from 'next/image';

export function PageContent() {
  const [imageEnlarged, setImageEnlarged] = useState(false);

  return (
    <>
      <div className="page-container" suppressHydrationWarning>
        <Suspense fallback={null}>
          <AuthCallback />
        </Suspense>
        <Header />
        <Hero />
        <Steps onImageClick={() => setImageEnlarged(true)} />
        <Footer />
      </div>

      {/* Global Image Enlarge Modal */}
      {imageEnlarged && (
        <div className="image-modal-overlay" onClick={() => setImageEnlarged(false)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setImageEnlarged(false)}>
              ×
            </button>
            <Image
              src="https://static-small.vincentqiao.com/webcc.png"
              alt="Claude Code Web Interface"
              width={1200}
              height={630}
              className="image-modal-image"
            />
          </div>
        </div>
      )}
    </>
  );
}
