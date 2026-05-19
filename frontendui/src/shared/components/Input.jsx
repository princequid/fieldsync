import { AlertCircle } from "lucide-react";

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
        <label htmlFor={inputId} className="mb-1.5 flex items-center gap-1">
          <span className="fs-label text-gray-500">{label}</span>
          {required && (
            <span className="ml-1 text-xs text-[#EF4444]" aria-hidden>
              *
            </span>
          )}
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
          "fs-input fs-focus-ring w-full rounded-xl border bg-white text-gray-900 outline-none transition",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-gray-400",
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-400/15"
            : "border-[#E5E7EB] focus:border-[#2E86AB]",
        ].join(" ")}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle size={14} className="shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
