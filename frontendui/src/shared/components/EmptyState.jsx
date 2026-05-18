export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
      {icon && (
        <span className="mb-4 text-5xl" role="img" aria-hidden="true">
          {icon}
        </span>
      )}
      <p className="text-lg font-semibold text-gray-700">{title}</p>
      {subtitle && (
        <p className="mt-2 max-w-xs text-sm text-gray-500">{subtitle}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-6 rounded-2xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#17304d]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
