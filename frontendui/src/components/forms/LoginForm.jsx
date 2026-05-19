import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Eye, EyeOff, Info, LoaderCircle } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const path = user?.role === "ADMIN" ? "/admin/dashboard" : "/tech/jobs";
    navigate(path, { replace: true });
  }, [isAuthenticated, user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const userData = login(email, password);
      if (userData.role === "ADMIN")
        navigate("/admin/dashboard", { replace: true });
      if (userData.role === "TECHNICIAN")
        navigate("/tech/jobs", { replace: true });
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <aside
        className="fs-login-brand relative hidden h-screen flex-col justify-between p-10 text-white lg:flex"
        aria-hidden
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[10px] border border-white/20 bg-white/10 text-[18px] font-semibold">
              FS
            </div>
            <p className="text-[22px] font-semibold tracking-[-0.02em]">
              FieldSync
            </p>
          </div>

          <h1 className="mt-10 max-w-md text-[24px] font-semibold leading-[1.3] text-white">
            Keep every field team coordinated with one clean operations
            platform.
          </h1>

          <ul className="mt-10 space-y-4">
            {[
              "Live job tracking across every site",
              "Fast approvals with role-based workflows",
              "Technician updates that sync in real time",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-[14px] text-white/70"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[rgba(46,134,171,0.3)]">
                  <Check size={12} className="text-[#2E86AB]" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-[12px] text-white/35">
          SwiftFix Facilities Management Ltd. · Accra, Ghana
        </p>

        <div className="fs-login-brand-circles" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-12">
        <div className="w-full max-w-100">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#1E3A5F] text-[14px] font-semibold text-white">
              FS
            </div>
            <p className="text-[18px] font-semibold tracking-[-0.02em] text-[#0F172A]">
              FieldSync
            </p>
          </div>

          <h2 className="text-[28px] font-bold tracking-[-0.5px] text-[#0F172A]">
            Welcome back
          </h2>
          <p className="mt-1.5 text-[14px] text-[#94A3B8]">
            Sign in to continue managing operations.
          </p>

          {error && (
            <div className="mt-5 rounded-button border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="fs-label mb-1.5 block text-gray-400">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="fs-input fs-focus-ring w-full rounded-input border border-black/8 bg-white text-gray-900 outline-none transition"
                autoComplete="email"
                required
              />
            </label>

            <label className="block">
              <span className="fs-label mb-1.5 block text-gray-400">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="fs-input fs-focus-ring w-full rounded-input border border-black/8 bg-white pr-12 text-gray-900 outline-none transition"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((c) => !c)}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 transition hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[12px] font-medium text-brand-accent hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="fs-btn-press fs-focus-ring relative flex h-11 w-full items-center justify-center overflow-hidden rounded-button bg-linear-to-r from-[#1E3A5F] to-[#162D4A] text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-75"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.08), transparent)",
                }}
              />
              {isSubmitting ? (
                <span className="relative z-10 flex items-center gap-2">
                  <LoaderCircle className="animate-spin" size={16} />
                  Signing in...
                </span>
              ) : (
                <span className="relative z-10">Log In</span>
              )}
            </button>
          </form>

          <div className="mt-5 flex items-start gap-2 rounded-button border border-dashed border-black/8 bg-gray-50/70 px-4 py-3 text-[12px] text-gray-400">
            <Info
              size={14}
              className="mt-0.5 shrink-0 text-brand-accent"
              aria-hidden
            />
            <p>No public registration · Accounts are provisioned by admin.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
