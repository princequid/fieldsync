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
      "border-l-[4px] border-l-amber-500 bg-gradient-to-r from-amber-50 to-amber-100/70 text-amber-900 dark:from-amber-950/40 dark:to-gray-900/80 dark:text-amber-200",
    iconBg: "bg-amber-200/80 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
  progress: {
    shell:
      "border-l-[4px] border-l-blue-500 bg-gradient-to-r from-blue-50 to-blue-100/70 text-blue-900 dark:from-blue-950/40 dark:to-gray-900/80 dark:text-blue-200",
    iconBg: "bg-blue-200/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  completed: {
    shell:
      "border-l-[4px] border-l-green-500 bg-gradient-to-r from-green-50 to-green-100/70 text-green-900 dark:from-green-950/40 dark:to-gray-900/80 dark:text-green-200",
    iconBg: "bg-green-200/80 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  },
  verified: {
    shell:
      "border-l-[4px] border-l-brand-accent bg-gradient-to-r from-brand-navy to-[#29496d] text-white dark:from-gray-900 dark:to-brand-navy",
    iconBg: "bg-white/20 text-white dark:bg-white/10",
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
        <Timer size={19} className="shrink-0" aria-hidden />
        <div>
          <p className="text-[13px] font-semibold">Waiting for you to start</p>
          <p className="mt-0.5 text-[11px] opacity-80">
            Tap the button below when you arrive on-site
          </p>
        </div>
      </BannerShell>
    );
  }

  if (job.status === "IN_PROGRESS" && inProgressEntry) {
    return (
      <BannerShell cls={STYLES.progress.shell} iconBg={STYLES.progress.iconBg}>
        <Wrench size={19} className="shrink-0" aria-hidden />
        <div>
          <p className="text-[13px] font-semibold">You&apos;re on this job</p>
          <p className="mt-0.5 text-[11px] opacity-80">
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
        <CheckCircle2 size={19} className="shrink-0" aria-hidden />
        <div>
          <p className="text-[13px] font-semibold">
            Awaiting admin verification
          </p>
          <p className="mt-0.5 text-[11px] opacity-80">
            Completed at {formatTime(completedEntry.changedAt)}
          </p>
        </div>
      </BannerShell>
    );
  }

  if (job.status === "VERIFIED" && verifiedEntry) {
    return (
      <BannerShell cls={STYLES.verified.shell} iconBg={STYLES.verified.iconBg}>
        <Trophy size={19} className="shrink-0" aria-hidden />
        <div>
          <p className="text-[13px] font-semibold">Job Verified and Closed</p>
          <p className="mt-0.5 text-[11px] text-white/70">
            Admin verified on {formatFullDate(verifiedEntry.changedAt)}
          </p>
        </div>
      </BannerShell>
    );
  }

  return null;
}

function BannerShell({ children, cls, iconBg }) {
  const [icon, content] = Array.isArray(children) ? children : [children, null];

  return (
    <div className="px-3 pt-3">
      <div
        className={`fs-card flex items-start gap-3 rounded-[14px] px-3.5 py-3 ${cls}`}
      >
        <span
          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${iconBg}`}
        >
          {icon}
        </span>
        {content}
      </div>
    </div>
  );
}
