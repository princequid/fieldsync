import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useAuth } from "../shared/context/AuthContext";
import { getUserById } from "../shared/utils/mockData";
import Button from "../shared/components/Button";
import Input from "../shared/components/Input";

const MOCK_INVITE_EMAIL   = "kwame@swiftfix.com";
const MOCK_INVITE_USER_ID = "user-2";

export default function FirstLogin() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { activateFirstLogin, isAuthenticated, user } = useAuth();

  const token       = searchParams.get("token") ?? "";
  const inviteEmail = useMemo(() => (token.trim() ? MOCK_INVITE_EMAIL : ""), [token]);
  const inviteProfile = inviteEmail ? getUserById(MOCK_INVITE_USER_ID) : null;

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [errors,          setErrors]          = useState({});
  const [formError,       setFormError]       = useState("");
  const [isSubmitting,    setIsSubmitting]    = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const path = user?.role === "ADMIN" ? "/admin/dashboard" : "/tech/jobs";
      navigate(path, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  function validate() {
    const next = {};
    if (password.length < 8)          next.password        = "Password must be at least 8 characters.";
    if (password !== confirmPassword)  next.confirmPassword = "Passwords do not match.";
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
      setFormError(err?.message ?? "Unable to activate your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token.trim()) {
    return (
      <AuthShell>
        <div className="mx-auto w-full max-w-md text-center">
          <KeyRound className="mx-auto mb-4 text-red-600" size={32} aria-hidden />
          <h1 className="text-[18px] font-bold text-gray-900">Invalid invitation</h1>
          <p className="mt-2 text-[13px] text-gray-500">
            This link is missing a token or has expired. Ask your admin to send a new invitation.
          </p>
          <Link
            to="/login"
            className="fs-btn-gradient-navy fs-focus-ring mt-7 inline-flex h-11 items-center justify-center rounded-button px-6 text-[13px] font-semibold text-white"
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
        {/* Logo header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-card bg-brand-accent text-[14px] font-bold text-white">
            FS
          </div>
          <div>
            <p className="text-[16px] font-bold text-gray-900">Welcome to FieldSync</p>
            <p className="text-[12px] text-gray-500">Set your password to get started</p>
          </div>
        </div>

        {/* Invite chip */}
        {inviteProfile && (
          <div className="mb-5 rounded-card border border-black/5 bg-gray-50 px-4 py-3">
            <p className="text-[13px] font-medium text-gray-900">{inviteProfile.name}</p>
            <p className="text-[11px] text-gray-400">Field Technician · SwiftFix</p>
          </div>
        )}

        {/* Error banner */}
        {formError && (
          <div className="mb-5 rounded-button border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Email" type="email" value={inviteEmail} disabled required />

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

        <p className="mt-6 text-center text-[13px] text-gray-500">
          Already have a password?{" "}
          <Link to="/login" className="font-medium text-brand-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

function AuthShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-brand-bg px-4 py-10">
      <div className="mx-auto w-full max-w-lg rounded-modal bg-white p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, error, autoComplete }) {
  return (
    <label className="block">
      <span className="fs-label mb-1.5 block text-gray-400">{label}</span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required
          className={`fs-input fs-focus-ring w-full rounded-input border bg-white pr-12 text-gray-900 outline-none transition ${
            error
              ? "border-red-400 focus:border-red-400"
              : "border-black/8 focus:border-brand-accent"
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 transition hover:text-gray-700"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-[11px] text-red-600">{error}</p>}
    </label>
  );
}
