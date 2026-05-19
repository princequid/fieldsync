import { Link } from "react-router-dom";

const ILLUSTRATIONS = {
  "📋": ClipboardIllustration,
  "👥": TeamIllustration,
  "🔔": BellIllustration,
  "🔎": SearchIllustration,
  "👷": TeamIllustration,
};

export default function EmptyState({ icon, title, subtitle, action }) {
  const Illustration = ILLUSTRATIONS[icon] ?? ClipboardIllustration;

  return (
    <div className="mx-auto flex max-w-100 flex-col items-center justify-center px-6 py-12 text-center">
      <Illustration />
      <p className="mt-5 text-[16px] font-semibold text-[#374151]">{title}</p>
      {subtitle && (
        <p className="mt-2 max-w-70 text-[14px] leading-relaxed text-[#94A3B8]">
          {subtitle}
        </p>
      )}
      {action?.to && (
        <Link
          to={action.to}
          className="fs-btn-gradient-navy fs-btn-press fs-focus-ring mt-5 rounded-button px-5 py-2.5 text-[13px] font-medium text-white"
        >
          {action.label}
        </Link>
      )}
      {action?.onClick && !action.to && (
        <button
          type="button"
          onClick={action.onClick}
          className="fs-btn-gradient-navy fs-btn-press fs-focus-ring mt-5 rounded-button px-5 py-2.5 text-[13px] font-medium text-white"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

function ClipboardIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <rect x="10" y="10" width="100" height="100" rx="24" fill="#F8FAFC" />
      <rect
        x="34"
        y="26"
        width="52"
        height="68"
        rx="10"
        fill="#EEF2F7"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      <rect
        x="44"
        y="20"
        width="32"
        height="10"
        rx="4"
        fill="#2E86AB"
        opacity="0.3"
      />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="44"
          y1={46 + i * 10}
          x2="76"
          y2={46 + i * 10}
          stroke="#94A3B8"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function TeamIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <rect x="10" y="10" width="100" height="100" rx="24" fill="#F8FAFC" />
      <circle
        cx="60"
        cy="48"
        r="14"
        fill="#DBEAFE"
        stroke="#93C5FD"
        strokeWidth="1.5"
      />
      <path
        d="M34 90c0-14 12-24 26-24s26 10 26 24"
        fill="#EEF2F7"
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      <circle cx="84" cy="56" r="8" fill="#2E86AB" opacity="0.28" />
      <path
        d="M84 65v4M82 67h4"
        stroke="#1E3A5F"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <rect x="10" y="10" width="100" height="100" rx="24" fill="#F8FAFC" />
      <path
        d="M60 33c-9 0-15 8-15 20v9l-6 8h42l-6-8v-9c0-12-6-20-15-20z"
        fill="#EEF2F7"
        stroke="#1E3A5F"
        strokeWidth="1.6"
      />
      <circle cx="60" cy="76" r="4" fill="#2E86AB" opacity="0.42" />
    </svg>
  );
}

function SearchIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <rect x="10" y="10" width="100" height="100" rx="24" fill="#F8FAFC" />
      <circle
        cx="54"
        cy="54"
        r="18"
        fill="none"
        stroke="#2E86AB"
        strokeWidth="2.6"
      />
      <line
        x1="66"
        y1="66"
        x2="84"
        y2="84"
        stroke="#1E3A5F"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
