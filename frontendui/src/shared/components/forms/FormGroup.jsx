/**
 * FormGroup - Container for form fields
 * Provides 16px vertical spacing between form groups
 */
export default function FormGroup({ children, className = "" }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}
