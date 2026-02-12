'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export const AuthCallback = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const userid = searchParams.get('userid');
    const usertoken = searchParams.get('usertoken');

    // If both userid and usertoken are present in URL
    if (userid && usertoken) {
      // Save to cookies (expires in 30 days)
      const expirationDays = 30;
      const date = new Date();
      date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
      const expires = `expires=${date.toUTCString()}`;

      document.cookie = `userid=${userid}; ${expires}; path=/; SameSite=Lax`;
      document.cookie = `usertoken=${encodeURIComponent(usertoken)}; ${expires}; path=/; SameSite=Lax`;

      // Redirect to clean URL (remove query parameters)
      router.replace('/');
    }
  }, [searchParams, router]);

  return null; // This component doesn't render anything
};
