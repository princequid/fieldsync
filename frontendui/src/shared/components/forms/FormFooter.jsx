/**
 * FormFooter - Sticky footer bar for forms like New Job page
 * Spec: 68px tall, white background, 1px top border #F1F5F9
 * Shadow: 0 -4px 12px rgba(0,0,0,0.04), fixed bottom
 * Contains Cancel button on left and Submit button on right
 */
export default function FormFooter({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Submit",
  isSubmitting = false,
  disabled = false,
  className = "",
}) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 h-[68px] bg-white border-t border-[#F1F5F9] flex items-center justify-between px-6 dark:bg-gray-900 dark:border-gray-800 ${className}`}
      style={{
        boxShadow: "var(--shadow-1)",
      }}
    >
      <button
        type="button"
        onClick={onCancel}
        disabled={isSubmitting || disabled}
        className="px-6 py-2 text-[13px] font-medium text-[#374151] bg-white border border-[#E2E8F0] rounded-[8px] hover:bg-[#F8FAFC] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        {cancelText}
      </button>

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting || disabled}
        className="px-6 py-2 text-[13px] font-medium text-white bg-[#2E86AB] rounded-[8px] hover:bg-[#1d6f94] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting..." : submitText}
      </button>
    </div>
  );
}
