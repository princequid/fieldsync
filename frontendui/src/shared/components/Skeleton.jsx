export function SkeletonBlock({ className = "", style }) {
  return (
    <div
      className={`fs-skeleton ${className}`.trim()}
      style={style}
      aria-hidden
    />
  );
}

export function SkeletonCard({ className = "", children }) {
  return <div className={`fs-card ${className}`.trim()}>{children}</div>;
}
