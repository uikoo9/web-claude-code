'use client';

import React, { createContext, useContext, useState } from 'react';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading] = useState(false);

  const signInWithGithub = async () => {
    // Frontend only - no actual login
    console.log('GitHub login - UI only (no backend)');
    alert('This is a demo. Please implement authentication in your backend.');
  };

  const signInWithGoogle = async () => {
    // Frontend only - no actual login
    console.log('Google login - UI only (no backend)');
    alert('This is a demo. Please implement authentication in your backend.');
  };

  const signOut = async () => {
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
