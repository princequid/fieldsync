import { Link } from "react-router-dom";
import { Building2, ClipboardList, Search, Users, Bell } from "lucide-react";

const ICONS = {
  "📋": ClipboardList,
  "👥": Users,
  "🔔": Bell,
  "🔎": Search,
  "👷": Users,
  "🏢": Building2,
};

export default function EmptyState({ icon, title, subtitle, action }) {
  const Icon = ICONS[icon] ?? ClipboardList;

  return (
    <div className="mx-auto flex max-w-100 flex-col items-center justify-center px-6 py-12 text-center">
      <Icon size={32} className="text-gray-300 dark:text-gray-600" aria-hidden />
      <p className="mt-4 text-[16px] font-semibold text-[#374151] dark:text-gray-300">
        {title}
      </p>
      {subtitle && (
        <p className="mt-2 max-w-70 text-[14px] leading-relaxed text-[#94A3B8] dark:text-gray-500">
          {subtitle}
        </p>
      )}
      {action?.to && (
        <Link
          to={action.to}
          className="fs-btn-gradient-navy fs-focus-ring mt-5 rounded-button px-5 py-2.5 text-[13px] font-medium text-white"
        >
          {action.label}
        </Link>
      )}
      {action?.onClick && !action.to && (
        <button
          type="button"
          onClick={action.onClick}
          className="fs-btn-gradient-navy fs-focus-ring mt-5 rounded-button px-5 py-2.5 text-[13px] font-medium text-white"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
