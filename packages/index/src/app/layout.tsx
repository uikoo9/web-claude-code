import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'webcc.dev - Claude Code Web Interface',
  description: 'Use Claude Code directly in your web browser. A powerful web-based terminal interface for Claude CLI.',
  keywords: ['Claude Code', 'Claude CLI', 'Web Terminal', 'AI Assistant', 'Development Tools'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
