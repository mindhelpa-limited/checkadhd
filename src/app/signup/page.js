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
    <div className="fixed inset-0 bg-[#0a122a] flex flex-col items-center justify-center z-50 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-b-4"></div>
        <p className="mt-4 text-lg font-sans font-medium">{message}</p>
    </div>
);

const PaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-[#101b3d] rounded-2xl shadow-lg max-w-md w-full p-6 text-center border border-white/10">
            <h2 className="font-sans text-xl font-semibold text-white mb-3">Premium Access Required</h2>
            <p className="font-sans text-gray-300 mb-6">
                Please complete your payment to create an account and unlock your dashboard.
            </p>
            <button
                onClick={() => (window.location.href = "/pricing")}
                className="font-sans bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow hover:scale-105 transition-transform"
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
        <div className="min-h-screen flex items-center justify-center bg-[#0a122a] px-4 relative">
            {showPaymentModal && <PaymentModal />}

            <div className="max-w-md w-full bg-[#101b3d] backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/10">
                <h1 className="font-sans text-3xl font-semibold text-center text-white">
                    ✨ Create Your Premium Account
                </h1>
                <p className="font-sans text-center text-gray-300 mt-2">
                    Complete your registration to access your dashboard.
                </p>

                {error && (
                    <p className="font-sans bg-red-900 text-red-400 text-center p-3 rounded-lg mt-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSignUp} className="mt-6 space-y-5">
                    <div>
                        <label className="font-sans block text-sm font-medium text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            readOnly={isEmailLocked}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`font-sans mt-1 w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white ${
                                isEmailLocked ? "bg-gray-700 cursor-not-allowed" : ""
                            } focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                            required
                        />
                    </div>

                    <div>
                        <label className="font-sans block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="font-sans mt-1 w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="font-sans w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform"
                    >
                        🚀 Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}