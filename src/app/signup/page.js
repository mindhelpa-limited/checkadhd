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

const PaymentModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Premium Access Required</h2>
      <p className="text-gray-600 mb-6">
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

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [isEmailLocked, setIsEmailLocked] = useState(false);
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

  // ✅ Show modal or fetch email
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      setShowPaymentModal(true);
      return;
    }

    fetch(`/api/get-session-details?id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setEmail(data.email);
          setIsEmailLocked(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await createOrUpdateUser(userCredential.user);

      // ✅ Auto-login after signup
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
      {showPaymentModal && <PaymentModal />}

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