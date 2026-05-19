import { Flame } from "lucide-react";
import {
  PRIORITY_BADGE_STYLES,
  getBadgeContainerClass,
  getPriorityBadgeStyle,
  getPriorityIcon,
} from "./BadgeStyles";

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
    <span className={getBadgeContainerClass()} style={style}>
      {icon === "flame" && (
        <Flame size={10} className="flex-shrink-0" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}
