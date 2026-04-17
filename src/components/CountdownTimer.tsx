'use client';

import { forwardRef, useState, useEffect, useCallback } from 'react';

/**
 * Articulink CountdownTimer Component
 *
 * Countdown timer with visual states for upcoming, now, and past.
 *
 * Usage:
 *   <CountdownTimer targetTime={sessionDate} />
 *   <CountdownTimer targetTime={date} onTimeReached={() => alert('Time!')} />
 */

export interface CountdownTimerProps extends React.HTMLAttributes<HTMLDivElement> {
  targetTime: Date;
  onTimeReached?: () => void;
  urgentThreshold?: number; // Minutes before target to show urgent state
  pastThreshold?: number; // Minutes after target before showing "past" state
  showSeconds?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

interface TimeState {
  hours: number;
  minutes: number;
  seconds: number;
  isNow: boolean;
  isPast: boolean;
  isUrgent: boolean;
}

const sizeClasses = {
  sm: {
    container: 'text-2xl',
    digit: 'px-2 py-1',
    label: 'text-xs',
  },
  md: {
    container: 'text-4xl',
    digit: 'px-3 py-2',
    label: 'text-sm',
  },
  lg: {
    container: 'text-5xl',
    digit: 'px-4 py-3',
    label: 'text-base',
  },
};

export const CountdownTimer = forwardRef<HTMLDivElement, CountdownTimerProps>(
  (
    {
      targetTime,
      onTimeReached,
      urgentThreshold = 10,
      pastThreshold = 5,
      showSeconds = true,
      size = 'md',
      label = 'Time remaining',
      className = '',
      ...props
    },
    ref
  ) => {
    const [timeState, setTimeState] = useState<TimeState>({
      hours: 0,
      minutes: 0,
      seconds: 0,
      isNow: false,
      isPast: false,
      isUrgent: false,
    });

    const calculateTimeLeft = useCallback(() => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        const minutesPast = Math.abs(Math.floor(diff / 1000 / 60));
        setTimeState({
          hours: 0,
          minutes: minutesPast,
          seconds: Math.abs(Math.floor((diff / 1000) % 60)),
          isNow: minutesPast < pastThreshold,
          isPast: true,
          isUrgent: false,
        });

        if (minutesPast === 0 && onTimeReached) {
          onTimeReached();
        }
      } else {
        const totalMinutes = Math.floor(diff / 1000 / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeState({
          hours,
          minutes,
          seconds,
          isNow: false,
          isPast: false,
          isUrgent: totalMinutes < urgentThreshold,
        });
      }
    }, [targetTime, onTimeReached, urgentThreshold, pastThreshold]);

    useEffect(() => {
      calculateTimeLeft();
      const interval = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(interval);
    }, [calculateTimeLeft]);

    const formatTime = (value: number) => value.toString().padStart(2, '0');
    const styles = sizeClasses[size];

    // "Now" state
    if (timeState.isNow) {
      return (
        <div ref={ref} className={`text-center ${className}`} {...props}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-bg text-success-text rounded-full animate-pulse">
            <span className="w-2 h-2 bg-success rounded-full" />
            <span className="font-semibold">Starting now</span>
          </div>
        </div>
      );
    }

    // "Past" state (beyond threshold)
    if (timeState.isPast && timeState.minutes >= pastThreshold) {
      return (
        <div ref={ref} className={`text-center ${className}`} {...props}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning-bg text-warning-text rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">Started {timeState.minutes} minutes ago</span>
          </div>
        </div>
      );
    }

    // Countdown state
    return (
      <div ref={ref} className={`text-center ${className}`} {...props}>
        {label && <p className={`text-lagoon mb-2 ${styles.label}`}>{label}</p>}

        <div
          className={`
            inline-flex items-center gap-1 font-bold
            ${styles.container}
            ${timeState.isUrgent ? 'text-tide' : 'text-abyss'}
          `}
        >
          {timeState.hours > 0 && (
            <>
              <div
                className={`
                  ${styles.digit} rounded-lg
                  ${timeState.isUrgent ? 'bg-info-bg' : 'bg-mist'}
                `}
              >
                {formatTime(timeState.hours)}
              </div>
              <span className="text-lagoon/40">:</span>
            </>
          )}

          <div
            className={`
              ${styles.digit} rounded-lg
              ${timeState.isUrgent ? 'bg-info-bg' : 'bg-mist'}
            `}
          >
            {formatTime(timeState.minutes)}
          </div>

          {showSeconds && (
            <>
              <span className="text-lagoon/40">:</span>
              <div
                className={`
                  ${styles.digit} rounded-lg
                  ${timeState.isUrgent ? 'bg-info-bg' : 'bg-mist'}
                `}
              >
                {formatTime(timeState.seconds)}
              </div>
            </>
          )}
        </div>

        <p className={`text-lagoon/60 mt-2 ${styles.label}`}>
          {timeState.hours > 0 ? 'hours' : showSeconds ? 'minutes : seconds' : 'minutes'}
        </p>
      </div>
    );
  }
);

CountdownTimer.displayName = 'CountdownTimer';

export default CountdownTimer;
