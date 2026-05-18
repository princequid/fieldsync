import React from "react";

export default function Table({ jobs, onVerify, limit, showFooter }) {
  const rows = typeof limit === "number" ? jobs.slice(0, limit) : jobs;

  return (
    <div>
      {rows.map((job) => (
        <div key={job.id}>
          <span>{job.jobNumber}</span>
          <span>{job.title}</span>
          <button type="button" onClick={() => onVerify?.(job.id)}>
            Verify
          </button>
        </div>
      ))}
      {showFooter ? <div>View all</div> : null}
    </div>
  );
}
