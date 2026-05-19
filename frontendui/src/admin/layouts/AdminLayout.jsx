import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";
import { AdminDataProvider } from "../hooks/useAdminData";

export default function AdminLayout() {
  return (
    <AdminDataProvider>
      <div className="flex h-screen overflow-hidden bg-[#f5f2ee]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminTopbar />
          <main className="min-h-0 flex-1 overflow-y-auto">
            <div className="fs-page-enter mx-auto min-h-full max-w-[1400px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AdminDataProvider>
  );
}
