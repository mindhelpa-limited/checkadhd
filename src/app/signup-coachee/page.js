"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/* ---------- Loader ---------- */
const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-[#0a122a] flex flex-col items-center justify-center z-50 text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4"></div>
    <p className="mt-4 text-lg">{message}</p>
  </div>
);

/* ---------- Modal if no payment ---------- */
const PaymentModal = () => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#101b3d] rounded-2xl shadow-lg max-w-md w-full p-6 text-center border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-3">Access Required</h2>
      <p className="text-gray-300 mb-6">
        Please complete your payment to create an account and unlock your dashboard.
      </p>
      <button
        onClick={() => (window.location.href = "/services")}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow hover:scale-105 transition-transform"
      >
        💳 Go to Pricing Page
      </button>
    </div>
  </div>
);

/* ---------- Login Modal (Existing User) ---------- */
const LoginModal = ({ email, onClose, router }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // FIX: Removed type annotation from e
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard/coachee");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#101b3d] rounded-2xl shadow-lg max-w-md w-full p-6 border border-white/10 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✖
        </button>
        <h2 className="text-2xl font-semibold text-white text-center mb-4">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && (
            <p className="bg-red-900 text-red-300 text-center p-2 rounded-lg">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function SignUpCoachingPageWrapper() {
  return (
    <Suspense fallback={<FullScreenLoader message="Loading..." />}>
      <SignUpCoachingPage />
    </Suspense>
  );
}

function SignUpCoachingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [accountExists, setAccountExists] = useState(false);

  const productTag = "coaching";

  const createOrUpdateUser = async (user) => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(
      userRef,
      {
        email: user.email,
        tier: productTag,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const redirectToDashboard = () => router.push("/dashboard/coachee");

  useEffect(() => {
    (async () => {
      if (auth.currentUser) {
        redirectToDashboard();
        return;
      }

      if (!sessionId) {
        setShowPaymentModal(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/get-session-details?id=${sessionId}`);
        const data = await res.json();

        if (data?.email) {
          setEmail(data.email);

          // Check if this email already exists in Firebase
          const methods = await fetchSignInMethodsForEmail(auth, data.email);
          if (methods.length > 0) {
            setAccountExists(true); // User exists, prompt to log in
            setShowLoginModal(true); // Automatically show login modal if account exists
          }
        }
      } catch (e) {
        console.error("Error checking session:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  // FIX: Removed type annotation from e
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createOrUpdateUser(cred.user);
      redirectToDashboard();
    } catch (err) {
      console.error("Signup error:", err);
      setError("Could not create account. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <FullScreenLoader message="Checking your access..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a122a] px-4 relative">
      {showPaymentModal && <PaymentModal />}
      {showLoginModal && accountExists && (
        <LoginModal email={email} onClose={() => setShowLoginModal(false)} router={router} />
      )}

      {!showPaymentModal && !accountExists && (
        <div className="max-w-md w-full bg-[#101b3d] rounded-3xl shadow-2xl p-8 border border-white/10">
          <h1 className="text-3xl font-semibold text-center text-white mb-4">
            Coaching Access
          </h1>
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <input
                type="email"
                value={email}
                readOnly
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && (
              <p className="bg-red-900 text-red-300 text-center p-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:scale-[1.02] transition-transform"
            >
              🚀 Create Account
            </button>
          </form>

          {/* Already have account - updated to use router.push with your requested path */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push("/login-coachee")}
              className="text-blue-400 hover:underline"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}