import {
  STATUS_BADGE_STYLES,
  getBadgeContainerClass,
  getStatusBadgeStyle,
  getStatusDotColor,
  shouldPulseStatus,
} from "./BadgeStyles";

const STATUS_DARK_CLASSES = {
  PENDING: "dark:!bg-amber-900/30 dark:!text-amber-300 dark:!border-amber-800",
  IN_PROGRESS:
    "dark:!bg-blue-900/30 dark:!text-blue-300 dark:!border-blue-800",
  COMPLETED:
    "dark:!bg-green-900/30 dark:!text-green-300 dark:!border-green-800",
  VERIFIED: "dark:!bg-slate-800 dark:!text-slate-300 dark:!border-slate-700",
};

/**
 * Status Badge
 * Displays job status with colored dot and label
 * Status options: PENDING, IN_PROGRESS, COMPLETED, VERIFIED
 */
export default function StatusBadge({ status = "PENDING", showDot = true }) {
  const config = STATUS_BADGE_STYLES[status];
  const style = getStatusBadgeStyle(status);
  const dotColor = getStatusDotColor(status);
  const pulse = shouldPulseStatus(status);
  const label = config?.label ?? status;

  return (
    <span
      className={`${getBadgeContainerClass()} ${STATUS_DARK_CLASSES[status] ?? ""} ${pulse ? "animate-pulse" : ""}`}
      style={style}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${pulse ? "animate-pulse" : ""}`}
          style={{ backgroundColor: dotColor }}
          aria-hidden
        />
      )}
      {label}
    </span>
  );
}
