'use client';

import { forwardRef, useEffect, useState, useRef } from 'react';

/**
 * Articulink Animation Components
 *
 * Reusable animation utilities and presets.
 *
 * Usage:
 *   <FadeIn>Content</FadeIn>
 *   <SlideIn direction="up">Content</SlideIn>
 *   <ScaleIn>Content</ScaleIn>
 *   <Animate animation="bounce">Content</Animate>
 */

export type AnimationPreset =
  | 'fadeIn'
  | 'fadeOut'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleIn'
  | 'scaleOut'
  | 'bounce'
  | 'pulse'
  | 'shake'
  | 'spin'
  | 'ping'
  | 'wiggle';

export interface AnimateProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animation: AnimationPreset;
  duration?: number;
  delay?: number;
  easing?: string;
  repeat?: number | 'infinite';
  trigger?: 'mount' | 'hover' | 'click' | 'inView';
  threshold?: number;
  onAnimationEnd?: () => void;
}

const animationKeyframes: Record<AnimationPreset, string> = {
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  slideLeft: 'animate-slide-left',
  slideRight: 'animate-slide-right',
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  shake: 'animate-shake',
  spin: 'animate-spin',
  ping: 'animate-ping',
  wiggle: 'animate-wiggle',
};

export const Animate = forwardRef<HTMLDivElement, AnimateProps>(
  (
    {
      children,
      animation,
      duration = 300,
      delay = 0,
      easing = 'ease-out',
      repeat = 1,
      trigger = 'mount',
      threshold = 0.1,
      onAnimationEnd,
      className = '',
      ...props
    },
    ref
  ) => {
    const [shouldAnimate, setShouldAnimate] = useState(trigger === 'mount');
    const [isInView, setIsInView] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    // IntersectionObserver for inView trigger
    useEffect(() => {
      if (trigger !== 'inView') return;

      const element = elementRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true);
            setShouldAnimate(true);
          }
        },
        { threshold }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }, [trigger, threshold, isInView]);

    const handleMouseEnter = () => {
      if (trigger === 'hover') {
        setShouldAnimate(true);
      }
    };

    const handleMouseLeave = () => {
      if (trigger === 'hover') {
        setShouldAnimate(false);
      }
    };

    const handleClick = () => {
      if (trigger === 'click') {
        setShouldAnimate(true);
        // Reset after animation
        setTimeout(() => setShouldAnimate(false), duration);
      }
    };

    const animationClass = shouldAnimate ? animationKeyframes[animation] : '';
    const iterationCount = repeat === 'infinite' ? 'infinite' : repeat;

    return (
      <div
        ref={(node) => {
          elementRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={`${animationClass} ${className}`}
        style={{
          animationDuration: `${duration}ms`,
          animationDelay: `${delay}ms`,
          animationTimingFunction: easing,
          animationIterationCount: iterationCount,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onAnimationEnd={onAnimationEnd}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Animate.displayName = 'Animate';

/**
 * FadeIn - Fade in animation wrapper
 */
export interface FadeInProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  trigger?: 'mount' | 'inView';
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, duration = 300, delay = 0, trigger = 'mount', className = '', ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(trigger === 'mount');
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (trigger !== 'inView') return;

      const element = elementRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }, [trigger]);

    return (
      <div
        ref={(node) => {
          elementRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={`transition-opacity ${className}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FadeIn.displayName = 'FadeIn';

/**
 * SlideIn - Slide in animation wrapper
 */
export type SlideDirection = 'up' | 'down' | 'left' | 'right';

export interface SlideInProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode;
  direction?: SlideDirection;
  distance?: number;
  duration?: number;
  delay?: number;
  trigger?: 'mount' | 'inView';
}

export const SlideIn = forwardRef<HTMLDivElement, SlideInProps>(
  (
    {
      children,
      direction = 'up',
      distance = 20,
      duration = 300,
      delay = 0,
      trigger = 'mount',
      className = '',
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(trigger === 'mount');
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (trigger !== 'inView') return;

      const element = elementRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }, [trigger]);

    const getTransform = () => {
      if (isVisible) return 'translate(0, 0)';

      switch (direction) {
        case 'up':
          return `translateY(${distance}px)`;
        case 'down':
          return `translateY(-${distance}px)`;
        case 'left':
          return `translateX(${distance}px)`;
        case 'right':
          return `translateX(-${distance}px)`;
      }
    };

    return (
      <div
        ref={(node) => {
          elementRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={`transition-all ${className}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: getTransform(),
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SlideIn.displayName = 'SlideIn';

/**
 * ScaleIn - Scale in animation wrapper
 */
export interface ScaleInProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode;
  initialScale?: number;
  duration?: number;
  delay?: number;
  trigger?: 'mount' | 'inView';
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  (
    {
      children,
      initialScale = 0.9,
      duration = 300,
      delay = 0,
      trigger = 'mount',
      className = '',
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(trigger === 'mount');
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (trigger !== 'inView') return;

      const element = elementRef.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }, [trigger]);

    return (
      <div
        ref={(node) => {
          elementRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={`transition-all ${className}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : `scale(${initialScale})`,
          transitionDuration: `${duration}ms`,
          transitionDelay: `${delay}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScaleIn.displayName = 'ScaleIn';

/**
 * Stagger - Stagger children animations
 */
export interface StaggerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode;
  staggerDelay?: number;
  animation?: 'fade' | 'slide' | 'scale';
}

export const Stagger = forwardRef<HTMLDivElement, StaggerProps>(
  ({ children, staggerDelay = 50, animation = 'fade', className = '', ...props }, ref) => {
    const childArray = Array.isArray(children) ? children : [children];

    return (
      <div ref={ref} className={className} {...props}>
        {childArray.map((child, index) => {
          const delay = index * staggerDelay;

          switch (animation) {
            case 'slide':
              return (
                <SlideIn key={index} delay={delay}>
                  {child}
                </SlideIn>
              );
            case 'scale':
              return (
                <ScaleIn key={index} delay={delay}>
                  {child}
                </ScaleIn>
              );
            default:
              return (
                <FadeIn key={index} delay={delay}>
                  {child}
                </FadeIn>
              );
          }
        })}
      </div>
    );
  }
);

Stagger.displayName = 'Stagger';

export default Animate;
