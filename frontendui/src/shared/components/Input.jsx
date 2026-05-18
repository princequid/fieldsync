export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  id,
}) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="block">
      {label && (
        <label htmlFor={inputId} className="mb-2 flex items-center gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </span>
          {required && <span className="text-xs text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={[
          "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-gray-400",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
            : "border-slate-200 focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/30",
        ].join(" ")}
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
}
