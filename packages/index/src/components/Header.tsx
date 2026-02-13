'use client';

import { FaGithub } from 'react-icons/fa';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LoginModal } from './LoginModal';
import { UserMenu } from './UserMenu';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

            {/* Language switcher */}
            <LanguageSwitcher />

            {/* GitHub button */}
            <a
              href="https://github.com/uikoo9/web-claude-code"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <button className="icon-btn" aria-label="GitHub">
                <FaGithub size={20} />
              </button>
            </a>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
