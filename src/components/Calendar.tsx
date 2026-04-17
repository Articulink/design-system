'use client';

import { forwardRef, useState, useMemo, useCallback } from 'react';

/**
 * Articulink Calendar Component
 *
 * Month calendar view for date selection.
 *
 * Usage:
 *   <Calendar value={selectedDate} onChange={setSelectedDate} />
 *   <Calendar value={dateRange} onChange={setDateRange} mode="range" />
 */

export type CalendarMode = 'single' | 'range' | 'multiple';

export interface CalendarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date | Date[] | [Date, Date] | null;
  onChange?: (value: Date | Date[] | [Date, Date] | null) => void;
  mode?: CalendarMode;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  showOutsideDays?: boolean;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  numberOfMonths?: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      onChange,
      mode = 'single',
      minDate,
      maxDate,
      disabledDates = [],
      highlightedDates = [],
      showOutsideDays = true,
      weekStartsOn = 0,
      numberOfMonths = 1,
      className = '',
      ...props
    },
    ref
  ) => {
    const [viewDate, setViewDate] = useState(() => {
      if (value) {
        if (Array.isArray(value)) {
          return value[0] || new Date();
        }
        return value;
      }
      return new Date();
    });

    const [rangeStart, setRangeStart] = useState<Date | null>(null);

    // Get days for the month view
    const getDaysInMonth = useCallback((year: number, month: number) => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = (firstDay.getDay() - weekStartsOn + 7) % 7;

      const days: (Date | null)[] = [];

      // Add previous month days
      if (showOutsideDays) {
        const prevMonth = new Date(year, month, 0);
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
          days.push(new Date(year, month - 1, prevMonth.getDate() - i));
        }
      } else {
        for (let i = 0; i < startingDayOfWeek; i++) {
          days.push(null);
        }
      }

      // Add current month days
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }

      // Add next month days
      const remainingDays = 42 - days.length;
      if (showOutsideDays) {
        for (let i = 1; i <= remainingDays; i++) {
          days.push(new Date(year, month + 1, i));
        }
      } else {
        for (let i = 0; i < remainingDays; i++) {
          days.push(null);
        }
      }

      return days;
    }, [weekStartsOn, showOutsideDays]);

    const isDateDisabled = useCallback((date: Date): boolean => {
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      return disabledDates.some((d) => isSameDay(d, date));
    }, [minDate, maxDate, disabledDates]);

    const isDateSelected = useCallback((date: Date): boolean => {
      if (!value) return false;

      if (mode === 'single' && value instanceof Date) {
        return isSameDay(date, value);
      }

      if (mode === 'multiple' && Array.isArray(value)) {
        return value.some((d) => isSameDay(d, date));
      }

      if (mode === 'range' && Array.isArray(value) && value.length === 2) {
        return isSameDay(date, value[0]) || isSameDay(date, value[1]);
      }

      return false;
    }, [value, mode]);

    const isDateInRange = useCallback((date: Date): boolean => {
      if (mode !== 'range') return false;

      if (Array.isArray(value) && value.length === 2) {
        return isInRange(date, value[0], value[1]);
      }

      if (rangeStart) {
        return false; // Will be handled by hover state
      }

      return false;
    }, [value, mode, rangeStart]);

    const isDateHighlighted = useCallback((date: Date): boolean => {
      return highlightedDates.some((d) => isSameDay(d, date));
    }, [highlightedDates]);

    const handleDateClick = useCallback((date: Date) => {
      if (isDateDisabled(date)) return;

      if (mode === 'single') {
        onChange?.(date);
      } else if (mode === 'multiple') {
        const current = (value as Date[]) || [];
        const exists = current.findIndex((d) => isSameDay(d, date));
        if (exists >= 0) {
          onChange?.(current.filter((_, i) => i !== exists));
        } else {
          onChange?.([...current, date]);
        }
      } else if (mode === 'range') {
        if (!rangeStart) {
          setRangeStart(date);
        } else {
          const start = date < rangeStart ? date : rangeStart;
          const end = date < rangeStart ? rangeStart : date;
          onChange?.([start, end]);
          setRangeStart(null);
        }
      }
    }, [mode, value, onChange, rangeStart, isDateDisabled]);

    const navigateMonth = (delta: number) => {
      setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
    };

    const navigateYear = (delta: number) => {
      setViewDate((d) => new Date(d.getFullYear() + delta, d.getMonth(), 1));
    };

    // Generate month views
    const monthViews = useMemo(() => {
      const views = [];
      for (let i = 0; i < numberOfMonths; i++) {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth() + i;
        const adjustedDate = new Date(year, month, 1);
        views.push({
          year: adjustedDate.getFullYear(),
          month: adjustedDate.getMonth(),
          days: getDaysInMonth(adjustedDate.getFullYear(), adjustedDate.getMonth()),
        });
      }
      return views;
    }, [viewDate, numberOfMonths, getDaysInMonth]);

    // Reorder days based on weekStartsOn
    const orderedDays = useMemo(() => {
      return [...DAYS.slice(weekStartsOn), ...DAYS.slice(0, weekStartsOn)];
    }, [weekStartsOn]);

    const today = new Date();

    return (
      <div ref={ref} className={`inline-block ${className}`} {...props}>
        <div className={`flex gap-4 ${numberOfMonths > 1 ? 'flex-wrap' : ''}`}>
          {monthViews.map((view, viewIndex) => (
            <div key={`${view.year}-${view.month}`} className="bg-white rounded-xl border border-mist p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                {viewIndex === 0 && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => navigateYear(-1)}
                      className="p-1.5 hover:bg-mist rounded-lg transition-colors"
                      aria-label="Previous year"
                    >
                      <svg className="w-4 h-4 text-lagoon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateMonth(-1)}
                      className="p-1.5 hover:bg-mist rounded-lg transition-colors"
                      aria-label="Previous month"
                    >
                      <svg className="w-4 h-4 text-lagoon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>
                )}

                <h2 className="font-semibold text-abyss flex-1 text-center">
                  {MONTHS[view.month]} {view.year}
                </h2>

                {viewIndex === monthViews.length - 1 && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => navigateMonth(1)}
                      className="p-1.5 hover:bg-mist rounded-lg transition-colors"
                      aria-label="Next month"
                    >
                      <svg className="w-4 h-4 text-lagoon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateYear(1)}
                      className="p-1.5 hover:bg-mist rounded-lg transition-colors"
                      aria-label="Next year"
                    >
                      <svg className="w-4 h-4 text-lagoon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {orderedDays.map((day) => (
                  <div
                    key={day}
                    className="h-8 flex items-center justify-center text-xs font-medium text-lagoon"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {view.days.map((date, index) => {
                  if (!date) {
                    return <div key={index} className="h-9" />;
                  }

                  const isCurrentMonth = date.getMonth() === view.month;
                  const isDisabled = isDateDisabled(date);
                  const isSelected = isDateSelected(date);
                  const inRange = isDateInRange(date);
                  const isHighlighted = isDateHighlighted(date);
                  const isToday = isSameDay(date, today);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateClick(date)}
                      disabled={isDisabled}
                      className={`
                        h-9 w-9 flex items-center justify-center text-sm rounded-lg
                        transition-colors
                        ${!isCurrentMonth ? 'text-lagoon/40' : ''}
                        ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-mist cursor-pointer'}
                        ${isSelected ? 'bg-tide text-white hover:bg-tide' : ''}
                        ${inRange && !isSelected ? 'bg-info-bg' : ''}
                        ${isHighlighted && !isSelected ? 'ring-2 ring-tide ring-inset' : ''}
                        ${isToday && !isSelected ? 'font-bold text-tide' : ''}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export default Calendar;
