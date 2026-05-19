import {
  STATUS_BADGE_STYLES,
  getBadgeContainerClass,
  getStatusBadgeStyle,
  getStatusDotColor,
  shouldPulseStatus,
} from "./BadgeStyles";

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
      className={`${getBadgeContainerClass()} ${pulse ? "animate-pulse" : ""}`}
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
