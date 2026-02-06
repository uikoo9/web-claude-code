import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { Providers } from './providers';
import { WebsiteSchema } from '@/components/WebsiteSchema';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://webcc.dev'),
  title: {
    template: '%s | webcc.dev',
    default: 'webcc.dev - Claude Code Web Interface',
  },
  description:
    'Use Claude Code directly in your web browser. A powerful web-based terminal interface for Claude CLI.',
  keywords: [
    'Claude Code',
    'Claude CLI',
    'Web Terminal',
    'AI Assistant',
    'Development Tools',
    'Browser IDE',
    'Claude',
    'Anthropic',
  ],
  authors: [{ name: 'webcc.dev' }],
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'zh-CN': '/zh',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://webcc.dev',
    siteName: 'webcc.dev',
    title: 'webcc.dev - Claude Code Web Interface',
    description:
      'Use Claude Code directly in your web browser. A powerful web-based terminal interface for Claude CLI.',
    images: [
      {
        url: 'https://static-small.vincentqiao.com/webcc.png',
        width: 1200,
        height: 630,
        alt: 'webcc.dev - Claude Code Web Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'webcc.dev - Claude Code Web Interface',
    description:
      'Use Claude Code directly in your web browser. A powerful web-based terminal interface for Claude CLI.',
    images: ['https://static-small.vincentqiao.com/webcc.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#22C55E' },
    { media: '(prefers-color-scheme: dark)', color: '#22C55E' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WebsiteSchema />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
