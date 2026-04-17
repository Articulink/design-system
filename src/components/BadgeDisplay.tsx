'use client';

import { forwardRef, ReactNode } from 'react';

/**
 * Articulink BadgeDisplay Components
 *
 * Achievement badge display with rarity levels and progress.
 *
 * Usage:
 *   <BadgeDisplay
 *     icon="🏆"
 *     name="First Steps"
 *     description="Complete your first session"
 *     rarity="common"
 *   />
 *
 *   <BadgeGrid>
 *     {badges.map(badge => <BadgeDisplay key={badge.id} {...badge} />)}
 *   </BadgeGrid>
 */

export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface BadgeDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  name: string;
  description?: string;
  rarity?: BadgeRarity;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  locked?: boolean;
  progress?: number; // 0-100 for locked badges
  earnedAt?: string;
}

const rarityConfig: Record<BadgeRarity, { bg: string; border: string; text: string; glow: string; indicator: string; symbol: string }> = {
  common: {
    bg: 'bg-mist',
    border: 'border-lagoon/30',
    text: 'text-lagoon',
    glow: '',
    indicator: '',
    symbol: '',
  },
  uncommon: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success-text',
    glow: 'shadow-success/20 shadow-md',
    indicator: 'bg-success',
    symbol: '○',
  },
  rare: {
    bg: 'bg-info-bg',
    border: 'border-tide/30',
    text: 'text-tide',
    glow: 'shadow-tide/20 shadow-md',
    indicator: 'bg-tide',
    symbol: '●',
  },
  epic: {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-700',
    glow: 'shadow-purple-500/20 shadow-lg',
    indicator: 'bg-purple-400',
    symbol: '◆',
  },
  legendary: {
    bg: 'bg-warning-bg',
    border: 'border-sunshine',
    text: 'text-warning-text',
    glow: 'shadow-sunshine/30 shadow-lg',
    indicator: 'bg-sunshine',
    symbol: '★',
  },
};

const sizeConfig = {
  sm: { badge: 'w-12 h-12 text-xl', text: 'text-xs', desc: 'text-[10px]' },
  md: { badge: 'w-16 h-16 text-2xl', text: 'text-sm', desc: 'text-xs' },
  lg: { badge: 'w-20 h-20 text-3xl', text: 'text-base', desc: 'text-sm' },
};

export const BadgeDisplay = forwardRef<HTMLDivElement, BadgeDisplayProps>(
  (
    {
      icon,
      name,
      description,
      rarity = 'common',
      size = 'md',
      showDetails = false,
      locked = false,
      progress = 0,
      earnedAt,
      className = '',
      ...props
    },
    ref
  ) => {
    const rarityStyles = rarityConfig[rarity];
    const sizeStyles = sizeConfig[size];

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center ${showDetails ? 'gap-2' : ''} ${className}`}
        {...props}
      >
        {/* Badge icon */}
        <div className="relative group">
          <div
            className={`
              ${sizeStyles.badge}
              ${locked ? 'bg-mist border-mist' : `${rarityStyles.bg} ${rarityStyles.border}`}
              border-2 rounded-full flex items-center justify-center
              ${locked ? '' : rarityStyles.glow}
              transition-transform hover:scale-110
            `}
          >
            <span className={locked ? 'grayscale opacity-30' : ''}>{icon}</span>
          </div>

          {/* Progress ring for locked badges */}
          {locked && progress > 0 && (
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="2" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="var(--tide)"
                strokeWidth="2"
                strokeDasharray={`${progress} 100`}
                strokeLinecap="round"
              />
            </svg>
          )}

          {/* Rarity indicator */}
          {!locked && rarity !== 'common' && (
            <div
              className={`
                absolute -bottom-1 -right-1 w-4 h-4 rounded-full
                flex items-center justify-center text-[8px] text-white
                ${rarityStyles.indicator}
              `}
            >
              {rarityStyles.symbol}
            </div>
          )}

          {/* Tooltip on hover */}
          {!showDetails && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-abyss text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10 shadow-lg pointer-events-none">
              <p className="font-semibold">{name}</p>
              {description && <p className="text-white/70 text-[10px]">{description}</p>}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-abyss" />
            </div>
          )}
        </div>

        {/* Badge details */}
        {showDetails && (
          <div className="text-center">
            <p className={`font-semibold ${sizeStyles.text} ${locked ? 'text-lagoon/60' : rarityStyles.text}`}>
              {name}
            </p>
            {description && (
              <p className={`text-lagoon ${sizeStyles.desc} max-w-[120px]`}>{description}</p>
            )}
            {locked && progress > 0 && (
              <p className="text-tide text-xs mt-1">{Math.round(progress)}% complete</p>
            )}
            {earnedAt && !locked && (
              <p className="text-lagoon/70 text-[10px] mt-1">Earned {earnedAt}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

BadgeDisplay.displayName = 'BadgeDisplay';

/**
 * BadgeGrid - Grid layout for badges
 */
export interface BadgeGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  columns?: 4 | 5 | 6;
}

export const BadgeGrid = forwardRef<HTMLDivElement, BadgeGridProps>(
  ({ children, columns = 5, className = '', ...props }, ref) => {
    const colClasses = {
      4: 'grid-cols-4',
      5: 'grid-cols-4 sm:grid-cols-5',
      6: 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6',
    };

    return (
      <div ref={ref} className={`grid ${colClasses[columns]} gap-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

BadgeGrid.displayName = 'BadgeGrid';

/**
 * BadgeRow - Compact horizontal badge display
 */
export interface BadgeRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  maxDisplay?: number;
  totalCount?: number;
}

export const BadgeRow = forwardRef<HTMLDivElement, BadgeRowProps>(
  ({ children, maxDisplay = 8, totalCount, className = '', ...props }, ref) => {
    const childArray = Array.isArray(children) ? children : [children];
    const displayChildren = childArray.slice(0, maxDisplay);
    const remaining = totalCount ? totalCount - maxDisplay : childArray.length - maxDisplay;

    return (
      <div ref={ref} className={`flex items-center gap-3 flex-wrap ${className}`} {...props}>
        <div className="flex flex-wrap gap-2">{displayChildren}</div>
        {remaining > 0 && (
          <span className="text-sm font-medium text-lagoon bg-mist px-2 py-1 rounded-full">
            +{remaining} more
          </span>
        )}
      </div>
    );
  }
);

BadgeRow.displayName = 'BadgeRow';

/**
 * RarityLabel - Badge rarity label
 */
export interface RarityLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  rarity: BadgeRarity;
}

export const RarityLabel = forwardRef<HTMLSpanElement, RarityLabelProps>(
  ({ rarity, className = '', ...props }, ref) => {
    const labels: Record<BadgeRarity, string> = {
      common: 'Common',
      uncommon: 'Uncommon',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
    };

    const styles = rarityConfig[rarity];

    return (
      <span
        ref={ref}
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text} ${className}`}
        {...props}
      >
        {labels[rarity]}
      </span>
    );
  }
);

RarityLabel.displayName = 'RarityLabel';

export default BadgeDisplay;
