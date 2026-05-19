const SAFE_DETAIL =
  "Something went wrong while loading this section. Please try again.";

export default function ErrorState({
  thing = "data",
  message,
  onRetry,
  variant = "error",
}) {
  const tone = variant === "warning" ? "warning" : "error";

  return (
    <div className="mx-auto flex max-w-100 items-center justify-center px-6 py-12 text-center">
      <div className="w-full">
        <ErrorIllustration tone={tone} />
        <h2 className="mt-5 text-[16px] font-semibold text-[#374151]">
          Failed to load {thing}
        </h2>
        <p className="mt-2 max-w-70 text-[14px] leading-relaxed text-[#94A3B8]">
          Please check your connection and retry.
        </p>
        {message && (
          <p className="mt-2 text-[13px] text-[#94A3B8]">{SAFE_DETAIL}</p>
        )}
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="fs-btn-press fs-focus-ring mt-5 rounded-button border border-[#E2E8F0] bg-white px-5 py-2.5 text-[13px] font-medium text-[#374151] hover:bg-[#F8FAFC]"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

function ErrorIllustration({ tone }) {
  const isWarning = tone === "warning";

  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className="mx-auto"
      aria-hidden
    >
      <rect x="10" y="10" width="100" height="100" rx="24" fill="#F8FAFC" />
      {isWarning ? (
        <>
          <path
            d="M60 30L88 84H32L60 30z"
            fill="#FFFBEB"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <line
            x1="60"
            y1="48"
            x2="60"
            y2="66"
            stroke="#F59E0B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="60" cy="74" r="2.5" fill="#F59E0B" />
        </>
      ) : (
        <>
          <path
            d="M38 48l12-12 9 9-12 12"
            fill="none"
            stroke="#EF4444"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M82 72l-12 12-9-9 12-12"
            fill="none"
            stroke="#EF4444"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="56"
            y1="50"
            x2="66"
            y2="70"
            stroke="#FCA5A5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
