'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FaCopy, FaSync } from 'react-icons/fa';

interface AccessTokenModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialToken?: string;
}

export const AccessTokenModal = ({ open, onOpenChange, initialToken = '' }: AccessTokenModalProps) => {
  const t = useTranslations();
  const [token, setToken] = useState(initialToken);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // TODO: Call API to refresh token
      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Generate a mock token for demonstration
      const newToken = 'sk-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setToken(newToken);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={() => onOpenChange(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('accessTokens')}</h2>
          <button className="modal-close" onClick={() => onOpenChange(false)} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-text">{t('accessTokenDescription')}</p>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={token}
              readOnly
              className="token-input"
              placeholder="No token available"
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '14px',
                fontFamily: 'monospace',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-text)',
                outline: 'none',
              }}
            />
            <button
              className="btn btn-ghost"
              onClick={handleCopy}
              style={{
                minWidth: '44px',
                minHeight: '44px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={copySuccess ? 'Copied!' : 'Copy'}
            >
              <FaCopy size={18} />
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                minWidth: '44px',
                minHeight: '44px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Refresh"
            >
              <FaSync size={18} className={isRefreshing ? 'spinning' : ''} />
            </button>
          </div>

          {copySuccess && (
            <p style={{ color: 'var(--color-primary)', fontSize: '14px', marginTop: '8px' }}>
              {t('copiedToClipboard')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
