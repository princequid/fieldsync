import { useState, useEffect } from "react";
import { MoreVertical, X, Plus, CheckCircle2, Clock, Zap } from "lucide-react";
import { MOCK_JOBS } from "../../shared/utils/mockData";
import { useAdminData } from "../hooks/useAdminData";
import AddTechnicianModal from "../components/modals/AddTechnicianModal";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import EmptyState from "../../shared/components/EmptyState";

export default function TeamManagement() {
  const { technicians, addTechnician, loading, error, refetch } = useAdminData();
  const [selectedTech, setSelectedTech] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  // Close dropdown on any outside click
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
      className="min-h-screen bg-[#f5f2ee]"
    >
    <div className="min-h-screen bg-[#f5f2ee] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team</h1>
            <p className="mt-1 text-gray-600">
              Manage technicians and their assignments
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#1E3A5F] px-4 py-3 text-sm font-medium text-white hover:bg-[#17304d] transition-colors"
          >
            <Plus size={18} />
            Add Technician
          </button>
        </div>

        {/* Table */}
        <div className="mt-8 rounded-4xl bg-white shadow-[0_20px_60px_rgba(30,58,95,0.12)] overflow-hidden">
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Technician
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  Active Jobs
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  Completed This Month
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  Avg. Time
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {technicians.map((tech) => (
                <tr key={tech.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2E86AB] text-sm font-medium text-white">
                        {tech.initials}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{tech.name}</p>
                        <p className="text-sm text-gray-500">{tech.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {tech.phone}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                    {tech.activeJobs ?? 0}
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                    {tech.completedThisMonth ?? 0}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">
                    {tech.avgDurationHours ? `${tech.avgDurationHours}h` : "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        tech.online
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${tech.online ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      {tech.online ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedTech(tech)}
                        className="rounded-xl border border-[#2E86AB] px-3 py-1.5 text-xs font-medium text-[#2E86AB] hover:bg-[#2E86AB] hover:text-white transition-colors"
                      >
                        View
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(menuOpen === tech.id ? null : tech.id);
                          }}
                          className="rounded-xl p-1.5 text-gray-400 hover:bg-slate-100 hover:text-gray-700 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {menuOpen === tech.id && (
                          <div className="absolute right-0 mt-1 w-48 rounded-2xl bg-white shadow-lg border border-slate-200 z-10 overflow-hidden">
                            <button className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50">
                              Edit Details
                            </button>
                            <button className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50">
                              Resend Welcome Email
                            </button>
                            <button className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
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

function TechnicianDetailPanel({ tech, onClose }) {
  const [visible, setVisible] = useState(false);

  const techJobs = MOCK_JOBS.filter((job) => job.technicianId === tech.id);
  const completedCount = techJobs.filter(
    (j) => j.status === "COMPLETED" || j.status === "VERIFIED"
  ).length;
  const currentJobs = techJobs.filter(
    (j) => j.status === "PENDING" || j.status === "IN_PROGRESS"
  );

  // Trigger slide-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Slide-over panel — 320px wide */}
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-80 bg-white shadow-xl overflow-y-auto transform transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Technician Details</h2>
          <button
            onClick={handleClose}
            className="rounded-xl p-1.5 text-gray-400 hover:bg-slate-100 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Avatar + name + role + status */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#2E86AB] text-2xl font-bold text-white">
              {tech.initials}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{tech.name}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {tech.role.toLowerCase()}
            </p>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                tech.online
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${tech.online ? "bg-green-500" : "bg-gray-400"}`}
              />
              {tech.online ? "Online" : "Offline"}
            </span>
          </div>

          {/* 3 stat tiles in a row */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <StatTile
              icon={<CheckCircle2 className="text-green-600" size={18} />}
              label="Completed"
              value={completedCount}
            />
            <StatTile
              icon={<Clock className="text-blue-600" size={18} />}
              label="Avg. Time"
              value={tech.avgDurationHours ? `${tech.avgDurationHours}h` : "—"}
            />
            <StatTile
              icon={<Zap className="text-amber-500" size={18} />}
              label="Active Now"
              value={tech.activeJobs ?? 0}
            />
          </div>

          {/* Current Jobs list */}
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
              Current Jobs ({currentJobs.length})
            </h4>
            {currentJobs.length > 0 ? (
              <div className="space-y-2">
                {currentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <p className="text-xs font-medium text-gray-500">
                      {job.jobNumber}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                      {job.title}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          job.status === "PENDING"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {job.status === "IN_PROGRESS" ? "In Progress" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-2 text-sm text-gray-500">No active jobs</p>
            )}
          </div>

          {/* Deactivate button */}
          <button className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
            Deactivate Account
          </button>
        </div>
      </div>
    </>
  );
}

function StatTile({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
      {icon}
      <p className="text-base font-bold leading-tight text-gray-900">{value}</p>
      <p className="text-[10px] uppercase leading-tight tracking-wide text-gray-500">
        {label}
      </p>
    </div>
  );
}

