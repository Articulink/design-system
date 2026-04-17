'use client';

import { forwardRef, useState } from 'react';

/**
 * Articulink Avatar Component
 *
 * User avatars with image support and initials fallback.
 *
 * Usage:
 *   <Avatar src="/user.jpg" alt="John Doe" />
 *   <Avatar name="John Doe" />
 *   <Avatar name="John Doe" size="lg" />
 */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-xs' },
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-12 h-12', text: 'text-base' },
  xl: { container: 'w-16 h-16', text: 'text-lg' },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Generate consistent color based on name
function getColorFromName(name: string): string {
  const colors = [
    'bg-tide text-white',
    'bg-surf text-white',
    'bg-lagoon text-white',
    'bg-success text-white',
    'bg-warning text-abyss',
    'bg-info text-white',
    'bg-coral text-white',
    'bg-seafoam text-abyss',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, size = 'md', className = '', ...props }, ref) => {
    const [imageError, setImageError] = useState(false);
    const showImage = src && !imageError;
    const initials = name ? getInitials(name) : '?';
    const colorClass = name ? getColorFromName(name) : 'bg-mist text-lagoon';

    return (
      <div
        ref={ref}
        className={`
          ${sizeStyles[size].container}
          rounded-full overflow-hidden
          flex items-center justify-center
          flex-shrink-0
          ${!showImage ? colorClass : ''}
          ${className}
        `}
        role="img"
        aria-label={alt || name || 'Avatar'}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className={`font-semibold ${sizeStyles[size].text}`}>
            {initials}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
