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

  // Check for existing auth cookies on mount
  useEffect(() => {
    const userid = getCookie('userid');
    const usertoken = getCookie('usertoken');

    if (userid && usertoken) {
      // User has valid cookies, create user object
      setUser({
        id: userid,
        email: '', // Email not available from cookies
        user_metadata: {},
      });
    }

    setLoading(false);
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
