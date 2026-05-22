import { useState } from "react";

/**
 * Button — rebuilt per design spec.
 * Heights:  sm 32px  ·  md 36px  ·  lg 40px
 * Icons:    15px with 7px gap to label (pass icon as child)
 * Press:    scale(0.98) over 80ms
 * Loading:  label fades out, spinner crossfades in
 * Disabled: 40% opacity, cursor-not-allowed, no hover
 */

const GRADIENT_SHADOW =
  "0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.10)";

const VARIANT_STYLES = {
  primary: {
    base: {
      background: "linear-gradient(180deg, #1E3A5F 0%, #162D4A 100%)",
      color: "#fff",
      boxShadow: GRADIENT_SHADOW,
      border: "none",
    },
    hover: {
      background: "linear-gradient(180deg, #234672 0%, #1A3256 100%)",
      color: "#fff",
      boxShadow: GRADIENT_SHADOW,
      border: "none",
    },
  },
  secondary: {
    base: {
      background: "linear-gradient(180deg, #2577A3 0%, #1B6289 100%)",
      color: "#fff",
      boxShadow: GRADIENT_SHADOW,
      border: "none",
    },
    hover: {
      background: "linear-gradient(180deg, #2A81B1 0%, #1F6F99 100%)",
      color: "#fff",
      boxShadow: GRADIENT_SHADOW,
      border: "none",
    },
  },
  ghost: {
    base: {
      background: "#FFFFFF",
      color: "#374151",
      border: "1px solid #E2E8F0",
      boxShadow: "none",
    },
    hover: {
      background: "#F8FAFC",
      color: "#374151",
      border: "1px solid #CBD5E1",
      boxShadow: "none",
    },
  },
  danger: {
    base: {
      background: "linear-gradient(180deg, #EF4444 0%, #DC2626 100%)",
      color: "#fff",
      boxShadow: GRADIENT_SHADOW,
      border: "none",
    },
    hover: {
      background: "linear-gradient(180deg, #F25555 0%, #E53535 100%)",
      color: "#fff",
      boxShadow: GRADIENT_SHADOW,
      border: "none",
    },
  },
  "danger-ghost": {
    base: {
      background: "#FEF2F2",
      color: "#DC2626",
      border: "1px solid #FECACA",
      boxShadow: "none",
    },
    hover: {
      background: "#FEE2E2",
      color: "#B91C1C",
      border: "1px solid #FCA5A5",
      boxShadow: "none",
    },
  },
  success: {
    base: {
      background: "linear-gradient(180deg, #22C55E 0%, #16A34A 100%)",
      color: "#fff",
      boxShadow: GRADIENT_SHADOW,
      border: "none",
    },
    hover: {
      background: "linear-gradient(180deg, #26D167 0%, #18B350 100%)",
      color: "#fff",
      boxShadow: GRADIENT_SHADOW,
      border: "none",
    },
  },
};

const SIZE_STYLES = {
  sm: { height: "32px", padding: "0 12px", fontSize: "12px" },
  md: { height: "36px", padding: "0 16px", fontSize: "13px" },
  lg: { height: "40px", padding: "0 20px", fontSize: "13px" },
};

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
  const [hovered, setHovered] = useState(false);

  const vs = VARIANT_STYLES[variant] ?? VARIANT_STYLES.primary;
  const ss = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const canAct = !disabled && !loading;

  const appliedVariant = hovered && canAct ? vs.hover : vs.base;

  const rootStyle = {
    ...ss,
    ...appliedVariant,
    fontWeight: 500,
    letterSpacing: "-0.1px",
    borderRadius: "var(--radius-button, 8px)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    width: fullWidth ? "100%" : undefined,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition:
      "background 120ms ease-out, border-color 120ms ease-out, box-shadow 120ms ease-out, transform 80ms ease",
    flexShrink: 0,
    userSelect: "none",
  };

  function handleMouseDown(e) {
    if (canAct) e.currentTarget.style.transform = "scale(0.98)";
  }
  function handleMouseUp(e) {
    e.currentTarget.style.transform = "scale(1)";
  }

  const darkVariantClass =
    variant === "ghost"
      ? "dark:!bg-gray-800 dark:!border-gray-700 dark:!text-gray-200 dark:hover:!bg-gray-700"
      : variant === "danger-ghost"
        ? "dark:!bg-red-900/20 dark:!border-red-800 dark:!text-red-400"
        : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={rootStyle}
      className={[
        "fs-focus-ring transition-none",
        disabled || loading ? "pointer-events-none" : "",
        darkVariantClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Label row — fades out during loading (crossfade) */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "7px",
          opacity: loading ? 0 : 1,
          transition: "opacity 120ms ease-out",
          pointerEvents: "none",
        }}
      >
        {children}
      </span>

      {/* Spinner — crossfades in during loading */}
      {loading && (
        <span
          className="animate-fade-in"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SpinnerIcon />
        </span>
      )}
    </button>
  );
}

function SpinnerIcon() {
  return (
    <span
      aria-hidden="true"
      className="animate-spin"
      style={{
        display: "block",
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: "2px solid currentColor",
        borderTopColor: "transparent",
      }}
    />
  );
}
