import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale, getTranslations } from 'next-intl/server';
import { Providers } from './providers';
import { WebsiteSchema } from '@/components/WebsiteSchema';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations();

  const title = locale === 'zh' ? 'webcc.dev - Claude Code 网页界面' : 'webcc.dev - Claude Code Web Interface';
  const description = locale === 'zh'
    ? '直接在浏览器中使用 Claude Code，强大的网页终端界面，随时随地访问 Claude CLI。'
    : 'Use Claude Code directly in your web browser. A powerful web-based terminal interface for Claude CLI.';

  return {
    metadataBase: new URL('https://webcc.dev'),
    title: {
      template: '%s | webcc.dev',
      default: title,
    },
    description,
    keywords: [
      'Claude Code',
      'Claude CLI',
      'Web Terminal',
      'AI Assistant',
      'Development Tools',
      'Browser IDE',
      'Claude',
      'Anthropic',
      '网页终端',
      '人工智能',
      '开发工具',
    ],
    authors: [{ name: 'webcc.dev', url: 'https://webcc.dev' }],
    creator: 'webcc.dev',
    publisher: 'webcc.dev',
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'zh': '/zh',
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
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
      other: [
        {
          rel: 'mask-icon',
          url: '/favicon.svg',
        },
      ],
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh' ? 'en_US' : 'zh_CN',
      url: 'https://webcc.dev',
      siteName: 'webcc.dev',
      title,
      description,
      images: [
        {
          url: 'https://static-small.vincentqiao.com/webcc.png',
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@webccdev',
      creator: '@webccdev',
      title,
      description,
      images: ['https://static-small.vincentqiao.com/webcc.png'],
    },
    verification: {
      // Add your verification codes here when available
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
    category: 'technology',
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#22C55E' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  colorScheme: 'dark light',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning key={locale}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://static-small.vincentqiao.com" />

        {/* Font optimization */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* DNS Prefetch for better performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://static-small.vincentqiao.com" />
      </head>
      <body suppressHydrationWarning>
        <WebsiteSchema />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers key={locale}>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
