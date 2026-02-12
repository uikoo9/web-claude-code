'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  avatarUrl?: string | null;
  displayName?: string | null;
  username: string;
  email: string;
}

export const UserMenu = ({ avatarUrl, displayName, username, email }: UserMenuProps) => {
  const t = useTranslations();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="user-avatar" onClick={() => setIsOpen(!isOpen)}>
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName || username} className="user-avatar-image" />
        ) : (
          getInitials(displayName || username)
        )}
      </div>

      {isOpen && (
        <div className="user-menu-dropdown">
          {/* User Info */}
          <div className="user-info">
            <div className="user-info-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName || username} className="user-info-avatar-image" />
              ) : (
                getInitials(displayName || username)
              )}
            </div>
            <div className="user-info-text">
              <div className="user-info-name">{displayName || username}</div>
              <div className="user-info-email">{email}</div>
            </div>
          </div>

          <div className="menu-separator" />

          {/* Menu Items */}
          <button className="menu-item" onClick={() => setIsOpen(false)}>
            {t('profile')}
          </button>
          <button className="menu-item" onClick={() => setIsOpen(false)}>
            {t('settings')}
          </button>

          <div className="menu-separator" />

          <button className="menu-item menu-item-danger" onClick={handleSignOut}>
            {t('signOut')}
          </button>
        </div>
      )}
    </div>
  );
};
