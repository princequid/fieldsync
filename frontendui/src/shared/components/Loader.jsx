const SIZE = {
  sm: "h-4 w-4 border-2",
  md: "h-7 w-7 border-2",
  lg: "h-10 w-10 border-[3px]",
};

export default function Loader({ size = "md", centered = false }) {
  const spinner = (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-[#2E86AB] border-t-transparent ${SIZE[size] ?? SIZE.md}`}
    />
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center p-8">{spinner}</div>
    );
  }
  return spinner;
}
