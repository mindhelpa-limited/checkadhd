"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/* ---------- UI helpers ---------- */
const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-[#0a122a] flex flex-col items-center justify-center z-50 text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4"></div>
    <p className="mt-4 text-lg">{message}</p>
  </div>
);

const PaymentModal = () => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#101b3d] rounded-2xl shadow-lg max-w-md w-full p-6 text-center border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-3">Premium Access Required</h2>
      <p className="text-gray-300 mb-6">
        Please complete your payment to create an account and unlock your dashboard.
      </p>
      <button
        onClick={() => (window.location.href = "/pricing")}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow hover:scale-105 transition-transform"
      >
        💳 Go to Pricing Page
      </button>
    </div>
  </div>
);

export default function SignUpPageWrapper() {
  return (
    <Suspense fallback={<FullScreenLoader message="Loading..." />}>
      <SignUpPage />
    </Suspense>
  );
}

/* ---------- Main page ---------- */
function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id"); // present when redirected from Stripe

  const [email, setEmail] = useState("");
  const [isEmailLocked, setIsEmailLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Create/update Firestore user doc (mark premium if sessionId exists)
  const createOrUpdateUser = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const tier = sessionId ? "premium" : "free";

    await setDoc(
      userRef,
      {
        email: user.email,
        tier,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  // On mount: if no session_id -> show pay modal; else fetch checkout email
  useEffect(() => {
    (async () => {
      try {
        if (!sessionId) {
          setShowPaymentModal(true);
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/get-session-details?id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (data?.email) {
          setEmail(data.email);
          setIsEmailLocked(true); // lock the email field
        }
      } catch (e) {
        console.error("Failed to fetch session email:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  // Error code → friendly message
  const friendly = (code) => {
    const map = {
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Please choose a stronger password (at least 6 characters).",
      "auth/email-already-in-use": "This email already has an account.",
      "auth/network-request-failed": "Network error. Please try again.",
    };
    return map[code] || "Something went wrong. Please try again.";
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // If another user is logged in in this browser, sign them out first
      if (auth.currentUser && auth.currentUser.email !== email) {
        await signOut(auth);
      }

      // Check if this email already exists
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length > 0) {
        // Existing account
        if (methods.includes("password")) {
          // Try to sign them in with the password they entered
          try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            await createOrUpdateUser(cred.user); // mark premium if session_id present
            router.push("/dashboard");
            return;
          } catch (err) {
            // Wrong password or other issue → send reset link
            await sendPasswordResetEmail(auth, email);
            setError(
              "This email already has an account. We just sent a password reset link to your inbox."
            );
            setLoading(false);
            return;
          }
        } else {
          // Registered with Google/other provider
          setError(
            `This email is already registered with ${methods[0]}. Please use that sign-in method.`
          );
          setLoading(false);
          return;
        }
      }

      // New email → create account (Firebase auto-signs in on success)
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createOrUpdateUser(cred.user);
      router.push("/dashboard");
    } catch (err) {
      console.error("Auth error:", err?.code, err?.message);
      setError(`Firebase: ${friendly(err?.code)}`);
      setLoading(false);
    }
  };

  if (loading) return <FullScreenLoader message="Finalizing account..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a122a] px-4 relative">
      {showPaymentModal && <PaymentModal />}

      {/* ONLY visual change below: hide/disable card when modal is open */}
      <div
        className={`max-w-md w-full bg-[#101b3d] backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/10
        transition-all duration-300
        ${showPaymentModal ? "opacity-0 pointer-events-none scale-95" : "opacity-100"}`}
        aria-hidden={showPaymentModal}
      >
        <h1 className="text-3xl font-semibold text-center text-white">
          ✨ Create Your Premium Account
        </h1>
        <p className="text-center text-gray-300 mt-2">
          Complete your registration to access your dashboard.
        </p>

        {error && (
          <p className="bg-red-900 text-red-300 text-center p-3 rounded-lg mt-4">{error}</p>
        )}

        <form onSubmit={handleSignUp} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              value={email}
              readOnly={isEmailLocked}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white ${
                isEmailLocked ? "bg-gray-700 cursor-not-allowed" : ""
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform"
          >
            🚀 Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
