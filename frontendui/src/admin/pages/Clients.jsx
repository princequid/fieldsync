import { useNavigate } from "react-router-dom";
import { useAdminData } from "../hooks/useAdminData";
import Button from "../../shared/components/Button";
import AsyncPageContent from "../../shared/components/AsyncPageContent";
import { ClientsPageSkeleton } from "../../shared/components/skeletons/PageSkeletons";
import EmptyState from "../../shared/components/EmptyState";
import { formatRelativeDate } from "../../shared/utils/formatDate";

const TH_CLASS =
  "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400";

export default function Clients() {
  const navigate = useNavigate();
  const { clients, loading, error, refetch } = useAdminData();

  return (
    <AsyncPageContent
      loading={loading}
      error={error ? "Failed to load clients" : null}
      thing="clients"
      onRetry={refetch}
      skeleton={() => <ClientsPageSkeleton />}
      className="min-h-full"
    >
      <div className="space-y-6 p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">Clients</h1>
          <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
            {clients.length} client{clients.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate("/admin/clients/new")}>
          + Add Client
        </Button>
      </header>

      <section
        className="overflow-hidden rounded-card border border-[#F1F5F9] bg-white dark:border-gray-800 dark:bg-gray-900"
        style={{ boxShadow: "var(--shadow-1)" }}
      >
        {clients.length === 0 ? (
          <EmptyState
            icon="🏢"
            title="No clients yet"
            subtitle="Add your first client to start assigning jobs."
            action={{
              label: "+ Add Client",
              onClick: () => navigate("/admin/clients/new"),
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-240 text-left">
              <thead>
                <tr className="border-b border-[#F1F5F9] bg-[#F8FAFC] dark:border-gray-800 dark:bg-gray-800">
                  <th className={TH_CLASS}>Company</th>
                  <th className={TH_CLASS}>Email</th>
                  <th className={TH_CLASS}>Phone</th>
                  <th className={TH_CLASS}>Address</th>
                  <th className={TH_CLASS}>Added</th>
                  <th className={TH_CLASS}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F8FAFC] dark:divide-gray-800">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#FAFBFD] dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <div className="text-[13px] font-medium text-gray-900 dark:text-gray-100">
                        {client.companyName}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-gray-600 dark:text-gray-400">
                      {client.email}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-600 dark:text-gray-300">
                      {client.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-500 dark:text-gray-400">
                      <div className="max-w-xs truncate">
                        {client.address || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-gray-400 dark:text-gray-500">
                      {formatRelativeDate(client.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          window.alert("Edit functionality coming soon")
                        }
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      </div>
    </AsyncPageContent>
  );
}
