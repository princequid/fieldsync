const VARIANTS = {
  primary:
    "fs-btn-gradient-navy text-white hover:brightness-110 focus-visible:ring-[#1E3A5F]/25",
  secondary:
    "fs-btn-gradient-accent text-white hover:brightness-110 focus-visible:ring-[#2E86AB]/25",
  ghost:
    "border border-gray-200 bg-[#FAFAFA] text-gray-600 hover:bg-gray-50",
  danger: "bg-red-500 text-white hover:bg-red-600",
  "danger-ghost":
    "border border-red-200 bg-[#FAFAFA] text-red-600 hover:bg-red-50",
  success: "fs-btn-gradient-success text-white hover:brightness-110",
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
        "fs-btn-press fs-focus-ring inline-flex items-center justify-center gap-2 font-medium transition-all",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
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
