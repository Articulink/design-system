'use client';

import { forwardRef, useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Articulink CelebrationOverlay Component
 *
 * Confetti and celebration animation overlay.
 *
 * Usage:
 *   <CelebrationOverlay
 *     isOpen={showCelebration}
 *     onClose={() => setShowCelebration(false)}
 *     title="Great Job!"
 *     message="You completed the task!"
 *   />
 */

export type CelebrationVariant = 'success' | 'achievement' | 'milestone' | 'streak';

export interface CelebrationOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  variant?: CelebrationVariant;
  title: string;
  subtitle?: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  autoCloseDelay?: number; // ms, 0 to disable
  confettiCount?: number;
}

interface Confetti {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

const confettiColors = [
  'bg-success',
  'bg-success/80',
  'bg-success/60',
  'bg-info',
  'bg-warning',
  'bg-warning/80',
  'bg-tide',
  'bg-surf',
];

const variantConfig: Record<CelebrationVariant, { gradient: string; iconBg: string }> = {
  success: {
    gradient: 'from-success to-success/70',
    iconBg: 'from-success/80 to-success',
  },
  achievement: {
    gradient: 'from-sunshine to-warning',
    iconBg: 'from-sunshine to-warning',
  },
  milestone: {
    gradient: 'from-tide to-surf',
    iconBg: 'from-tide to-surf',
  },
  streak: {
    gradient: 'from-warning to-error/70',
    iconBg: 'from-warning to-error/80',
  },
};

export const CelebrationOverlay = forwardRef<HTMLDivElement, CelebrationOverlayProps>(
  (
    {
      isOpen,
      onClose,
      variant = 'success',
      title,
      subtitle,
      message,
      icon,
      actionLabel = 'Continue',
      onAction,
      autoCloseDelay = 5000,
      confettiCount = 40,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const config = variantConfig[variant];

    // Generate confetti pieces
    const confetti = useMemo<Confetti[]>(() => {
      const pieces: Confetti[] = [];
      for (let i = 0; i < confettiCount; i++) {
        pieces.push({
          id: i,
          x: Math.random() * 100,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          delay: Math.random() * 0.5,
          rotation: Math.random() * 360,
          size: Math.random() * 8 + 6,
        });
      }
      return pieces;
    }, [confettiCount]);

    const handleClose = useCallback(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, [onClose]);

    const handleAction = useCallback(() => {
      if (onAction) {
        onAction();
      }
      handleClose();
    }, [onAction, handleClose]);

    // Animate in
    useEffect(() => {
      if (isOpen) {
        setTimeout(() => setIsVisible(true), 50);
      }
    }, [isOpen]);

    // Auto-close
    useEffect(() => {
      if (isOpen && autoCloseDelay > 0) {
        const timer = setTimeout(handleClose, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    }, [isOpen, autoCloseDelay, handleClose]);

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={`
          fixed inset-0 z-50 flex items-center justify-center
          transition-opacity duration-300
          ${isVisible ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        onClick={handleClose}
        {...props}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Confetti */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className={`absolute ${piece.color} rounded-sm animate-confetti-fall`}
              style={{
                left: `${piece.x}%`,
                width: `${piece.size}px`,
                height: `${piece.size * 1.5}px`,
                animationDelay: `${piece.delay}s`,
                transform: `rotate(${piece.rotation}deg)`,
              }}
            />
          ))}
        </div>

        {/* Celebration card */}
        <div
          className={`
            relative bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center
            transform transition-all duration-500
            ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-4'}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="relative mb-6">
            <div
              className={`
                w-24 h-24 mx-auto bg-gradient-to-br ${config.iconBg}
                rounded-full flex items-center justify-center shadow-lg
                animate-bounce-gentle
              `}
            >
              {icon || (
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            </div>

            {/* Sparkles */}
            <Sparkle className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 text-sunshine" delay={0} />
            <Sparkle className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 text-tide" delay={0.3} />
            <Sparkle className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 text-success" delay={0.6} />
          </div>

          {/* Text */}
          <h2
            className={`
              text-3xl font-bold mb-2
              text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}
            `}
          >
            {title}
          </h2>
          {subtitle && <p className="text-xl font-semibold text-abyss mb-2">{subtitle}</p>}
          {message && <p className="text-lagoon mb-6">{message}</p>}

          {/* Action button */}
          <button
            onClick={handleAction}
            className={`
              w-full py-3 bg-gradient-to-r ${config.gradient}
              text-white rounded-xl font-semibold
              hover:opacity-90 transition-all
              shadow-lg
            `}
          >
            {actionLabel}
          </button>

          {/* Dismiss hint */}
          <p className="text-xs text-lagoon/70 mt-3">Click anywhere to close</p>
        </div>
      </div>
    );
  }
);

CelebrationOverlay.displayName = 'CelebrationOverlay';

// Sparkle component
function Sparkle({ className, delay }: { className?: string; delay: number }) {
  return (
    <svg
      className={`${className} animate-pulse`}
      style={{ animationDelay: `${delay}s` }}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    </svg>
  );
}

export default CelebrationOverlay;
