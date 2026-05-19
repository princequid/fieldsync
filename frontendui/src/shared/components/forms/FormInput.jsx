import { AlertCircle } from "lucide-react";

/**
 * FormInput - Text input field
 * Spec: 40px height, 8px radius, 13px font, #0F172A text, #F8FAFC bg
 * Border: 1px #E2E8F0 at rest
 * Focus: white bg, #2E86AB border, 0 0 0 3px rgba(46,134,171,0.15) ring over 150ms
 * Error: #EF4444 border, #FEF2F2 background
 * Helper text: 11px #94A3B8 below input
 */
export default function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  autoComplete,
  className = "",
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : "");

  const baseClasses =
    "w-full h-10 px-3 py-2 text-[13px] text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] outline-none transition-all duration-150";

  const stateClasses = error
    ? "border-[#EF4444] bg-[#FEF2F2] focus:border-[#EF4444] focus:bg-white focus:ring-[0_0_0_3px] focus:ring-[rgba(239,68,68,0.15)]"
    : "focus:bg-white focus:border-[#2E86AB] focus:ring-[0_0_0_3px] focus:ring-[rgba(46,134,171,0.15)]";

  const disabledClasses = disabled
    ? "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300"
    : "";

  return (
    <div className="block">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[12px] font-medium text-[#374151]"
        >
          {label}
          {required && (
            <span className="ml-1 text-[#EF4444]" aria-label="required">
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
        onBlur={onBlur}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
      />

      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#EF4444]">
          <AlertCircle size={13} className="flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {!error && helperText && (
        <p className="mt-1.5 text-[11px] text-[#94A3B8]">{helperText}</p>
      )}
    </div>
  );
}
