import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useAuth } from "../shared/context/AuthContext";
import { getUserById } from "../shared/utils/mockData";
import Button from "../shared/components/Button";
import Input from "../shared/components/Input";

const MOCK_INVITE_EMAIL = "kwame@swiftfix.com";
const MOCK_INVITE_USER_ID = "user-2";

export default function FirstLogin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activateFirstLogin, isAuthenticated, user } = useAuth();

  const token = searchParams.get("token") ?? "";

  const inviteEmail = useMemo(() => {
    if (!token.trim()) return "";
    return MOCK_INVITE_EMAIL;
  }, [token]);

  const inviteProfile = inviteEmail ? getUserById(MOCK_INVITE_USER_ID) : null;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const path =
        user?.role === "ADMIN" ? "/admin/dashboard" : "/tech/jobs";
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  function validate() {
    const next = {};
    if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      activateFirstLogin(token, inviteEmail, password);
      navigate("/tech/jobs", { replace: true });
    } catch (err) {
      setFormError(
        err?.message ?? "Unable to activate your account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token.trim()) {
    return (
      <AuthShell>
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <KeyRound className="text-red-500" size={28} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Invalid invitation</h1>
          <p className="mt-2 text-sm text-gray-600">
            This link is missing a token or has expired. Ask your admin to send a
            new invitation.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#1E3A5F] px-6 text-sm font-semibold text-white"
          >
            Back to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#2E86AB] text-lg font-bold text-white">
            FS
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">Welcome to FieldSync</p>
            <p className="text-sm text-gray-600">Set your password to get started</p>
          </div>
        </div>

        {inviteProfile ? (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">
              {inviteProfile.name}
            </p>
            <p className="text-xs text-gray-500">Field Technician · SwiftFix</p>
          </div>
        ) : null}

        {formError ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            value={inviteEmail}
            disabled
            required
          />

          <PasswordField
            label="New password"
            value={password}
            onChange={setPassword}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            error={errors.password}
            autoComplete="new-password"
          />

          <PasswordField
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth loading={isSubmitting}>
            Activate account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have a password?{" "}
          <Link to="/login" className="font-medium text-[#2E86AB] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#f5f2ee] px-4 py-10">
      <div className="mx-auto w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-[0_24px_70px_rgba(30,58,95,0.12)] sm:p-10">
        {children}
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  error,
  autoComplete,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          className={`w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
              : "border-slate-200 focus:border-[#2E86AB] focus:ring-[#2E86AB]/20"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error ? <p className="mt-1.5 text-xs text-red-600">{error}</p> : null}
    </label>
  );
}
