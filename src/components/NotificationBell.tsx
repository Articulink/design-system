'use client';

import { forwardRef, useState, useRef, useEffect } from 'react';

/**
 * Articulink NotificationBell Component
 *
 * Notification indicator with dropdown.
 *
 * Usage:
 *   <NotificationBell count={3} notifications={notifications} />
 */

export interface Notification {
  id: string;
  title: string;
  message?: string;
  timestamp: string | Date;
  read?: boolean;
  href?: string;
  icon?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface NotificationBellProps extends React.HTMLAttributes<HTMLDivElement> {
  notifications: Notification[];
  count?: number;
  maxCount?: number;
  onNotificationClick?: (notification: Notification) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  emptyMessage?: string;
}

const typeColors = {
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-error',
};

export const NotificationBell = forwardRef<HTMLDivElement, NotificationBellProps>(
  (
    {
      notifications,
      count: customCount,
      maxCount = 99,
      onNotificationClick,
      onMarkAllRead,
      onViewAll,
      emptyMessage = 'No notifications',
      className = '',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const unreadCount = customCount ?? notifications.filter((n) => !n.read).length;
    const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount;

    // Close on click outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTimestamp = (timestamp: string | Date) => {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    };

    const handleNotificationClick = (notification: Notification) => {
      onNotificationClick?.(notification);
      if (notification.href) {
        setIsOpen(false);
      }
    };

    return (
      <div ref={ref} className={`relative ${className}`} {...props}>
        <div ref={containerRef}>
          {/* Bell button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`
              relative p-2 rounded-lg transition-colors
              hover:bg-mist focus:outline-none focus-visible:ring-2 focus-visible:ring-tide
              ${isOpen ? 'bg-mist' : ''}
            `}
          >
            <svg
              className="w-6 h-6 text-lagoon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            {/* Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-error rounded-full">
                {displayCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-xl border border-mist shadow-lg overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-mist">
                <h3 className="font-semibold text-abyss">Notifications</h3>
                {unreadCount > 0 && onMarkAllRead && (
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="text-sm text-tide hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-lagoon">{emptyMessage}</div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`
                        w-full flex items-start gap-3 px-4 py-3 text-left
                        hover:bg-mist/50 transition-colors
                        ${!notification.read ? 'bg-info-bg/30' : ''}
                      `}
                    >
                      {/* Icon or type indicator */}
                      {notification.icon ? (
                        <span className="flex-shrink-0 mt-0.5">{notification.icon}</span>
                      ) : notification.type ? (
                        <span
                          className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${typeColors[notification.type]}`}
                        />
                      ) : (
                        <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-tide" />
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm truncate ${
                            notification.read ? 'text-lagoon' : 'text-abyss font-medium'
                          }`}
                        >
                          {notification.title}
                        </p>
                        {notification.message && (
                          <p className="text-sm text-lagoon truncate mt-0.5">
                            {notification.message}
                          </p>
                        )}
                        <p className="text-xs text-lagoon/70 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>

                      {/* Unread indicator */}
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-tide" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              {onViewAll && notifications.length > 0 && (
                <div className="border-t border-mist">
                  <button
                    type="button"
                    onClick={() => {
                      onViewAll();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm text-tide hover:bg-mist/50 transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

NotificationBell.displayName = 'NotificationBell';

export default NotificationBell;
