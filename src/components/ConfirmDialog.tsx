'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Articulink ConfirmDialog Component
 *
 * Confirmation dialog for destructive or important actions.
 *
 * Usage:
 *   <ConfirmDialog
 *     isOpen={showDelete}
 *     onClose={() => setShowDelete(false)}
 *     title="Delete appointment?"
 *     description="This action cannot be undone."
 *     confirmLabel="Delete"
 *     variant="danger"
 *     onConfirm={() => handleDelete()}
 *   />
 */

export type ConfirmDialogVariant = 'primary' | 'danger';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  onConfirm: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ConfirmDialogVariant, { button: string; icon: string }> = {
  primary: {
    button: 'bg-tide hover:bg-surf text-white',
    icon: 'bg-info-bg text-info',
  },
  danger: {
    button: 'bg-error hover:bg-error/90 text-white',
    icon: 'bg-error-bg text-error',
  },
};

const defaultIcons: Record<ConfirmDialogVariant, React.ReactNode> = {
  primary: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  danger: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
};

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  loading = false,
  icon,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const styles = variantStyles[variant];
  const displayIcon = icon ?? defaultIcons[variant];

  // Save previous focus and focus dialog on open
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Handle escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose();
      }
    },
    [onClose, loading]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-abyss/50 backdrop-blur-sm animate-fade-in-up"
      style={{ animationDuration: '0.2s' }}
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? 'confirm-dialog-description' : undefined}
        tabIndex={-1}
        className="w-full max-w-sm bg-white rounded-2xl card-depth outline-none"
      >
        <div className="p-6 text-center">
          {displayIcon && (
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${styles.icon}`}>
              {displayIcon}
            </div>
          )}
          <h3 id="confirm-dialog-title" className="text-lg font-semibold text-abyss mb-2">
            {title}
          </h3>
          {description && (
            <p id="confirm-dialog-description" className="text-sm text-lagoon mb-6">
              {description}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                px-6 py-2.5
                text-sm font-semibold text-abyss
                bg-white border-2 border-mist
                rounded-xl
                transition-all duration-150
                hover:border-lagoon
                focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={`
                px-6 py-2.5
                text-sm font-semibold
                rounded-xl
                transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${styles.button}
              `}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
