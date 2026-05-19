import { Link } from "react-router-dom";

const ILLUSTRATIONS = {
  "📋": ClipboardIllustration,
  "👥": TeamIllustration,
  "🔔": BellIllustration,
  "🔎": SearchIllustration,
};

export default function EmptyState({ icon, title, subtitle, action }) {
  const Illustration = ILLUSTRATIONS[icon] ?? ClipboardIllustration;

  return (
    <div className="mx-auto flex max-w-[400px] flex-col items-center justify-center px-8 py-16 text-center">
      <Illustration />
      <p className="mt-6 text-lg font-semibold text-gray-800">{title}</p>
      {subtitle && (
        <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
          {subtitle}
        </p>
      )}
      {action?.to ? (
        <Link
          to={action.to}
          className="fs-btn-gradient-navy fs-btn-press fs-focus-ring mt-6 rounded-2xl px-5 py-2.5 text-sm font-medium text-white"
        >
          {action.label}
        </Link>
      ) : null}
      {action?.onClick && !action.to ? (
        <button
          type="button"
          onClick={action.onClick}
          className="fs-btn-gradient-navy fs-btn-press fs-focus-ring mt-6 rounded-2xl px-5 py-2.5 text-sm font-medium text-white"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  );
}

function ClipboardIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden>
      <rect x="28" y="12" width="64" height="76" rx="8" fill="#F3F4F6" stroke="#E5E7EB" />
      <rect x="44" y="6" width="32" height="14" rx="4" fill="#2E86AB" opacity="0.3" />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="40"
          y1={36 + i * 14}
          x2="80"
          y2={36 + i * 14}
          stroke="#D1D5DB"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      ))}
    </svg>
  );
}

function TeamIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden>
      <circle cx="60" cy="36" r="18" fill="#E5E7EB" />
      <path d="M30 88c0-16 13-28 30-28s30 12 30 28" fill="#F3F4F6" stroke="#E5E7EB" />
      <circle cx="88" cy="44" r="10" fill="#2E86AB" opacity="0.35" />
      <path d="M88 58v6M83 61h10" stroke="#1E3A5F" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BellIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden>
      <path
        d="M60 18c-12 0-20 10-20 24v18l-8 10h56l-8-10V42c0-14-8-24-20-24z"
        fill="#F3F4F6"
        stroke="#1E3A5F"
        strokeWidth="2"
      />
      <circle cx="60" cy="78" r="6" fill="#2E86AB" opacity="0.4" />
      <text x="72" y="30" fontSize="10" fill="#9CA3AF">
        z
      </text>
    </svg>
  );
}

function SearchIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" aria-hidden>
      <circle cx="52" cy="44" r="22" fill="none" stroke="#2E86AB" strokeWidth="3" />
      <line x1="68" y1="60" x2="88" y2="80" stroke="#1E3A5F" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
