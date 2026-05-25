import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { useTechnicianData } from "../hooks/useTechnicianData";

export default function TechNavbar({ pageTitle }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { user } = useAuth();

  // Data from context (safe: TechNavbar is rendered inside TechnicianDataProvider)
  const { jobs = [] } = useTechnicianData();

  const isRoot = pathname === "/tech/jobs" || pathname === "/tech/profile";

  // Detail route match: /tech/jobs/:id
  const detailMatch = pathname.match(/^\/tech\/jobs\/([^/]+)$/);
  const jobId = detailMatch ? detailMatch[1] : null;
  const job = jobId ? jobs.find((j) => j.id === jobId) : null;

  // Center title/subtitle
  let title = pageTitle ?? "";
  let subtitle = "";

  if (isRoot) {
    if (pathname === "/tech/jobs") {
      const count = (jobs || []).length;
      title = "My Jobs";
      subtitle = `${count} assigned job${count === 1 ? "" : "s"}`;
    }
    if (pathname === "/tech/profile") {
      title = "Profile";
      subtitle = user?.role === "TECHNICIAN" ? "Field Technician" : (user?.role ?? "");
    }
  } else {
    if (job) {
      title = job.title;
      subtitle = job.jobNumber ?? "";
    } else if (pathname === "/tech/start") {
      title = "Start Job";
      subtitle = "Confirm to begin work";
    } else if (pathname === "/tech/complete") {
      title = "Complete Job";
      subtitle = "Submit your work report";
    }
  }

  const logo = (
    <div
      aria-hidden
      className="flex items-center justify-center"
      style={{ width: 60, height: 60 }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: "linear-gradient(135deg,#2E86AB,#1A6FA8)",
          border: "1px solid rgba(255,255,255,0.15)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>FS</span>
      </div>
    </div>
  );

  const avatar = (
    <div className="flex items-center justify-center" style={{ width: 60, height: 60 }}>
      <div
        aria-hidden
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg,#2E86AB,#1A6FA8)",
          border: "2px solid #FFFFFF",
          boxShadow: "0 0 0 2px rgba(46,134,171,0.4)",
        }}
      >
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{user?.initials ?? "T"}</span>
      </div>
    </div>
  );

  return (
    <header
      className="pt-[env(safe-area-inset-top)] h-[calc(60px+env(safe-area-inset-top))] w-full"
      style={{
        background: "linear-gradient(90deg, #1E3A5F 0%, #162D4A 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[env(safe-area-inset-top)] h-15"
        style={{
          opacity: 0.03,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 0.6px, transparent 0.6px)",
          backgroundSize: "14px 14px",
          mixBlendMode: "soft-light",
        }}
      />

      <div className="relative h-15 flex items-center justify-between px-3">
        {/* Left zone */}
        <div className="w-15 h-15 flex items-center justify-center relative">
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
            style={{ opacity: isRoot ? 1 : 0, pointerEvents: isRoot ? "auto" : "none" }}
          >
            {logo}
          </div>

          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute inset-0 flex items-center justify-center bg-transparent border-0 p-0"
            style={{ cursor: "pointer", pointerEvents: isRoot ? "none" : "auto", opacity: isRoot ? 0 : 1, transition: "opacity 200ms" }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 9999,
                background: "rgba(255,255,255,0.1)",
                transition: "transform 180ms cubic-bezier(0.34,1.56,0.64,1), background 120ms",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.92)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <ChevronLeft size={20} color="rgba(255,255,255,0.9)" />
            </div>
          </button>
        </div>

        {/* Centre zone */}
        <div className="flex-1 flex items-center justify-center px-2 text-center overflow-hidden relative" style={{ minWidth: 0 }}>
          {/* Root title/subtitle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200" style={{ opacity: isRoot ? 1 : 0, pointerEvents: isRoot ? "auto" : "none" }}>
            <div className="text-white font-semibold truncate" style={{ fontSize: 16, letterSpacing: "-0.3px" }} title={title}>{title}</div>
            <div className="text-white/60 text-[11px] truncate" style={{ marginTop: 2 }} title={subtitle}>{subtitle}</div>
          </div>

          {/* Detail title/subtitle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200" style={{ opacity: isRoot ? 0 : 1, pointerEvents: isRoot ? "none" : "auto" }}>
            <div className="text-white font-semibold truncate" style={{ fontSize: 15, letterSpacing: "-0.2px" }} title={title}>{title}</div>
            <div className="text-white/60 text-[11px] truncate" style={{ marginTop: 2 }} title={subtitle}>{subtitle}</div>
          </div>
        </div>

        {/* Right zone */}
        <div className="w-15 h-15 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200" style={{ opacity: isRoot ? 1 : 0, pointerEvents: isRoot ? "auto" : "none" }}>
            {avatar}
          </div>

          {/* Options button */}
          {!isRoot && job ? (
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200" style={{ opacity: 1, pointerEvents: "auto" }}>
              <button
                onClick={() => console.log("options")}
                aria-label="More"
                className="p-0 m-0"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9999,
                  background: "rgba(255,255,255,0.1)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <MoreHorizontal size={18} color="rgba(255,255,255,0.9)" />
              </button>
            </div>
          ) : (
            <div className="absolute inset-0" aria-hidden />
          )}
        </div>
      </div>
    </header>
  );
}
