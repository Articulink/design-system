'use client';

import { forwardRef, useMemo } from 'react';

/**
 * Articulink WeekSchedule Component
 *
 * Weekly schedule/calendar view for availability and appointments.
 *
 * Usage:
 *   <WeekSchedule
 *     events={events}
 *     startHour={8}
 *     endHour={18}
 *     onSlotClick={(day, hour) => handleSlotClick(day, hour)}
 *   />
 */

export interface ScheduleEvent {
  id: string;
  title: string;
  day: number; // 0 = Sunday, 1 = Monday, etc.
  startHour: number;
  startMinute?: number;
  duration: number; // in minutes
  color?: string;
  data?: unknown;
}

export interface WeekScheduleProps extends React.HTMLAttributes<HTMLDivElement> {
  events?: ScheduleEvent[];
  startHour?: number;
  endHour?: number;
  startDay?: number; // 0 = Sunday
  dayLabels?: string[];
  showWeekend?: boolean;
  hourHeight?: number;
  onSlotClick?: (day: number, hour: number) => void;
  onEventClick?: (event: ScheduleEvent) => void;
  renderEvent?: (event: ScheduleEvent) => React.ReactNode;
}

const DEFAULT_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEFAULT_COLORS = [
  '#037DE4', // tide
  '#22C55E', // success
  '#F59E0B', // warning
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
];

export const WeekSchedule = forwardRef<HTMLDivElement, WeekScheduleProps>(
  (
    {
      events = [],
      startHour = 8,
      endHour = 18,
      startDay = 1, // Monday
      dayLabels = DEFAULT_DAY_LABELS,
      showWeekend = false,
      hourHeight = 48,
      onSlotClick,
      onEventClick,
      renderEvent,
      className = '',
      ...props
    },
    ref
  ) => {
    // Calculate visible days
    const visibleDays = useMemo(() => {
      const days: number[] = [];
      const numDays = showWeekend ? 7 : 5;
      for (let i = 0; i < numDays; i++) {
        days.push((startDay + i) % 7);
      }
      return days;
    }, [startDay, showWeekend]);

    // Generate hour slots
    const hours = useMemo(() => {
      const h: number[] = [];
      for (let i = startHour; i < endHour; i++) {
        h.push(i);
      }
      return h;
    }, [startHour, endHour]);

    // Group events by day
    const eventsByDay = useMemo(() => {
      const grouped: Record<number, ScheduleEvent[]> = {};
      visibleDays.forEach((day) => {
        grouped[day] = events.filter((e) => e.day === day);
      });
      return grouped;
    }, [events, visibleDays]);

    const formatHour = (hour: number): string => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour} ${period}`;
    };

    const getEventStyle = (event: ScheduleEvent) => {
      const startMinutes = (event.startHour - startHour) * 60 + (event.startMinute || 0);
      const top = (startMinutes / 60) * hourHeight;
      const height = (event.duration / 60) * hourHeight;
      const color = event.color || DEFAULT_COLORS[events.indexOf(event) % DEFAULT_COLORS.length];

      return {
        top: `${top}px`,
        height: `${Math.max(height, 20)}px`,
        backgroundColor: color,
      };
    };

    return (
      <div ref={ref} className={`bg-white rounded-xl border border-mist overflow-hidden ${className}`} {...props}>
        {/* Header */}
        <div className="grid border-b border-mist" style={{ gridTemplateColumns: `64px repeat(${visibleDays.length}, 1fr)` }}>
          {/* Time column header */}
          <div className="p-2 border-r border-mist bg-breeze" />

          {/* Day headers */}
          {visibleDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center font-medium text-abyss border-r border-mist last:border-r-0 bg-breeze"
            >
              {dayLabels[day]}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto" style={{ maxHeight: hours.length * hourHeight }}>
          <div
            className="grid"
            style={{ gridTemplateColumns: `64px repeat(${visibleDays.length}, 1fr)` }}
          >
            {/* Time column */}
            <div className="border-r border-mist">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex items-start justify-end pr-2 text-xs text-lagoon border-b border-mist"
                  style={{ height: hourHeight }}
                >
                  <span className="-mt-2">{formatHour(hour)}</span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {visibleDays.map((day) => (
              <div key={day} className="relative border-r border-mist last:border-r-0">
                {/* Hour slots */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className={`
                      border-b border-mist
                      ${onSlotClick ? 'cursor-pointer hover:bg-mist/50 transition-colors' : ''}
                    `}
                    style={{ height: hourHeight }}
                    onClick={() => onSlotClick?.(day, hour)}
                  />
                ))}

                {/* Events */}
                {eventsByDay[day]?.map((event) => {
                  const style = getEventStyle(event);

                  return (
                    <div
                      key={event.id}
                      className={`
                        absolute left-1 right-1 rounded-lg px-2 py-1 text-white text-xs
                        overflow-hidden
                        ${onEventClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}
                      `}
                      style={style}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      {renderEvent ? (
                        renderEvent(event)
                      ) : (
                        <div className="truncate font-medium">{event.title}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

WeekSchedule.displayName = 'WeekSchedule';

export default WeekSchedule;
