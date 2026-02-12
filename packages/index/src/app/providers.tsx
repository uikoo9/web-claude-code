'use client';

import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
