'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// 动态导入，减少初始bundle大小
const LoginModal = dynamic(() => import('./LoginModal').then((mod) => ({ default: mod.LoginModal })), {
  ssr: false,
});

const UserMenu = dynamic(() => import('./UserMenu').then((mod) => ({ default: mod.UserMenu })), {
  ssr: false,
});

export function Header() {
  const t = useTranslations();
  const [loginOpen, setLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading } = useAuth();

  // Track client-side mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract user data from Supabase user object
  const userData = user
    ? {
        avatarUrl: user.user_metadata?.avatar_url || null,
        displayName: user.user_metadata?.full_name || user.user_metadata?.name || null,
        username: user.user_metadata?.user_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
      }
    : null;

  return (
    <>
      <header className="header">
        <div className="header-content">
          {/* Logo - Left */}
          <h1 className="logo">webcc.dev</h1>

          {/* Right side buttons */}
          <div className="header-actions">
            {/* User state */}
            {!mounted || loading ? (
              // Loading placeholder - shown during SSR and while loading
              <div className="header-loading-placeholder" />
            ) : userData ? (
              // Logged in: Show user menu
              <UserMenu
                avatarUrl={userData.avatarUrl}
                displayName={userData.displayName}
                username={userData.username}
                email={userData.email}
              />
            ) : (
              // Not logged in: Show login button
              <button className="btn btn-primary" onClick={() => setLoginOpen(true)}>
                {t('login')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
