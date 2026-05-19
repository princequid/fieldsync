import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { AdminDataProvider } from "../hooks/useAdminData";

export default function AdminLayout() {
  return (
    <AdminDataProvider>
      <div className="flex h-screen overflow-hidden bg-[#f5f2ee]">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </AdminDataProvider>
  );
}
