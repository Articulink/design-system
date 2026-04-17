'use client';

import { forwardRef, useState, useCallback, useEffect, useRef } from 'react';

/**
 * Articulink Carousel Component
 *
 * Image/content carousel with navigation.
 *
 * Usage:
 *   <Carousel>
 *     <CarouselSlide>Slide 1</CarouselSlide>
 *     <CarouselSlide>Slide 2</CarouselSlide>
 *   </Carousel>
 */

export interface CarouselProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children: React.ReactNode;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
  startIndex?: number;
  onChange?: (index: number) => void;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      autoPlay = false,
      autoPlayInterval = 5000,
      showArrows = true,
      showDots = true,
      loop = true,
      startIndex = 0,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const slides = Array.isArray(children) ? children : [children];
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const goToSlide = useCallback(
      (index: number) => {
        let newIndex = index;
        if (loop) {
          if (index < 0) newIndex = slides.length - 1;
          if (index >= slides.length) newIndex = 0;
        } else {
          if (index < 0) newIndex = 0;
          if (index >= slides.length) newIndex = slides.length - 1;
        }
        setCurrentIndex(newIndex);
        onChange?.(newIndex);
      },
      [slides.length, loop, onChange]
    );

    const goToNext = useCallback(() => {
      goToSlide(currentIndex + 1);
    }, [currentIndex, goToSlide]);

    const goToPrev = useCallback(() => {
      goToSlide(currentIndex - 1);
    }, [currentIndex, goToSlide]);

    // Auto-play
    useEffect(() => {
      if (autoPlay && !isHovered) {
        timerRef.current = setInterval(goToNext, autoPlayInterval);
        return () => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
        };
      }
    }, [autoPlay, autoPlayInterval, goToNext, isHovered]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    const canGoPrev = loop || currentIndex > 0;
    const canGoNext = loop || currentIndex < slides.length - 1;

    return (
      <div
        ref={ref}
        className={`relative overflow-hidden rounded-xl ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Image carousel"
        {...props}
      >
        {/* Slides container */}
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slides.length}`}
            >
              {slide}
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {showArrows && slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              disabled={!canGoPrev}
              className={`
                absolute left-3 top-1/2 -translate-y-1/2
                w-10 h-10 flex items-center justify-center
                bg-white/90 rounded-full shadow-lg
                transition-all
                ${canGoPrev ? 'hover:bg-white hover:scale-110' : 'opacity-50 cursor-not-allowed'}
              `}
              aria-label="Previous slide"
            >
              <svg
                className="w-5 h-5 text-abyss"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goToNext}
              disabled={!canGoNext}
              className={`
                absolute right-3 top-1/2 -translate-y-1/2
                w-10 h-10 flex items-center justify-center
                bg-white/90 rounded-full shadow-lg
                transition-all
                ${canGoNext ? 'hover:bg-white hover:scale-110' : 'opacity-50 cursor-not-allowed'}
              `}
              aria-label="Next slide"
            >
              <svg
                className="w-5 h-5 text-abyss"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {showDots && slides.length > 1 && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2"
            role="tablist"
          >
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={`
                  w-2.5 h-2.5 rounded-full transition-all
                  ${
                    index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-white/50 hover:bg-white/75'
                  }
                `}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

Carousel.displayName = 'Carousel';

/**
 * CarouselSlide
 */
export interface CarouselSlideProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CarouselSlide = forwardRef<HTMLDivElement, CarouselSlideProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CarouselSlide.displayName = 'CarouselSlide';

export default Carousel;
