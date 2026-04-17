'use client';

import { forwardRef, useState, useEffect, useCallback } from 'react';

/**
 * Articulink ImageGallery / Lightbox Component
 *
 * Image gallery with lightbox viewing.
 *
 * Usage:
 *   <ImageGallery images={[{ src: '/img1.jpg', alt: 'Image 1' }]} />
 *   <Lightbox src={imageSrc} isOpen={isOpen} onClose={close} />
 */

export interface GalleryImage {
  src: string;
  alt?: string;
  thumbnail?: string;
  caption?: string;
}

export interface ImageGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: GalleryImage[];
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  aspectRatio?: 'square' | '4:3' | '16:9' | 'auto';
}

const gapClasses = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-4',
};

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
  6: 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6',
};

const aspectClasses = {
  square: 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
  auto: '',
};

export const ImageGallery = forwardRef<HTMLDivElement, ImageGalleryProps>(
  (
    {
      images,
      columns = 4,
      gap = 'md',
      aspectRatio = 'square',
      className = '',
      ...props
    },
    ref
  ) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => {
      setLightboxIndex(index);
    };

    const closeLightbox = () => {
      setLightboxIndex(null);
    };

    const goToPrevious = () => {
      setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
    };

    const goToNext = () => {
      setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));
    };

    return (
      <>
        <div
          ref={ref}
          className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}
          {...props}
        >
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => openLightbox(index)}
              className={`
                relative overflow-hidden rounded-lg bg-mist
                hover:opacity-90 transition-opacity
                focus:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2
                ${aspectClasses[aspectRatio]}
              `}
            >
              <img
                src={image.thumbnail || image.src}
                alt={image.alt || `Image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrevious={goToPrevious}
            onNext={goToNext}
          />
        )}
      </>
    );
  }
);

ImageGallery.displayName = 'ImageGallery';

/**
 * Lightbox - Full-screen image viewer
 */
export interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const Lightbox = forwardRef<HTMLDivElement, LightboxProps>(
  ({ images, currentIndex, onClose, onPrevious, onNext }, ref) => {
    const currentImage = images[currentIndex];

    // Keyboard navigation
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Escape':
            onClose();
            break;
          case 'ArrowLeft':
            onPrevious();
            break;
          case 'ArrowRight':
            onNext();
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [onClose, onPrevious, onNext]);

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/95"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Previous button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Image */}
        <div
          className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentImage.src}
            alt={currentImage.alt || `Image ${currentIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
          {currentImage.caption && (
            <p className="mt-4 text-white/80 text-center max-w-lg">{currentImage.caption}</p>
          )}
          {images.length > 1 && (
            <p className="mt-2 text-white/60 text-sm">
              {currentIndex + 1} / {images.length}
            </p>
          )}
        </div>

        {/* Next button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto py-2 px-4">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to this image
                  const diff = index - currentIndex;
                  if (diff > 0) {
                    for (let i = 0; i < diff; i++) onNext();
                  } else {
                    for (let i = 0; i < -diff; i++) onPrevious();
                  }
                }}
                className={`
                  w-16 h-16 flex-shrink-0 rounded overflow-hidden
                  ${index === currentIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'}
                  transition-opacity
                `}
              >
                <img
                  src={image.thumbnail || image.src}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Lightbox.displayName = 'Lightbox';

/**
 * SimpleLightbox - Single image lightbox
 */
export interface SimpleLightboxProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SimpleLightbox = forwardRef<HTMLDivElement, SimpleLightboxProps>(
  ({ src, alt, isOpen, onClose }, ref) => {
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/95"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <img
          src={src}
          alt={alt || 'Image'}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }
);

SimpleLightbox.displayName = 'SimpleLightbox';

export default ImageGallery;
