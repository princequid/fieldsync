import { useEffect, useState } from "react";
import { CheckCircle2, Timer, Trophy, Wrench } from "lucide-react";
import {
  formatElapsed,
  formatFullDate,
  formatTime,
} from "../../shared/utils/formatDate";

const STYLES = {
  pending: {
    shell:
      "border-l-[4px] border-l-[#F59E0B] bg-[#FFFBEB] text-[#92400E] dark:bg-amber-950/30 dark:border-amber-600",
    iconBg: "bg-[rgba(245,158,11,0.15)] text-[#92400E] dark:bg-amber-900/30",
  },
  progress: {
    shell:
      "border-l-[4px] border-l-[#3B82F6] bg-[#EFF6FF] text-[#1D4ED8] dark:bg-blue-950/30 dark:border-blue-600",
    iconBg: "bg-[rgba(59,130,246,0.15)] text-[#1D4ED8] dark:bg-blue-900/30",
  },
  completed: {
    shell:
      "border-l-[4px] border-l-[#22C55E] bg-[#F0FDF4] text-green-900 dark:bg-green-950/30 dark:border-l-[#16A34A]",
    iconBg: "bg-[rgba(34,197,94,0.15)] text-green-700 dark:bg-green-900/30",
  },
  verified: {
    shell: "border-l-[4px] border-l-[#1E3A5F] bg-[#1E3A5F] text-white",
    iconBg: "bg-white/10 text-white",
  },
};

export default function StatusBanner({ job }) {
  const [, setTick] = useState(Date.now());
  const inProgressEntry = job.statusHistory?.find(
    (e) => e.status === "IN_PROGRESS",
  );
  const completedEntry = job.statusHistory?.find(
    (e) => e.status === "COMPLETED",
  );
  const verifiedEntry = job.statusHistory?.find((e) => e.status === "VERIFIED");

  useEffect(() => {
    if (job.status !== "IN_PROGRESS") return undefined;
    const timer = window.setInterval(() => setTick(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, [job.status]);

  if (job.status === "PENDING") {
    return (
      <BannerShell cls={STYLES.pending.shell} iconBg={STYLES.pending.iconBg}>
        <Timer size={20} className="shrink-0" aria-hidden />
        <div>
          <p className="text-[14px] font-semibold text-[#92400E] dark:text-amber-300">
            Waiting for you to start
          </p>
          <p className="mt-1 text-[12px] text-[#B45309] dark:text-amber-400">
            Tap the button below when you arrive on-site
          </p>
        </div>
      </BannerShell>
    );
  }

  if (job.status === "IN_PROGRESS" && inProgressEntry) {
    return (
      <BannerShell cls={STYLES.progress.shell} iconBg={STYLES.progress.iconBg}>
        <Wrench size={20} className="shrink-0" aria-hidden />
        <div>
          <p className="text-[14px] font-semibold text-[#1D4ED8] dark:text-blue-300">
            You&apos;re on this job
          </p>
          <p className="mt-1 text-[12px] text-[#3B82F6] dark:text-blue-400">
            Started at {formatTime(inProgressEntry.changedAt)} ·{" "}
            {formatElapsed(inProgressEntry.changedAt)}
          </p>
        </div>
      </BannerShell>
    );
  }

  if (job.status === "COMPLETED" && completedEntry) {
    return (
      <BannerShell
        cls={STYLES.completed.shell}
        iconBg={STYLES.completed.iconBg}
      >
        <CheckCircle2 size={20} className="shrink-0" aria-hidden />
        <div>
          <p className="text-[14px] font-semibold text-green-800 dark:text-green-300">
            Awaiting admin verification
          </p>
          <p className="mt-1 text-[12px] text-green-700 dark:text-green-500">
            Completed at {formatTime(completedEntry.changedAt)}
          </p>
        </div>
      </BannerShell>
    );
  }

  if (job.status === "VERIFIED" && verifiedEntry) {
    return (
      <BannerShell cls={STYLES.verified.shell} iconBg={STYLES.verified.iconBg}>
        <Trophy size={20} className="shrink-0" aria-hidden />
        <div>
          <p className="text-[14px] font-semibold text-white">
            Job Verified and Closed
          </p>
          <p className="mt-1 text-[12px] text-white/90">
            Admin verified on {formatFullDate(verifiedEntry.changedAt)}
          </p>
        </div>
      </BannerShell>
    );
  }

  return null;
}

function BannerShell({ children, cls }) {
  const [icon, content] = Array.isArray(children) ? children : [children, null];

  return (
    <div className="px-3 pt-3">
      <div className={`flex items-start gap-3 rounded-card border border-gray-200 p-4 dark:border-gray-800 ${cls}`}>
        <span className="mt-0.5 shrink-0">{icon}</span>
        {content}
      </div>
    </div>
  );
}
