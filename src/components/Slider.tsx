'use client';

import { forwardRef, useState, useRef, useCallback, useEffect } from 'react';

/**
 * Articulink Slider Component
 *
 * Range slider input for selecting numeric values.
 *
 * Usage:
 *   <Slider value={50} onChange={setValue} />
 *   <Slider value={[20, 80]} onChange={setRange} min={0} max={100} />
 */

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: number | [number, number];
  onChange: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  showValue?: boolean;
  showTicks?: boolean;
  tickCount?: number;
  formatValue?: (value: number) => string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { track: 'h-1', thumb: 'w-3 h-3', label: 'text-xs' },
  md: { track: 'h-2', thumb: 'w-4 h-4', label: 'text-sm' },
  lg: { track: 'h-3', thumb: 'w-5 h-5', label: 'text-base' },
};

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      value,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      showValue = false,
      showTicks = false,
      tickCount = 5,
      formatValue = (v) => String(v),
      label,
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const isRange = Array.isArray(value);
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
    const styles = sizeClasses[size];

    const getValueFromPosition = useCallback(
      (clientX: number): number => {
        if (!trackRef.current) return min;
        const rect = trackRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawValue = min + percent * (max - min);
        const steppedValue = Math.round(rawValue / step) * step;
        return Math.max(min, Math.min(max, steppedValue));
      },
      [min, max, step]
    );

    const getPercent = (val: number): number => {
      return ((val - min) / (max - min)) * 100;
    };

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const newValue = getValueFromPosition(e.clientX);

      if (isRange) {
        const [start, end] = value as [number, number];
        const distToStart = Math.abs(newValue - start);
        const distToEnd = Math.abs(newValue - end);
        if (distToStart < distToEnd) {
          onChange([newValue, end]);
        } else {
          onChange([start, newValue]);
        }
      } else {
        onChange(newValue);
      }
    };

    const handleMouseDown = (type: 'start' | 'end') => (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(type);
    };

    const handleMouseMove = useCallback(
      (e: MouseEvent) => {
        if (!isDragging) return;
        const newValue = getValueFromPosition(e.clientX);

        if (isRange) {
          const [start, end] = value as [number, number];
          if (isDragging === 'start') {
            onChange([Math.min(newValue, end - step), end]);
          } else {
            onChange([start, Math.max(newValue, start + step)]);
          }
        } else {
          onChange(newValue);
        }
      },
      [isDragging, isRange, value, onChange, getValueFromPosition, step]
    );

    const handleMouseUp = useCallback(() => {
      setIsDragging(null);
    }, []);

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Handle keyboard
    const handleKeyDown = (type: 'start' | 'end') => (e: React.KeyboardEvent) => {
      if (disabled) return;

      let delta = 0;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -step;
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = step;
      if (e.key === 'Home') {
        if (isRange) {
          const [, end] = value as [number, number];
          onChange(type === 'start' ? [min, end] : [min, min]);
        } else {
          onChange(min);
        }
        return;
      }
      if (e.key === 'End') {
        if (isRange) {
          const [start] = value as [number, number];
          onChange(type === 'end' ? [start, max] : [max, max]);
        } else {
          onChange(max);
        }
        return;
      }

      if (delta !== 0) {
        e.preventDefault();
        if (isRange) {
          const [start, end] = value as [number, number];
          if (type === 'start') {
            const newStart = Math.max(min, Math.min(end - step, start + delta));
            onChange([newStart, end]);
          } else {
            const newEnd = Math.min(max, Math.max(start + step, end + delta));
            onChange([start, newEnd]);
          }
        } else {
          onChange(Math.max(min, Math.min(max, (value as number) + delta)));
        }
      }
    };

    const startValue = isRange ? (value as [number, number])[0] : min;
    const endValue = isRange ? (value as [number, number])[1] : (value as number);

    // Generate ticks
    const ticks = showTicks
      ? Array.from({ length: tickCount }, (_, i) => min + (i * (max - min)) / (tickCount - 1))
      : [];

    return (
      <div ref={ref} className={className} {...props}>
        {/* Label and value display */}
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && <label className={`font-medium text-abyss ${styles.label}`}>{label}</label>}
            {showValue && (
              <span className={`text-lagoon ${styles.label}`}>
                {isRange
                  ? `${formatValue(startValue)} - ${formatValue(endValue)}`
                  : formatValue(endValue)}
              </span>
            )}
          </div>
        )}

        {/* Slider track */}
        <div
          ref={trackRef}
          className={`
            relative w-full bg-mist rounded-full
            ${styles.track}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={handleTrackClick}
        >
          {/* Filled track */}
          <div
            className="absolute h-full bg-tide rounded-full"
            style={{
              left: isRange ? `${getPercent(startValue)}%` : '0%',
              width: isRange
                ? `${getPercent(endValue) - getPercent(startValue)}%`
                : `${getPercent(endValue)}%`,
            }}
          />

          {/* Start thumb (for range) */}
          {isRange && (
            <div
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={startValue}
              aria-label="Minimum value"
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                ${styles.thumb}
                bg-white border-2 border-tide rounded-full shadow
                ${disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
                focus:outline-none focus:ring-2 focus:ring-tide focus:ring-offset-2
                transition-shadow
                ${isDragging === 'start' ? 'ring-2 ring-tide ring-offset-2' : ''}
              `}
              style={{ left: `${getPercent(startValue)}%` }}
              onMouseDown={handleMouseDown('start')}
              onKeyDown={handleKeyDown('start')}
            />
          )}

          {/* End thumb */}
          <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={endValue}
            aria-label={isRange ? 'Maximum value' : 'Value'}
            className={`
              absolute top-1/2 -translate-y-1/2 -translate-x-1/2
              ${styles.thumb}
              bg-white border-2 border-tide rounded-full shadow
              ${disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
              focus:outline-none focus:ring-2 focus:ring-tide focus:ring-offset-2
              transition-shadow
              ${isDragging === 'end' ? 'ring-2 ring-tide ring-offset-2' : ''}
            `}
            style={{ left: `${getPercent(endValue)}%` }}
            onMouseDown={handleMouseDown('end')}
            onKeyDown={handleKeyDown('end')}
          />
        </div>

        {/* Ticks */}
        {showTicks && (
          <div className="relative w-full mt-2">
            {ticks.map((tick, i) => (
              <div
                key={i}
                className="absolute text-xs text-lagoon -translate-x-1/2"
                style={{ left: `${getPercent(tick)}%` }}
              >
                {formatValue(tick)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export default Slider;
