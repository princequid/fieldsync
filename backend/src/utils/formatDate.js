// GraphQL serializes Date objects assigned to `String` fields via `valueOf()`,
// producing a raw millisecond-timestamp string (e.g. "1781234567890") that
// `new Date(...)` cannot parse back on the client. Resolve these fields
// explicitly to ISO 8601 strings so clients can parse them reliably.
function formatDate(value) {
  if (!value) return null;
  return new Date(value).toISOString();
}

module.exports = formatDate;
