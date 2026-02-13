'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
    user_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Helper function to delete cookie
function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info from API
  const fetchUserInfo = async (userid: string, usertoken: string) => {
    try {
      const response = await fetch('https://api.webcc.dev/user/info', {
        method: 'POST',
        headers: {
          userid: userid,
          usertoken: decodeURIComponent(usertoken),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();

      if (data.type === 'success' && data.obj && data.obj.length > 0) {
        const userInfo = data.obj[0];
        setUser({
          id: userInfo.id.toString(),
          email: userInfo.user_info_email || '',
          user_metadata: {
            avatar_url: userInfo.user_info_avatar,
            user_name: userInfo.user_info_name,
            name: userInfo.user_info_name,
            full_name: userInfo.user_info_name,
          },
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      // If API call fails, clear cookies
      deleteCookie('userid');
      deleteCookie('usertoken');
      setUser(null);
    }
  };

  // Check for existing auth cookies on mount
  useEffect(() => {
    const checkAuth = async () => {
      const userid = getCookie('userid');
      const usertoken = getCookie('usertoken');

      if (userid && usertoken) {
        // Check if we have cached user info from OAuth callback
        const cachedUserInfo = localStorage.getItem('userInfo');
        if (cachedUserInfo) {
          try {
            const userInfo = JSON.parse(cachedUserInfo);
            setUser({
              id: userInfo.id.toString(),
              email: userInfo.user_info_email || '',
              user_metadata: {
                avatar_url: userInfo.user_info_avatar,
                user_name: userInfo.user_info_name,
                name: userInfo.user_info_name,
                full_name: userInfo.user_info_name,
              },
            });
            // Clear cached info after using it
            localStorage.removeItem('userInfo');
            setLoading(false);
            return;
          } catch (error) {
            console.error('Error parsing cached user info:', error);
            localStorage.removeItem('userInfo');
          }
        }

        // Check if URL has userid/usertoken parameters
        const urlParams = new URLSearchParams(window.location.search);
        const hasUrlParams = urlParams.has('userid') && urlParams.has('usertoken');

        // If URL doesn't have params but cookie has, fetch user info from API
        if (!hasUrlParams) {
          await fetchUserInfo(userid, usertoken);
        } else {
          // URL has params, they will be processed by AuthCallback
          setUser({
            id: userid,
            email: '',
            user_metadata: {},
          });
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const signInWithGithub = async () => {
    // Redirect to GitHub OAuth authorization endpoint
    window.location.href = 'https://api.webcc.dev/github/auth';
  };

  const signInWithGoogle = async () => {
    // Frontend only - no actual login
    console.log('Google login - UI only (no backend)');
    alert('This is a demo. Please implement authentication in your backend.');
  };

  const signOut = async () => {
    // Clear cookies
    deleteCookie('userid');
    deleteCookie('usertoken');

    // Clear user state
    setUser(null);
  };

  const value = {
    user,
    loading,
    signInWithGithub,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
