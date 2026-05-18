import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useAuth } from "../../shared/context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
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
    <div className="flex min-h-screen flex-col justify-center bg-[#f5f2ee] px-4 py-10 sm:px-6 lg:px-0">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(30,58,95,0.12)] lg:grid-cols-[1.08fr_0.92fr]">
        <aside className="hidden flex-col justify-between bg-[#1E3A5F] p-10 text-white md:flex">
          <div>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#2E86AB] text-2xl font-bold text-white">
                FS
              </div>
              <div>
                <p className="text-xl font-bold text-white">FieldSync</p>
                <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                  Field Operations Platform
                </p>
              </div>
            </div>

            <h1 className="mt-14 max-w-md text-3xl font-bold leading-tight text-white">
              Manage every job. Track every site. Keep your team moving.
            </h1>

            <ul className="mt-10 space-y-4 text-sm text-white/90">
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

          <p className="text-xs font-medium uppercase tracking-wide text-white/60">
            SwiftFix Facilities Management Ltd. · Accra, Ghana
          </p>
        </aside>

        <section className="bg-white px-5 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto flex w-full max-w-md flex-col justify-center">
            <div>
              <p className="text-xl font-bold text-gray-900">Welcome back</p>
              <p className="mt-2 text-sm text-gray-700">
                Sign in to your FieldSync account
              </p>
            </div>

            {error ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
                  Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:border-[#2E86AB] focus:ring-2 focus:ring-[#2E86AB]/20"
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
                  className="text-sm font-medium text-[#2E86AB] hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-2xl bg-[#1E3A5F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#17304d] disabled:cursor-not-allowed disabled:opacity-80"
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

            <p className="mt-6 text-xs text-gray-400">
              No public registration · Accounts are provisioned by Admin
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
