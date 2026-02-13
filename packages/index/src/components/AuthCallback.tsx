'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export const AuthCallback = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const processAuthCallback = async () => {
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

        // Fetch user info from API immediately after saving cookies
        try {
          const response = await fetch('https://api.webcc.dev/user/info', {
            method: 'POST',
            headers: {
              userid: userid,
              usertoken: usertoken,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.type === 'success' && data.obj) {
              // User info fetched successfully, store in localStorage for AuthContext to pick up
              localStorage.setItem('userInfo', JSON.stringify(data.obj));
            } else {
              // API returned fail, clear cookies
              console.warn('User info API returned error:', data.msg || 'Unknown error');
              document.cookie = 'userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              document.cookie = 'usertoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              localStorage.removeItem('userInfo');
            }
          }
        } catch (error) {
          console.error('Error fetching user info during callback:', error);
          // Clear cookies on error
          document.cookie = 'userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'usertoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          localStorage.removeItem('userInfo');
        }

        // Use window.location.href for full page reload to trigger AuthContext useEffect
        window.location.href = '/';
      }
    };

    processAuthCallback();
  }, [searchParams]);

  return null; // This component doesn't render anything
};
