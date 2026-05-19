export default function ErrorState({ thing = "data", message, onRetry }) {
  return (
    <div className="flex items-center justify-center p-6 sm:p-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_rgba(30,58,95,0.08)]">
        <span className="text-4xl" role="img" aria-hidden="true">
          ⚠️
        </span>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          Failed to load {thing}
        </h2>
        {message ? (
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        ) : null}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 rounded-2xl bg-[#1E3A5F] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#17304d]"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}
