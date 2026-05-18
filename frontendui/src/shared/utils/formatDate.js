export function formatRelativeDate(iso) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return (
      "Today " +
      date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    );
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatFullDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatElapsed(iso) {
  const ms = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (hours === 0) return `${mins}m elapsed`;
  return `${hours}h ${mins}m elapsed`;
}
