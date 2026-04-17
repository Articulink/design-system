/**
 * Centralized status color definitions using design system tokens.
 *
 * This ensures consistent status styling across all Articulink applications.
 * All colors use the design system tokens (tide, abyss, sunshine, etc.)
 */

// Appointment status colors
export const appointmentStatusColors: Record<string, string> = {
  SCHEDULED: 'bg-tide/10 text-tide border-tide/20',
  CONFIRMED: 'bg-lagoon/10 text-lagoon border-lagoon/20',
  IN_PROGRESS: 'bg-surf/10 text-surf border-surf/20',
  COMPLETED: 'bg-seafoam/10 text-seafoam border-seafoam/20',
  CANCELLED: 'bg-error/10 text-error border-error/20',
  NO_SHOW: 'bg-sunshine/10 text-sunshine border-sunshine/20',
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
  NOT_STARTED: 'bg-mist text-abyss/60 border-mist',
  IN_PROGRESS: 'bg-tide/10 text-tide border-tide/20',
  MASTERED: 'bg-seafoam/10 text-seafoam border-seafoam/20',
  ON_HOLD: 'bg-sunshine/10 text-sunshine border-sunshine/20',
  DISCONTINUED: 'bg-error/10 text-error border-error/20',
};

// Waitlist priority colors
export const priorityColors: Record<string, string> = {
  HIGH: 'bg-error/10 text-error border-error/20',
  MEDIUM: 'bg-sunshine/10 text-sunshine border-sunshine/20',
  LOW: 'bg-tide/10 text-tide border-tide/20',
  URGENT: 'bg-error/20 text-error border-error/30',
};

// Waitlist status colors
export const waitlistStatusColors: Record<string, string> = {
  PENDING: 'bg-sunshine/10 text-sunshine border-sunshine/20',
  CONTACTED: 'bg-tide/10 text-tide border-tide/20',
  SCHEDULED: 'bg-lagoon/10 text-lagoon border-lagoon/20',
  ENROLLED: 'bg-seafoam/10 text-seafoam border-seafoam/20',
  DECLINED: 'bg-error/10 text-error border-error/20',
  WAITLISTED: 'bg-mist text-abyss/60 border-mist',
};

// Document/note status colors
export const documentStatusColors: Record<string, string> = {
  DRAFT: 'bg-mist text-abyss/60 border-mist',
  PENDING_REVIEW: 'bg-sunshine/10 text-sunshine border-sunshine/20',
  APPROVED: 'bg-seafoam/10 text-seafoam border-seafoam/20',
  REJECTED: 'bg-error/10 text-error border-error/20',
  SIGNED: 'bg-tide/10 text-tide border-tide/20',
};

// User role colors
export const roleColors: Record<string, string> = {
  THERAPIST: 'bg-tide/10 text-tide border-tide/20',
  CLIN_SUPER: 'bg-lagoon/10 text-lagoon border-lagoon/20',
  CLIN_DIR: 'bg-surf/10 text-surf border-surf/20',
  PARENT: 'bg-sunshine/10 text-sunshine border-sunshine/20',
  CLIENT: 'bg-breeze text-abyss/70 border-mist',
  SUPER_ADMIN: 'bg-abyss/10 text-abyss border-abyss/20',
  STAFF: 'bg-mist text-abyss/60 border-mist',
  BILLING_ADMIN: 'bg-sunshine/10 text-sunshine border-sunshine/20',
  HR_ADMIN: 'bg-lagoon/10 text-lagoon border-lagoon/20',
};

// Client type colors
export const clientTypeColors: Record<string, string> = {
  SELF: 'bg-tide/10 text-tide border-tide/20',
  CHILD: 'bg-sunshine/10 text-sunshine border-sunshine/20',
};

// Status dot colors (for inline indicators)
export const statusDotColors: Record<string, string> = {
  active: 'bg-seafoam',
  inactive: 'bg-mist',
  pending: 'bg-sunshine',
  error: 'bg-error',
  info: 'bg-tide',
};

// Generic status badge helper
export function getStatusBadgeClasses(
  status: string,
  colorMap: Record<string, string>,
  defaultClasses = 'bg-mist text-abyss/60 border-mist'
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
