import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "../shared/context/AuthContext";

export default function Forbidden() {
  const { user } = useAuth();
  const dashboardPath =
    user?.role === "TECHNICIAN" ? "/tech/jobs" : "/admin/dashboard";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f2ee] px-4 py-12 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-[0_20px_60px_rgba(30,58,95,0.12)] dark:border dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/30">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Lock size={32} className="text-[#1E3A5F]" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Access Denied</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          You don&apos;t have permission to view this page.
        </p>
        <Link
          to={dashboardPath}
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#1E3A5F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#17304d]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
