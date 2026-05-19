import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Info, LoaderCircle } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const path =
      user?.role === "ADMIN" ? "/admin/dashboard" : "/tech/jobs";
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

      if (userData.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      }

      if (userData.role === "TECHNICIAN") {
        navigate("/tech/jobs", { replace: true });
      }
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#f5f2ee] px-4 py-10 lg:px-0">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-[#E5E7EB] bg-white lg:grid-cols-[1.08fr_0.92fr]">
        <aside className="fs-login-brand relative hidden flex-col justify-between p-10 text-white md:flex">
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-white/10 bg-[#2E86AB] text-2xl font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)]">
                FS
              </div>
              <div>
                <p className="text-[22px] font-bold text-white">FieldSync</p>
                <p className="fs-label text-white/70">Field Operations Platform</p>
              </div>
            </div>

            <h1 className="mt-14 max-w-md text-3xl font-bold leading-tight text-white">
              Manage every job. Track every site. Keep your team moving.
            </h1>

            <ul className="mt-10 space-y-4 text-[13px] text-white/90">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#2E86AB]" />
                <span>Role-based access control</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#2E86AB]" />
                <span>Real-time job tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#2E86AB]" />
                <span>Client notifications</span>
              </li>
            </ul>
          </div>

          <p className="relative z-10 fs-label text-white/60">
            SwiftFix Facilities Management Ltd. · Accra, Ghana
          </p>

          <div className="pointer-events-none absolute -bottom-20 -right-16" aria-hidden>
            <div className="h-[400px] w-[400px] rounded-full border border-white/[0.08] bg-white/[0.04]" />
            <div className="absolute bottom-16 right-20 h-[300px] w-[300px] rounded-full border border-white/[0.08] bg-white/[0.04]" />
            <div className="absolute bottom-32 right-40 h-[200px] w-[200px] rounded-full border border-white/[0.08] bg-white/[0.04]" />
          </div>
        </aside>

        <section className="flex items-center bg-white px-5 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center">
            <div>
              <p className="fs-section-title text-gray-900">Welcome back</p>
              <p className="mt-2 text-[13px] text-gray-700">
                Sign in to your FieldSync account
              </p>
            </div>

            {error ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <label className="block">
                <span className="fs-label mb-1.5 block text-gray-500">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="fs-input fs-focus-ring w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-gray-900 outline-none transition"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block">
                <span className="fs-label mb-1.5 block text-gray-500">
                  Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="fs-input fs-focus-ring w-full rounded-xl border border-[#E5E7EB] bg-white px-3 pr-12 text-gray-900 outline-none transition"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 transition hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-[13px] font-medium text-[#2E86AB] hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="fs-btn-gradient-navy fs-btn-press fs-focus-ring flex h-12 w-full items-center justify-center rounded-2xl text-sm font-semibold text-white transition focus-visible:ring-4 focus-visible:ring-[#1E3A5F]/25 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" size={18} />
                    Signing in...
                  </span>
                ) : (
                  "Log In to FieldSync"
                )}
              </button>
            </form>

            <div className="mt-6 flex items-start gap-2 rounded-xl border border-dashed border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-[12px] text-gray-500">
              <Info size={16} className="mt-0.5 shrink-0 text-[#2E86AB]" aria-hidden />
              <p>No public registration · Accounts are provisioned by Admin</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
