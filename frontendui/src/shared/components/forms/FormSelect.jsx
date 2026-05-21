import { ChevronDown, AlertCircle } from "lucide-react";

/**
 * FormSelect - Custom styled select input
 * Uses custom container styled like FormInput with ChevronDown icon absolutely positioned
 * Native select is invisible, custom container sits on top using pointer-events tricks
 * Spec: 40px height, 8px radius, same styling as FormInput
 * Icon at right in #94A3B8 at rest, #2E86AB when focused
 */
export default function FormSelect({
  id,
  label,
  options = [],
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder = "Select...",
  className = "",
}) {
  const selectId =
    id || (label ? label.toLowerCase().replace(/\s+/g, "-") : "");

  const baseContainerClasses =
    "relative w-full h-10 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] transition-all duration-150 flex items-center dark:bg-gray-800 dark:border-gray-700";

  const stateContainerClasses = error
    ? "border-[#EF4444] bg-[#FEF2F2] dark:bg-red-900/20 dark:border-red-500"
    : "focus-within:bg-white focus-within:border-[#2E86AB] focus-within:ring-[0_0_0_3px] focus-within:ring-[rgba(46,134,171,0.15)] dark:focus-within:bg-gray-800 dark:focus-within:border-[#2E86AB]";

  const selectClasses =
    "absolute inset-0 w-full h-10 px-3 py-2 text-[13px] text-[#0F172A] bg-transparent border-none rounded-[8px] outline-none cursor-pointer opacity-0 pointer-events-auto";

  const displayClasses =
    "absolute inset-0 px-3 py-2 text-[13px] text-[#0F172A] rounded-[8px] pointer-events-none flex items-center";

  const getDisplayText = () => {
    if (!value) return placeholder;
    const selected = options.find((opt) => opt.value === value);
    return selected?.label || value;
  };

  const isPlaceholder = !value;
  const displayTextColor = isPlaceholder
    ? "text-[#94A3B8] dark:text-gray-500"
    : "text-[#0F172A] dark:text-gray-100";

  const iconColor = value ? "text-[#2E86AB]" : "text-[#94A3B8]";

  return (
    <div className="block">
      {label && (
        <label
          htmlFor={selectId}
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

      <div
        className={`${baseContainerClasses} ${stateContainerClasses} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        {/* Native select (invisible) */}
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={selectClasses}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Display text (visible) */}
        <div className={`${displayClasses} ${displayTextColor}`}>
          {getDisplayText()}
        </div>

        {/* Chevron icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown
            size={16}
            className={`transition-colors duration-150 ${iconColor}`}
            aria-hidden="true"
          />
        </div>
      </div>

      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#EF4444]">
          <AlertCircle size={13} className="flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {!error && helperText && (
        <p className="mt-1.5 text-[11px] text-[#94A3B8] dark:text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
