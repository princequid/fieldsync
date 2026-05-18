export const submitReport = (data) =>
  fetch("/api/reports", { method: "POST", body: JSON.stringify(data) });
