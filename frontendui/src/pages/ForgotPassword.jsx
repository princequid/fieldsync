import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f5] px-4">
      <div className="max-w-md rounded-card bg-white p-8">
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
