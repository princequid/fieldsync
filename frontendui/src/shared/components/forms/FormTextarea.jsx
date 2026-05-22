import { AlertCircle } from "lucide-react";

/**
 * FormTextarea - Text area input
 * Spec: Same styling as FormInput (40px min-height is replaced with 100px)
 * Minimum height of 100px and resize-y only
 * Border: 1px #E2E8F0 at rest, #2E86AB on focus
 * Background: #F8FAFC at rest, white on focus
 */
export default function FormTextarea({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  className = "",
}) {
  const textareaId =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : "");

  const baseClasses =
    "w-full min-h-[100px] px-3 py-2 text-[13px] text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] outline-none transition-all duration-150 resize-y font-sans dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500";

  const stateClasses = error
    ? "border-[#EF4444] bg-[#FEF2F2] focus:border-[#EF4444] focus:bg-white focus:ring-[0_0_0_3px] focus:ring-[rgba(239,68,68,0.15)] dark:bg-red-900/20 dark:border-red-500 dark:focus:bg-gray-800"
    : "focus:bg-white focus:border-[#2E86AB] focus:ring-[0_0_0_3px] focus:ring-[rgba(46,134,171,0.15)] dark:focus:bg-gray-800 dark:focus:border-[#2E86AB]";

  const disabledClasses = disabled
    ? "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300"
    : "";

  return (
    <div className="block">
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-1.5 block text-[12px] font-medium text-[#374151] dark:text-gray-300"
        >
          {label}
          {required && (
            <span className="ml-1 text-[#EF4444]" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      <textarea
        id={textareaId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
      />

      <div className="flex items-start justify-between gap-2 mt-1.5">
        <div>
          {error && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#EF4444]">
              <AlertCircle
                size={13}
                className="flex-shrink-0"
                aria-hidden="true"
              />
              <span>{error}</span>
            </div>
          )}

          {!error && helperText && (
            <p className="text-[11px] text-[#94A3B8] dark:text-gray-500">{helperText}</p>
          )}
        </div>

        {maxLength && (
          <p className="text-[11px] text-[#94A3B8] dark:text-gray-500 flex-shrink-0">
            {value?.length || 0}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
