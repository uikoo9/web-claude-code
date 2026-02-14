import { notFound } from 'next/navigation';
import TerminalClient from '@/components/TerminalClient';

async function verifyAccessToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.webcc.dev/ac/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        token: token,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.type === 'success';
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export default async function TerminalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const isValid = await verifyAccessToken(token);

  if (!isValid) {
    notFound();
  }

  return <TerminalClient />;
}
