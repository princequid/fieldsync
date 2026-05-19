/**
 * FormSectionHeading - Section heading within a form
 * Spec: 13px font-semibold #374151 with a subtle divider line below (1px #F1F5F9)
 */
export default function FormSectionHeading({ children, className = "" }) {
  return (
    <div className={`mt-6 mb-4 ${className}`}>
      <h3 className="text-[13px] font-semibold text-[#374151] pb-3 border-b border-[#F1F5F9]">
        {children}
      </h3>
    </div>
  );
}
