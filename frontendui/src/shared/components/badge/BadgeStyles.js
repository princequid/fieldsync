/**
 * Badge Styles Configuration
 * Centralized badge styling for perfect consistency across the app.
 * All badges use: inline-flex items-center, 20px border-radius,
 * 4px vertical padding, 10px horizontal, 11px font-medium, 6px dot with 4px right margin
 */

export const STATUS_BADGE_STYLES = {
  PENDING: {
    label: "Pending",
    background: "#FFFBEB",
    text: "#B45309",
    border: "#FDE68A",
    dot: "#F59E0B",
    pulse: false,
  },
  IN_PROGRESS: {
    label: "In Progress",
    background: "#EFF6FF",
    text: "#1D4ED8",
    border: "#BFDBFE",
    dot: "#3B82F6",
    pulse: true,
  },
  COMPLETED: {
    label: "Completed",
    background: "#F0FDF4",
    text: "#15803D",
    border: "#BBF7D0",
    dot: "#22C55E",
    pulse: false,
  },
  VERIFIED: {
    label: "Verified",
    background: "#F8FAFC",
    text: "#334155",
    border: "#E2E8F0",
    dot: "#64748B",
    pulse: false,
  },
};

export const PRIORITY_BADGE_STYLES = {
  HIGH: {
    label: "High",
    background: "#FEF2F2",
    text: "#991B1B",
    border: "#FECACA",
    icon: "flame", // lucide-react icon name
  },
  MEDIUM: {
    label: "Medium",
    background: "#FFFBEB",
    text: "#92400E",
    border: "#FDE68A",
  },
  LOW: {
    label: "Low",
    background: "#F0FDF4",
    text: "#166534",
    border: "#BBF7D0",
  },
};

/**
 * Get badge container className
 * Base styles that apply to all badges
 */
export const getBadgeContainerClass = () =>
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 border font-medium text-[11px] font-tabular-nums min-w-[90px]";

/**
 * Get style object for status badge
 */
export const getStatusBadgeStyle = (status) => {
  const config = STATUS_BADGE_STYLES[status];
  if (!config) {
    return {
      background: "#F3F4F6",
      color: "#6B7280",
      borderColor: "#E5E7EB",
    };
  }
  return {
    backgroundColor: config.background,
    color: config.text,
    borderColor: config.border,
  };
};

/**
 * Get style object for priority badge
 */
export const getPriorityBadgeStyle = (priority) => {
  const config = PRIORITY_BADGE_STYLES[priority];
  if (!config) {
    return {
      background: "#F3F4F6",
      color: "#6B7280",
      borderColor: "#E5E7EB",
    };
  }
  return {
    backgroundColor: config.background,
    color: config.text,
    borderColor: config.border,
  };
};

/**
 * Get dot color for status badge
 */
export const getStatusDotColor = (status) => {
  const config = STATUS_BADGE_STYLES[status];
  return config?.dot ?? "#D1D5DB";
};

/**
 * Check if status has pulse animation
 */
export const shouldPulseStatus = (status) => {
  return STATUS_BADGE_STYLES[status]?.pulse ?? false;
};

/**
 * Get icon name for priority (if exists)
 */
export const getPriorityIcon = (priority) => {
  return PRIORITY_BADGE_STYLES[priority]?.icon ?? null;
};
