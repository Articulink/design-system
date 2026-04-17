'use client';

import { forwardRef, useState, useCallback } from 'react';

/**
 * Articulink Rating Component
 *
 * Star rating input for feedback and reviews.
 *
 * Usage:
 *   <Rating value={rating} onChange={setRating} />
 *   <Rating value={rating} onChange={setRating} max={10} icon="heart" />
 */

export type RatingIcon = 'star' | 'heart' | 'circle';
export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  icon?: RatingIcon;
  size?: RatingSize;
  allowHalf?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  showValue?: boolean;
  label?: string;
}

const sizeClasses: Record<RatingSize, { icon: string; gap: string }> = {
  sm: { icon: 'w-4 h-4', gap: 'gap-0.5' },
  md: { icon: 'w-6 h-6', gap: 'gap-1' },
  lg: { icon: 'w-8 h-8', gap: 'gap-1.5' },
};

const StarIcon = ({ filled, half, className }: { filled: boolean; half?: boolean; className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
    {half ? (
      <>
        <defs>
          <linearGradient id="halfFill">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          fill="url(#halfFill)"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </>
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    )}
  </svg>
);

const HeartIcon = ({ filled, className }: { filled: boolean; className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const CircleIcon = ({ filled, className }: { filled: boolean; className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      onChange,
      max = 5,
      icon = 'star',
      size = 'md',
      allowHalf = false,
      readonly = false,
      disabled = false,
      showValue = false,
      label,
      className = '',
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const styles = sizeClasses[size];

    const displayValue = hoverValue ?? value;

    const handleClick = useCallback(
      (index: number, isHalf: boolean) => {
        if (readonly || disabled || !onChange) return;
        const newValue = isHalf && allowHalf ? index + 0.5 : index + 1;
        onChange(newValue);
      },
      [readonly, disabled, onChange, allowHalf]
    );

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        if (readonly || disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const isHalf = allowHalf && e.clientX - rect.left < rect.width / 2;
        setHoverValue(isHalf ? index + 0.5 : index + 1);
      },
      [readonly, disabled, allowHalf]
    );

    const handleMouseLeave = useCallback(() => {
      setHoverValue(null);
    }, []);

    const renderIcon = (index: number) => {
      const filled = displayValue >= index + 1;
      const half = allowHalf && displayValue === index + 0.5;
      const iconClassName = `${styles.icon} transition-transform ${!readonly && !disabled ? 'hover:scale-110' : ''}`;

      const colorClass = filled || half ? 'text-sunshine' : 'text-mist';

      switch (icon) {
        case 'heart':
          return <HeartIcon filled={filled} className={`${iconClassName} ${filled ? 'text-error' : colorClass}`} />;
        case 'circle':
          return <CircleIcon filled={filled} className={`${iconClassName} ${colorClass}`} />;
        default:
          return <StarIcon filled={filled} half={half} className={`${iconClassName} ${colorClass}`} />;
      }
    };

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-semibold text-abyss mb-1.5">
            {label}
          </label>
        )}

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center ${styles.gap}`}
            onMouseLeave={handleMouseLeave}
          >
            {Array.from({ length: max }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const isHalf = allowHalf && e.clientX - rect.left < rect.width / 2;
                  handleClick(index, isHalf);
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                disabled={disabled || readonly}
                className={`
                  p-0 bg-transparent border-0
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-1 rounded
                  ${disabled ? 'opacity-50 cursor-not-allowed' : readonly ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                {renderIcon(index)}
              </button>
            ))}
          </div>

          {showValue && (
            <span className="text-sm text-lagoon font-medium">
              {value.toFixed(allowHalf ? 1 : 0)} / {max}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Rating.displayName = 'Rating';

export default Rating;
