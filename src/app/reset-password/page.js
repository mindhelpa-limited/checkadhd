"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";

// --- Icon Components ---
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("enter-email");
  const [actionCode, setActionCode] = useState("");

  // ✅ FIX: Get oobCode from URL only on client side
  const [oobCode, setOobCode] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setOobCode(params.get("oobCode"));
    }
  }, []);

  useEffect(() => {
    if (oobCode) {
      setLoading(true);
      verifyPasswordResetCode(auth, oobCode)
        .then((verifiedEmail) => {
          setEmail(verifiedEmail);
          setActionCode(oobCode);
          setStep("reset-password");
        })
        .catch(() => {
          setError("Invalid or expired password reset link. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [oobCode]);

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!email) return setError("Please enter your email address.");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch {
      setError("Failed to send reset email. Please check the address.");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!newPassword) return setError("Please enter a new password.");
    setLoading(true);
    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("Failed to reset password. The link may have expired.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="ADHD Check Logo" className="h-10 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Reset Your Password</h1>
          <p className="text-gray-600 mt-2">
            {step === "enter-email"
              ? "Enter your email to receive a reset link."
              : "Create a new password for your account."}
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8">
          {message && <p className="bg-green-100 text-green-700 text-center p-3 rounded-lg mb-4">{message}</p>}
          {error && <p className="bg-red-100 text-red-700 text-center p-3 rounded-lg mb-4">{error}</p>}

          {step === "enter-email" ? (
            <form onSubmit={handleSendResetLink}>
              <div className="relative mb-6">
                <MailIcon />
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:bg-blue-400"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="relative mb-6">
                <LockIcon />
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:bg-blue-400"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-600 mt-8">
            Remembered your password?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
