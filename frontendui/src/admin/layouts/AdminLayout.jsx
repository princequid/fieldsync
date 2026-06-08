import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";
import { AdminDataProvider } from "../hooks/useAdminData";
import PageTransitionWrapper from "../../shared/components/PageTransitionWrapper";

const NARROW_BREAKPOINT = 1280;

export default function AdminLayout() {
  const location = useLocation();
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < NARROW_BREAKPOINT : false,
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < NARROW_BREAKPOINT : false,
  );

  useEffect(() => {
    function handleResize() {
      const narrow = window.innerWidth < NARROW_BREAKPOINT;
      setIsNarrow((wasNarrow) => {
        if (!wasNarrow && narrow) {
          setSidebarCollapsed(true);
        }
        return narrow;
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showMobileDrawer = isNarrow && !sidebarCollapsed;

  useEffect(() => {
    if (!showMobileDrawer) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showMobileDrawer]);

  return (
    <AdminDataProvider>
      <div className="flex h-screen bg-brand-bg dark:bg-gray-950">
        {showMobileDrawer && (
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          className={
            showMobileDrawer
              ? "fixed left-0 top-0 z-50 h-screen w-64"
              : "relative z-auto shrink-0"
          }
        />

        <div
          className="flex min-w-0 flex-1 flex-col overflow-hidden"
          style={{ minWidth: 0 }}
        >
          <AdminTopbar />
          <main className="min-h-0 flex-1 overflow-y-auto dark:bg-gray-950">
            <PageTransitionWrapper
              transitionKey={location.key}
              className="mx-auto min-h-full w-full max-w-360"
            >
              <Outlet />
            </PageTransitionWrapper>
          </main>
        </div>
      </div>
    </AdminDataProvider>
  );
}
