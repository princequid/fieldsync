const SIZE = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
};

export default function Loader({ size = "md", centered = false }) {
  const spinner = (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-brand-accent border-t-transparent ${SIZE[size] ?? SIZE.md}`}
    />
  );

  if (centered) {
    return (
      <div className="fs-loader-enter flex min-h-[40vh] items-center justify-center p-8">
        {spinner}
      </div>
    );
  }
  return spinner;
}
