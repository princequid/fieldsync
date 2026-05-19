import { CheckCircle2, Timer, Trophy, Wrench } from "lucide-react";
import { formatElapsed, formatFullDate, formatTime } from "../../shared/utils/formatDate";

export default function StatusBanner({ job }) {
  const inProgressEntry = job.statusHistory?.find(
    (e) => e.status === "IN_PROGRESS",
  );
  const completedEntry = job.statusHistory?.find(
    (e) => e.status === "COMPLETED",
  );
  const verifiedEntry = job.statusHistory?.find((e) => e.status === "VERIFIED");

  if (job.status === "PENDING") {
    return (
      <BannerShell className="border-amber-200 bg-amber-50 text-amber-900">
        <Timer size={20} className="shrink-0" aria-hidden />
        <div>
          <p className="text-sm font-semibold">Waiting for you to start</p>
          <p className="mt-0.5 text-xs opacity-90">
            Tap the button below when you arrive on-site
          </p>
        </div>
      </BannerShell>
    );
  }

  if (job.status === "IN_PROGRESS" && inProgressEntry) {
    return (
      <BannerShell className="border-blue-200 bg-blue-50 text-blue-900">
        <Wrench size={20} className="shrink-0" aria-hidden />
        <div>
          <p className="text-sm font-semibold">You&apos;re on this job</p>
          <p className="mt-0.5 text-xs opacity-90">
            Started at {formatTime(inProgressEntry.changedAt)} ·{" "}
            {formatElapsed(inProgressEntry.changedAt)}
          </p>
        </div>
      </BannerShell>
    );
  }

  if (job.status === "COMPLETED" && completedEntry) {
    return (
      <BannerShell className="border-green-200 bg-green-50 text-green-900">
        <CheckCircle2 size={20} className="shrink-0" aria-hidden />
        <div>
          <p className="text-sm font-semibold">Awaiting admin verification</p>
          <p className="mt-0.5 text-xs opacity-90">
            Completed at {formatTime(completedEntry.changedAt)}
          </p>
        </div>
      </BannerShell>
    );
  }

  if (job.status === "VERIFIED" && verifiedEntry) {
    return (
      <BannerShell
        className="border-transparent text-white"
        style={{ backgroundColor: "#1E3A5F" }}
      >
        <Trophy size={20} className="shrink-0" aria-hidden />
        <div>
          <p className="text-sm font-semibold">Job Verified and Closed</p>
          <p className="mt-0.5 text-xs text-white/80">
            Admin verified on {formatFullDate(verifiedEntry.changedAt)}
          </p>
        </div>
      </BannerShell>
    );
  }

  return null;
}

function BannerShell({ children, className, style }) {
  return (
    <div
      className={`flex items-start gap-3 border-b px-4 py-3 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
