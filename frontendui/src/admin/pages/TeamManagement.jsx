import { useState, useEffect } from "react";
import { CheckCircle2, Clock, MoreVertical, Plus, X, Zap } from "lucide-react";
import { MOCK_JOBS } from "../../shared/utils/mockData";
import { useAdminData } from "../hooks/useAdminData";
import AddTechnicianModal from "../components/modals/AddTechnicianModal";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import EmptyState from "../../shared/components/EmptyState";
import { SkeletonBlock } from "../../shared/components/Skeleton";

export default function TeamManagement() {
  const { technicians, addTechnician, loading, error, refetch } =
    useAdminData();
  const [selectedTech, setSelectedTech] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handle() {
      setMenuOpen(null);
    }
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [menuOpen]);

  return (
    <AsyncPageContent
      loading={loading}
      error={error}
      thing="team"
      onRetry={refetch}
      skeleton={() => <TeamManagementSkeleton />}
      className="min-h-screen bg-brand-bg"
    >
      <div className="min-h-screen bg-brand-bg px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="fs-page-title">Team</h1>
              <p className="mt-1 text-[13px] text-gray-500">
                Manage technicians and their assignments.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="fs-btn-gradient-navy fs-btn-press fs-focus-ring inline-flex items-center gap-2 rounded-button px-4 py-2.5 text-[13px] font-medium text-white"
            >
              <Plus size={16} />
              Add Technician
            </button>
          </div>

          {/* Table */}
          <div className="fs-card overflow-hidden">
            {technicians.length === 0 ? (
              <EmptyState
                icon="👷"
                title="No technicians yet"
                subtitle="Add your first field technician to start assigning jobs."
                action={{
                  onClick: () => setShowAddModal(true),
                  label: "Add Technician",
                }}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-180">
                  <thead>
                    <tr className="border-b border-black/5 bg-gray-50/70">
                      {[
                        "Technician",
                        "Phone",
                        "Active Jobs",
                        "Completed",
                        "Avg. Time",
                        "Status",
                        "Actions",
                      ].map((col) => (
                        <th
                          key={col}
                          className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-gray-400"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/3">
                    {technicians.map((tech) => (
                      <tr
                        key={tech.id}
                        className="transition-colors hover:bg-gray-50/60"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-accent text-[12px] font-bold text-white">
                              {tech.initials}
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-gray-900">
                                {tech.name}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {tech.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-gray-600">
                          {tech.phone}
                        </td>
                        <td className="px-5 py-4 text-center text-[13px] font-semibold text-gray-900">
                          {tech.activeJobs ?? 0}
                        </td>
                        <td className="px-5 py-4 text-center text-[13px] font-semibold text-gray-900">
                          {tech.completedThisMonth ?? 0}
                        </td>
                        <td className="px-5 py-4 text-center text-[13px] text-gray-600">
                          {tech.avgDurationHours
                            ? `${tech.avgDurationHours}h`
                            : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-badge px-2.5 py-1 text-[11px] font-medium ${
                              tech.online
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                tech.online ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                            {tech.online ? "Online" : "Offline"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedTech(tech)}
                              className="fs-btn-press fs-focus-ring rounded-button border border-brand-accent/40 px-3 py-1.5 text-[11px] font-medium text-brand-accent transition hover:bg-brand-accent hover:text-white"
                            >
                              View
                            </button>
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMenuOpen(
                                    menuOpen === tech.id ? null : tech.id,
                                  );
                                }}
                                className="fs-btn-press rounded-button p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                              >
                                <MoreVertical size={15} />
                              </button>
                              {menuOpen === tech.id && (
                                <div className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-modal border border-black/6 bg-white shadow-3">
                                  <button className="block w-full px-4 py-2.5 text-left text-[13px] text-gray-700 hover:bg-gray-50">
                                    Edit Details
                                  </button>
                                  <button className="block w-full px-4 py-2.5 text-left text-[13px] text-gray-700 hover:bg-gray-50">
                                    Resend Welcome Email
                                  </button>
                                  <button className="block w-full px-4 py-2.5 text-left text-[13px] text-red-600 hover:bg-red-50">
                                    Deactivate
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {selectedTech && (
          <TechnicianDetailPanel
            tech={selectedTech}
            onClose={() => setSelectedTech(null)}
          />
        )}

        {showAddModal && (
          <AddTechnicianModal
            onSuccess={(data) => addTechnician(data)}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </div>
    </AsyncPageContent>
  );
}

function TeamManagementSkeleton() {
  return (
    <div
      className="min-h-screen bg-brand-bg px-4 py-6 sm:px-6 lg:px-8"
      aria-hidden
    >
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-7 w-28 rounded-md" />
            <SkeletonBlock className="h-4 w-64 rounded-md" />
          </div>
          <SkeletonBlock className="h-10 w-36 rounded-button" />
        </div>

        <div className="fs-card overflow-hidden p-5">
          <SkeletonBlock className="h-4 w-full rounded-md" />
          <div className="mt-3 space-y-2">
            {[1, 2, 3, 4, 5].map((row) => (
              <SkeletonBlock key={row} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TechnicianDetailPanel({ tech, onClose }) {
  const [visible, setVisible] = useState(false);

  const techJobs = MOCK_JOBS.filter((job) => job.technicianId === tech.id);
  const completedCount = techJobs.filter(
    (j) => j.status === "COMPLETED" || j.status === "VERIFIED",
  ).length;
  const currentJobs = techJobs.filter(
    (j) => j.status === "PENDING" || j.status === "IN_PROGRESS",
  );

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-280 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-80 overflow-y-auto bg-white shadow-4 transition-transform duration-280 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white px-5 py-4">
          <h2 className="text-[15px] font-semibold text-gray-900">
            Technician Details
          </h2>
          <button
            onClick={handleClose}
            className="fs-btn-press fs-focus-ring flex h-7 w-7 items-center justify-center rounded-button text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-6">
          {/* Profile */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand-accent text-xl font-bold text-white">
              {tech.initials}
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">{tech.name}</h3>
            <p className="text-[13px] text-gray-500 capitalize">
              {tech.role.toLowerCase()}
            </p>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-badge px-2.5 py-1 text-[11px] font-medium ${
                tech.online
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${tech.online ? "bg-green-500" : "bg-gray-400"}`}
              />
              {tech.online ? "Online" : "Offline"}
            </span>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-3 gap-2">
            <StatTile
              icon={<CheckCircle2 className="text-green-600" size={16} />}
              label="Done"
              value={completedCount}
            />
            <StatTile
              icon={<Clock className="text-blue-600" size={16} />}
              label="Avg Time"
              value={tech.avgDurationHours ? `${tech.avgDurationHours}h` : "—"}
            />
            <StatTile
              icon={<Zap className="text-amber-500" size={16} />}
              label="Active"
              value={tech.activeJobs ?? 0}
            />
          </div>

          {/* Current jobs */}
          <div className="mb-5">
            <h4 className="fs-label mb-3 text-gray-400">
              Current Jobs ({currentJobs.length})
            </h4>
            {currentJobs.length > 0 ? (
              <div className="space-y-2">
                {currentJobs.map((job) => (
                  <div key={job.id} className="fs-card p-3">
                    <p className="font-mono text-[10px] text-gray-400">
                      {job.jobNumber}
                    </p>
                    <p className="mt-0.5 text-[13px] font-medium text-gray-900">
                      {job.title}
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-badge px-2 py-0.5 text-[10px] font-medium ${
                        job.status === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {job.status === "IN_PROGRESS" ? "In Progress" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-gray-400">No active jobs</p>
            )}
          </div>

          <button className="fs-btn-press fs-focus-ring w-full rounded-button border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-600 transition hover:bg-red-100">
            Deactivate Account
          </button>
        </div>
      </div>
    </>
  );
}

function StatTile({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-card border border-black/5 bg-gray-50/60 p-3 text-center">
      {icon}
      <p className="text-[15px] font-bold leading-tight text-gray-900">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wide text-gray-400">
        {label}
      </p>
    </div>
  );
}
