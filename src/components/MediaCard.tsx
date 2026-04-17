'use client';

import { forwardRef, useState } from 'react';

/**
 * Articulink MediaCard Component
 *
 * Card for displaying media content with thumbnail, duration, and metadata.
 *
 * Usage:
 *   <MediaCard
 *     thumbnail="/video-thumb.jpg"
 *     title="Session Recording"
 *     duration={125}
 *     metadata="March 15, 2026"
 *     onClick={() => playVideo()}
 *   />
 */

export type MediaCardType = 'video' | 'audio' | 'image' | 'document';

export interface MediaCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  thumbnail?: string | null;
  title: string;
  type?: MediaCardType;
  duration?: number; // in seconds
  metadata?: string;
  badge?: React.ReactNode;
  status?: 'ready' | 'processing' | 'error';
  onClick?: () => void;
  onDelete?: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const typeIcons: Record<MediaCardType, React.ReactNode> = {
  video: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  audio: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  ),
  image: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  document: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

const statusStyles = {
  ready: '',
  processing: 'opacity-75',
  error: 'opacity-50',
};

export const MediaCard = forwardRef<HTMLDivElement, MediaCardProps>(
  (
    {
      thumbnail,
      title,
      type = 'video',
      duration,
      metadata,
      badge,
      status = 'ready',
      onClick,
      onDelete,
      className = '',
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const showPlaceholder = !thumbnail || imageError;

    return (
      <div
        ref={ref}
        className={`
          group relative
          bg-white rounded-xl overflow-hidden
          border border-mist
          transition-all duration-200
          hover:shadow-md hover:border-tide/30
          ${onClick ? 'cursor-pointer' : ''}
          ${statusStyles[status]}
          ${className}
        `}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        {...props}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-mist">
          {showPlaceholder ? (
            <div className="absolute inset-0 flex items-center justify-center text-lagoon/50">
              {typeIcons[type]}
            </div>
          ) : (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}

          {/* Play overlay for video/audio */}
          {(type === 'video' || type === 'audio') && onClick && (
            <div className="absolute inset-0 flex items-center justify-center bg-abyss/0 group-hover:bg-abyss/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-tide opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                {typeIcons.video}
              </div>
            </div>
          )}

          {/* Duration badge */}
          {duration !== undefined && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-abyss/80 text-white text-xs font-medium rounded">
              {formatDuration(duration)}
            </div>
          )}

          {/* Custom badge */}
          {badge && (
            <div className="absolute top-2 left-2">
              {badge}
            </div>
          )}

          {/* Processing indicator */}
          {status === 'processing' && (
            <div className="absolute inset-0 flex items-center justify-center bg-abyss/50">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Error indicator */}
          {status === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center bg-error/20">
              <div className="w-10 h-10 rounded-full bg-error-bg flex items-center justify-center">
                <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h4 className="text-sm font-medium text-abyss truncate">
            {title}
          </h4>
          {metadata && (
            <p className="text-xs text-lagoon mt-0.5 truncate">
              {metadata}
            </p>
          )}
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="
              absolute top-2 right-2
              w-7 h-7 rounded-full
              bg-abyss/60 hover:bg-error
              text-white
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition-all
              focus:outline-none focus:opacity-100
            "
            aria-label={`Delete ${title}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

MediaCard.displayName = 'MediaCard';

export default MediaCard;
