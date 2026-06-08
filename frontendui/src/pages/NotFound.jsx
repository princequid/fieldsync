import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useAuth } from "../shared/context/AuthContext";

export default function NotFound() {
  const { isAuthenticated, user } = useAuth();

  const homePath = !isAuthenticated
    ? "/login"
    : user?.role === "TECHNICIAN"
      ? "/tech/jobs"
      : "/admin/dashboard";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f4f4f5] px-4 py-12 text-center dark:bg-gray-950">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Search size={32} className="text-[#1E3A5F]" aria-hidden />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Link
        to={homePath}
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-button bg-[#1E3A5F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#17304d]"
      >
        {isAuthenticated ? "Back to dashboard" : "Back to login"}
      </Link>
    </div>
  );
}
