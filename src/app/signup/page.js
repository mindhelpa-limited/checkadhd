"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
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
  const sessionId = searchParams.get("session_id"); // from Stripe

  const [email, setEmail] = useState("");
  const [isEmailLocked, setIsEmailLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Track product they bought
  const [productTag, setProductTag] = useState("free");

  // Create/update Firestore user doc
  const createOrUpdateUser = async (user, tierTag = "free") => {
    const userRef = doc(db, "users", user.uid);

    await setDoc(
      userRef,
      {
        email: user.email,
        tier: tierTag,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  // Decide redirect based on product tag
  const redirectToDashboard = (tag) => {
    switch (tag) {
      case "recovery":
        router.push("/dashboard/recovery");
        break;
      case "coaching":
        router.push("/dashboard/coaching");
        break;
      case "institute":
        router.push("/dashboard/institute");
        break;
      default:
        router.push("/dashboard");
        break;
    }
  };

  // On mount → check payment session
  useEffect(() => {
    (async () => {
      try {
        if (!sessionId) {
          setShowPaymentModal(true);
          setLoading(false);
          return;
        }

        const res = await fetch(
          `/api/get-session-details?id=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json();

        if (data?.email) {
          setEmail(data.email);
          setIsEmailLocked(true);

          let tag = "premium"; // default
          switch (data.product) {
            case "recovery":
              tag = "recovery";
              break;
            case "coaching":
              tag = "coaching";
              break;
            case "institute":
              tag = "institute";
              break;
          }
          setProductTag(tag);

          // ✅ If user already logged in → go straight
          if (auth.currentUser) {
            await createOrUpdateUser(auth.currentUser, tag);
            redirectToDashboard(tag);
            return;
          }

          // ✅ If email already exists → redirect to login
          const methods = await fetchSignInMethodsForEmail(auth, data.email);
          if (methods.length > 0) {
            router.push(`/login?email=${encodeURIComponent(data.email)}&product=${tag}`);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to fetch session email:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId, router]);

  // Handle signup (only runs for brand new email)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await createOrUpdateUser(cred.user, productTag);
      redirectToDashboard(productTag);
    } catch (err) {
      console.error("Signup error:", err?.code, err?.message);
      setError("Could not create account. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <FullScreenLoader message="Finalizing account..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a122a] px-4 relative">
      {showPaymentModal && <PaymentModal />}

      <div
        className={`max-w-md w-full bg-[#101b3d] backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/10
        transition-all duration-300
        ${showPaymentModal ? "opacity-0 pointer-events-none scale-95" : "opacity-100"}`}
        aria-hidden={showPaymentModal}
      >
        <h1 className="text-3xl font-semibold text-center text-white">
          ✨ Create Your Account
        </h1>
        <p className="text-center text-gray-300 mt-2">
          Complete your registration to access your dashboard.
        </p>

        {error && (
          <p className="bg-red-900 text-red-300 text-center p-3 rounded-lg mt-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSignUp} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
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
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
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
            🚀 Continue
          </button>
        </form>
      </div>
    </div>
  );
}
