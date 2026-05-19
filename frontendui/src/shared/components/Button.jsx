const VARIANTS = {
  primary: "bg-[#1E3A5F] text-white hover:bg-[#16304f]",
  secondary: "bg-[#2E86AB] text-white hover:bg-[#267a9d]",
  ghost: "border border-gray-200 text-gray-600 hover:bg-gray-50",
  danger: "bg-red-500 text-white hover:bg-red-600",
  "danger-ghost":
    "border border-red-200 bg-white text-red-600 hover:bg-red-50",
  success: "bg-green-600 text-white hover:bg-green-700",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs rounded-xl",
  md: "px-4 py-2.5 text-sm rounded-2xl",
  lg: "px-5 py-3.5 text-sm rounded-2xl",
};

const MIN_HEIGHTS = { sm: "36px", md: "44px", lg: "52px" };

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  children,
  fullWidth = false,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ minHeight: MIN_HEIGHTS[size] ?? "44px" }}
      className={[
        "inline-flex items-center justify-center gap-2 font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}
