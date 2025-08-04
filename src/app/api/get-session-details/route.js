"use client";
import { auth, db } from "@/lib/firebase";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.6,20.1H42V20H24v8h11.3c-1.6,4.7-6.1,8-11.3,8c-6.6,0-12-5.4-12-12c0-6.6,5.4-12,12-12c3.1,0,5.8,1.2,8,3l5.7-5.7C34,6.1,29.3,4,24,4C13,4,4,13,4,24c0,11,9,20,20,20c11,0,20-9,20-20C44,22.7,43.9,21.3,43.6,20.1z"
    />
  </svg>
);

const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    <p className="ml-4 text-gray-700 font-medium">{message}</p>
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const createOrUpdateUserDocument = async (user) => {
    const userDocRef = doc(db, "users", user.uid);
    const pendingUserRef = doc(db, "pending_users", user.email);
    const pendingUserSnap = await getDoc(pendingUserRef);

    let tier = "free";
    let stripeCustomerId = null;

    if (pendingUserSnap.exists()) {
      tier = "premium";
      stripeCustomerId = pendingUserSnap.data().stripeCustomerId;
      await deleteDoc(pendingUserRef);
    }

    await setDoc(
      userDocRef,
      {
        email: user.email,
        displayName: user.displayName || null,
        createdAt: new Date(),
        score: 0,
        tier,
        stripeCustomerId,
      },
      { merge: true }
    );
  };

  // ✅ Fetch email from Stripe session
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      setLoading(true);
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
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await createOrUpdateUserDocument(result.user);
          router.push("/dashboard");
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [router]);

  // ✅ Updated signup logic to always use Stripe email if session exists
  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let finalEmail = email;
      const sessionId = searchParams.get("session_id");

      if (sessionId) {
        const res = await fetch(`/api/get-session-details?id=${sessionId}`);
        const data = await res.json();
        if (data.email) finalEmail = data.email; // ✅ Always trust Stripe email
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        finalEmail,
        password
      );
      await createOrUpdateUserDocument(userCredential.user);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).catch(() => {
      setError("Failed to initiate Google signup. Please try again.");
      setLoading(false);
    });
  };

  if (loading) return <FullScreenLoader message="Finalizing account..." />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-2">Finish setting up your premium account.</p>
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-8">
          {error && (
            <p className="bg-red-100 text-red-700 text-center p-3 rounded-lg mb-4">
              {error}
            </p>
          )}

          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center border border-gray-300 rounded-lg py-3 mb-6 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
          >
            <GoogleIcon /> Sign Up with Google
          </button>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-4 text-gray-400 text-sm font-medium">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form onSubmit={handleEmailSignUp}>
            <div className="relative mb-4">
              <MailIcon />
              <input
                type="email"
                placeholder="Email address"
                className={`w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none ${
                  isEmailLocked
                    ? "bg-gray-100 cursor-not-allowed"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly={isEmailLocked} // ✅ Locks field if Stripe email is used
              />
            </div>

            <div className="relative mb-6">
              <LockIcon />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
