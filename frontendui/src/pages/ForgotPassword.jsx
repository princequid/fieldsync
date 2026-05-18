import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f2ee] px-4">
      <div className="max-w-md rounded-3xl bg-white p-8 shadow-[0_20px_60px_rgba(30,58,95,0.12)]">
        <p className="text-xl font-bold text-gray-900">Forgot password</p>
        <p className="mt-2 text-sm text-gray-700">
          This is a placeholder page. Password resets will be added later.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block text-sm font-medium text-[#2E86AB] hover:underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
