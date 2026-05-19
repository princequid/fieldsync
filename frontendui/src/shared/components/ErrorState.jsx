export default function ErrorState({ thing = "data", message, onRetry }) {
  return (
    <div className="flex items-center justify-center p-6 sm:p-8">
      <div className="mx-auto w-full max-w-[400px] rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-8 text-center">
        <ErrorIllustration />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Failed to load {thing}
        </h2>
        {message ? (
          <p className="mt-2 text-[13px] text-gray-600">{message}</p>
        ) : null}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="fs-btn-gradient-navy fs-btn-press fs-focus-ring mt-6 rounded-2xl px-5 py-2.5 text-sm font-medium text-white"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ErrorIllustration() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      className="mx-auto"
      aria-hidden
    >
      <path
        d="M40 8L72 68H8L40 8z"
        fill="#FEF2F2"
        stroke="#EF4444"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <line x1="40" y1="30" x2="40" y2="48" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="56" r="2" fill="#EF4444" />
    </svg>
  );
}
