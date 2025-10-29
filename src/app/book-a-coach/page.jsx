'use client';

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/home/Footer";

// Beautiful gradient popup
const SubscribePopup = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-[2px] rounded-3xl shadow-2xl"
    >
      <div className="bg-gray-900/95 rounded-3xl p-8 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Please Subscribe 💫</h2>
        <p className="text-gray-300 mb-6">
          Your coaching journey starts with your first step.  
          Subscribe now to unlock your personalised recovery plan.
        </p>
        <button
          onClick={() => (window.location.href = "/book-a-coach")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg"
        >
          Go to Subscribe Page
        </button>
        <button
          onClick={onClose}
          className="block mt-4 text-gray-400 text-sm hover:text-gray-200"
        >
          Maybe later
        </button>
      </div>
    </motion.div>
  </div>
);

export default function CoacheeDashboard() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        // Not logged in → redirect to login
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(u);

      // 🔍 Check subscription (your tag check API)
      const token = await u.getIdToken();
      const res = await fetch("/api/check-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: token }),
      });
      const data = await res.json();

      if (data.active && data.productTag?.startsWith("coaching_")) {
        setAllowed(true);
      } else {
        setShowPopup(true);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Checking your access...
      </div>
    );

  // If not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
        <p className="mb-6 text-gray-300">
          You must be logged in to access your coaching dashboard.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // If logged in but not subscribed
  if (showPopup) {
    return <SubscribePopup onClose={() => setShowPopup(false)} />;
  }

  // ✅ If allowed (active subscription with matching tag)
  if (allowed) {
    return (
      <div className="min-h-screen text-white bg-gradient-to-b from-[#06113b] to-black">
        <Header />
        <div className="pt-20 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Welcome to Your Coaching Dashboard</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Access your personalised coaching sessions, progress plans, and resources here.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return null;
}
