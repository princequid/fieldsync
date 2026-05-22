import { Flame } from "lucide-react";
import {
  PRIORITY_BADGE_STYLES,
  getBadgeContainerClass,
  getPriorityBadgeStyle,
  getPriorityIcon,
} from "./BadgeStyles";

const PRIORITY_DARK_CLASSES = {
  HIGH: "dark:!bg-red-900/30 dark:!text-red-300 dark:!border-red-800",
  MEDIUM: "dark:!bg-amber-900/30 dark:!text-amber-300 dark:!border-amber-800",
  LOW: "dark:!bg-green-900/30 dark:!text-green-300 dark:!border-green-800",
};

/**
 * Priority Badge
 * Displays job priority with optional icon
 * Priority options: HIGH, MEDIUM, LOW
 * HIGH priority shows a flame icon at 10px size
 */
export default function PriorityBadge({ priority = "MEDIUM" }) {
  const config = PRIORITY_BADGE_STYLES[priority];
  const style = getPriorityBadgeStyle(priority);
  const icon = getPriorityIcon(priority);
  const label = config?.label ?? priority;

  return (
    <span
      className={`${getBadgeContainerClass()} ${PRIORITY_DARK_CLASSES[priority] ?? ""}`}
      style={style}
    >
      {icon === "flame" && (
        <Flame size={10} className="flex-shrink-0" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}
