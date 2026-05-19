import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, Phone } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";
import { getUserById } from "../../shared/utils/mockData";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profile = getUserById(user?.id);
  const [showSignOut, setShowSignOut] = useState(false);

  function handleSignOut() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="space-y-6 p-4">
      <section className="fs-card flex items-center gap-4 p-5">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ backgroundColor: "#27AE60" }}
        >
          {profile?.initials ?? "T"}
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {profile?.name ?? user?.email}
          </h1>
          <p className="text-[13px] text-gray-500">Field Technician</p>
        </div>
      </section>

      <section className="fs-card divide-y divide-[#E5E7EB]">
        {profile?.email ? (
          <div className="flex items-center gap-3 px-4 py-3 text-[13px] text-gray-700">
            <Mail size={18} className="text-gray-400" aria-hidden />
            {profile.email}
          </div>
        ) : null}
        {profile?.phone ? (
          <div className="flex items-center gap-3 px-4 py-3 text-[13px] text-gray-700">
            <Phone size={18} className="text-gray-400" aria-hidden />
            {profile.phone}
          </div>
        ) : null}
      </section>

      <button
        type="button"
        onClick={() => setShowSignOut(true)}
        className="fs-btn-press fs-focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-[#FAFAFA] text-sm font-medium text-red-600"
      >
        <LogOut size={18} aria-hidden />
        Sign out
      </button>

      {showSignOut ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
          <div className="fs-modal-panel w-full max-w-sm rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-5 fs-shadow-elevated">
            <h2 className="text-base font-semibold text-gray-900">Sign out?</h2>
            <p className="mt-2 text-[13px] text-gray-600">
              You will need to sign in again to access your jobs.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowSignOut(false)}
                className="fs-btn-press flex-1 rounded-xl border border-[#E5E7EB] py-2.5 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="fs-btn-press flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
