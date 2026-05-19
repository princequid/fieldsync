import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminTopbar from "../components/AdminTopbar";
import { AdminDataProvider } from "../hooks/useAdminData";
import PageTransitionWrapper from "../../shared/components/PageTransitionWrapper";

export default function AdminLayout() {
  const location = useLocation();
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1280 : false,
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 1280 : false,
  );
  const [overlayOpen, setOverlayOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      const narrow = window.innerWidth < 1280;
      setIsNarrow(narrow);
      if (narrow) {
        setSidebarCollapsed(true);
      } else {
        setOverlayOpen(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!overlayOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [overlayOpen]);

  return (
    <AdminDataProvider>
      <div className="flex h-screen bg-brand-bg">
        <Sidebar
          collapsed={isNarrow ? true : sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />

        {isNarrow && (
          <>
            {overlayOpen && (
              <button
                type="button"
                aria-label="Close sidebar overlay"
                className="fixed inset-0 z-40 bg-black/30"
                onClick={() => setOverlayOpen(false)}
              />
            )}

            <div
              className={`fixed inset-y-0 left-0 z-50 w-screen transform transition-transform duration-240 ${
                overlayOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
              }}
            >
              <Sidebar
                overlay
                collapsed={false}
                onNavigate={() => setOverlayOpen(false)}
                onCollapsedChange={setSidebarCollapsed}
              />
            </div>
          </>
        )}

        <div
          className="flex min-w-0 flex-1 flex-col overflow-hidden"
          style={{ minWidth: 0 }}
        >
          <AdminTopbar
            showMenuButton={isNarrow}
            onMenuClick={() => setOverlayOpen(true)}
          />
          <main className="min-h-0 flex-1 overflow-y-auto">
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
