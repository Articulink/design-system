/**
 * Centralized status color definitions using design system tokens.
 *
 * This ensures consistent status styling across all Articulink applications.
 * All colors use the design system tokens (blue-600, navy, yellow, etc.)
 */

// Appointment status colors
export const appointmentStatusColors: Record<string, string> = {
  SCHEDULED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  CONFIRMED: 'bg-blue-800/10 text-blue-800 border-blue-800/20',
  IN_PROGRESS: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  COMPLETED: 'bg-cyan/10 text-cyan border-cyan/20',
  CANCELLED: 'bg-error/10 text-error border-error/20',
  NO_SHOW: 'bg-yellow/10 text-yellow border-yellow/20',
};

// Appointment status labels (human-readable)
export const appointmentStatusLabels: Record<string, string> = {
  SCHEDULED: 'Scheduled',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No Show',
};

// Goal status colors
export const goalStatusColors: Record<string, string> = {
  NOT_STARTED: 'bg-surface-tint text-navy/60 border-surface-tint',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  MASTERED: 'bg-cyan/10 text-cyan border-cyan/20',
  ON_HOLD: 'bg-yellow/10 text-yellow border-yellow/20',
  DISCONTINUED: 'bg-error/10 text-error border-error/20',
};

// Waitlist priority colors
export const priorityColors: Record<string, string> = {
  HIGH: 'bg-error/10 text-error border-error/20',
  MEDIUM: 'bg-yellow/10 text-yellow border-yellow/20',
  LOW: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  URGENT: 'bg-error/20 text-error border-error/30',
};

// Waitlist status colors
export const waitlistStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow/10 text-yellow border-yellow/20',
  CONTACTED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  SCHEDULED: 'bg-blue-800/10 text-blue-800 border-blue-800/20',
  ENROLLED: 'bg-cyan/10 text-cyan border-cyan/20',
  DECLINED: 'bg-error/10 text-error border-error/20',
  WAITLISTED: 'bg-surface-tint text-navy/60 border-surface-tint',
};

// Document/note status colors
export const documentStatusColors: Record<string, string> = {
  DRAFT: 'bg-surface-tint text-navy/60 border-surface-tint',
  PENDING_REVIEW: 'bg-yellow/10 text-yellow border-yellow/20',
  APPROVED: 'bg-cyan/10 text-cyan border-cyan/20',
  REJECTED: 'bg-error/10 text-error border-error/20',
  SIGNED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

// User role colors
export const roleColors: Record<string, string> = {
  THERAPIST: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  CLIN_SUPER: 'bg-blue-800/10 text-blue-800 border-blue-800/20',
  CLIN_DIR: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  PARENT: 'bg-yellow/10 text-yellow border-yellow/20',
  CLIENT: 'bg-surface-subtle text-navy/70 border-surface-tint',
  SUPER_ADMIN: 'bg-navy/10 text-navy border-navy/20',
  STAFF: 'bg-surface-tint text-navy/60 border-surface-tint',
  BILLING_ADMIN: 'bg-yellow/10 text-yellow border-yellow/20',
  HR_ADMIN: 'bg-blue-800/10 text-blue-800 border-blue-800/20',
};

// Client type colors
export const clientTypeColors: Record<string, string> = {
  SELF: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  CHILD: 'bg-yellow/10 text-yellow border-yellow/20',
};

// Status dot colors (for inline indicators)
export const statusDotColors: Record<string, string> = {
  active: 'bg-cyan',
  inactive: 'bg-surface-tint',
  pending: 'bg-yellow',
  error: 'bg-error',
  info: 'bg-blue-500',
};

// Generic status badge helper
export function getStatusBadgeClasses(
  status: string,
  colorMap: Record<string, string>,
  defaultClasses = 'bg-surface-tint text-navy/60 border-surface-tint'
): string {
  return colorMap[status] || defaultClasses;
}

/**
 * StatusBadge component props helper
 */
export interface StatusBadgeProps {
  status: string;
  colorMap?: Record<string, string>;
  className?: string;
}
