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
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleRefreshClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmRefresh = async () => {
    setShowConfirm(false);
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

  const handleCancelRefresh = () => {
    setShowConfirm(false);
  };

  if (!open) return null;

  return (
    <>
      <div className="modal-overlay" onClick={() => onOpenChange(false)}>
        <div className="modal-content modal-content-wide" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{t('accessTokens')}</h2>
            <button className="modal-close" onClick={() => onOpenChange(false)} aria-label="Close">
              ×
            </button>
          </div>

          <div className="modal-body">
            <p className="modal-text">{t('accessTokenDescription')}</p>

            <div className="token-input-group">
              <input
                type="text"
                value={token}
                readOnly
                className="token-input"
                placeholder="No token available"
              />
              <div className="token-actions">
                <button
                  className="btn btn-ghost token-action-button"
                  onClick={handleCopy}
                  title={copySuccess ? 'Copied!' : 'Copy'}
                >
                  <FaCopy size={18} />
                </button>
                <button
                  className="btn btn-ghost token-action-button"
                  onClick={handleRefreshClick}
                  disabled={isRefreshing}
                  title="Refresh"
                >
                  <FaSync size={18} className={isRefreshing ? 'spinning' : ''} />
                </button>
              </div>
            </div>

            {copySuccess && (
              <p className="token-success-message">
                {t('copiedToClipboard')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay" onClick={handleCancelRefresh}>
          <div className="modal-content modal-content-narrow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{t('confirmRefreshTitle')}</h2>
              <button className="modal-close" onClick={handleCancelRefresh} aria-label="Close">
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-text">{t('confirmRefreshMessage')}</p>
            </div>

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={handleCancelRefresh}>
                {t('cancel')}
              </button>
              <button className="btn btn-primary" onClick={handleConfirmRefresh}>
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
