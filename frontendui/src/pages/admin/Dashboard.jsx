import React from "react";
import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { useAdminData } from "../../admin/hooks/useAdminData";
import StatCard from "../../admin/components/StatCard";
import Table from "../../admin/components/Table";

function buildStatCards(jobs) {
  const pending = jobs.filter((job) => job.status === "PENDING").length;
  const inProgress = jobs.filter((job) => job.status === "IN_PROGRESS").length;
  const completed = jobs.filter((job) => job.status === "COMPLETED").length;
  const verified = jobs.filter((job) => job.status === "VERIFIED").length;

  return [
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      color: "amber",
      trend: { direction: "up", text: "3 since yesterday" },
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Briefcase,
      color: "blue",
      trend: { direction: "up", text: "1 since yesterday" },
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "green",
      trend: { direction: "up", text: "2 since yesterday" },
    },
    {
      label: "Verified",
      value: verified,
      icon: ShieldCheck,
      color: "navy",
      trend: { direction: "up", text: "1 since yesterday" },
    },
  ];
}

export default function Dashboard() {
  const { jobs, technicians, loading, error, verifyJob } = useAdminData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const statCards = buildStatCards(jobs);

  return (
    <div>
      <div>
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
      <Table jobs={jobs} onVerify={verifyJob} limit={10} showFooter />
      <div>{technicians.length}</div>
    </div>
  );
}
