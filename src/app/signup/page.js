"use client";
import { auth, db } from "@/lib/firebase";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-gray-50 flex flex-col items-center justify-center z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4"></div>
    <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
  </div>
);

function PaymentRequiredModal({ onRedirect }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">👋 Almost there!</h2>
        <p className="text-gray-600 mb-6">
          To create your premium account, please complete your payment first.
        </p>
        <button
          onClick={onRedirect}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform"
        >
          💳 Go to Pricing
        </button>
      </div>
    </div>
  );
}

export default function SignUpPageWrapper() {
  return (
    <Suspense fallback={<FullScreenLoader message="Loading..." />}>
      <SignUpPage />
    </Suspense>
  );
}

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [isEmailLocked, setEmailLocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const createOrUpdateUser = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const pendingRef = doc(db, "pending_users", user.email);
    const pendingSnap = await getDoc(pendingRef);

    let tier = "free";
    let stripeCustomerId = null;

    if (pendingSnap.exists()) {
      tier = "premium";
      stripeCustomerId = pendingSnap.data().stripeCustomerId;
      await deleteDoc(pendingRef);
    }

    await setDoc(
      userRef,
      {
        email: user.email,
        createdAt: new Date(),
        tier,
        stripeCustomerId,
      },
      { merge: true }
    );
  };

  useEffect(() => {
    if (!sessionId) {
      setShowPaymentModal(true);
      setLoading(false);
      return;
    }

    const fetchEmail = async () => {
      try {
        const res = await fetch(`/api/get-session-details?session_id=${sessionId}`);
        const data = await res.json();
        if (data?.email) {
          setEmail(data.email);
          setEmailLocked(true);
        }
      } catch (err) {
        console.error("Failed to fetch session email:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [sessionId]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createOrUpdateUser(userCredential.user);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <FullScreenLoader message="Finalizing account..." />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4 relative">
      {showPaymentModal && (
        <PaymentRequiredModal onRedirect={() => router.push("/pricing")} />
      )}

      <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/50">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">
          ✨ Create Your Premium Account
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Complete your registration to access your dashboard.
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 text-center p-3 rounded-lg mt-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSignUp} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              readOnly={isEmailLocked}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full px-4 py-3 rounded-xl border ${
                isEmailLocked ? "bg-gray-100 cursor-not-allowed" : ""
              } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none"
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