"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tornado, LogIn } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

// === Animated Background Grid ===
const AnimatedGrid = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
    <svg
      viewBox="0 0 200 200"
      className="w-[100vw] max-w-4xl h-auto text-cyan-500/10 animate-spin-slow-medium"
      style={{ transformOrigin: "center" }}
    >
      {[...Array(11)].map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={20 * i}
          x2="200"
          y2={20 * i}
          stroke="currentColor"
          strokeWidth="0.2"
        />
      ))}
      {[...Array(11)].map((_, i) => (
        <line
          key={`v-${i}`}
          x1={20 * i}
          y1="0"
          x2={20 * i}
          y2="200"
          stroke="currentColor"
          strokeWidth="0.2"
        />
      ))}
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="stroke-blue-400/20"
      />
    </svg>
  </div>
);

// === Login Modal Component ===
function LoginModal({ onLogin }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center"
        >
          <div className="flex justify-center mb-4">
            <LogIn size={60} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Please Log In
          </h2>
          <p className="text-gray-600 mb-6">
            You need to log in to continue. Your MindHelpa dashboard access is
            available only for signed-in users.
          </p>

          <motion.button
            onClick={onLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg hover:from-blue-700 hover:to-blue-900 flex items-center justify-center gap-2"
          >
            <LogIn size={20} /> Log In
          </motion.button>

          <p className="text-xs text-gray-400 mt-4">
            Secure access to your mental wellness dashboard.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// === Main Pricing Page ===
export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Monitor auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  const handleManageProfile = () => router.push("/dashboard/profile");
  const handleLogin = () => router.push("/login");

  // Loading spinner
  if (loadingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-3">Loading...</div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a122a] text-white min-h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Show Modal if User is NOT Logged In */}
      {!user && <LoginModal onLogin={handleLogin} />}

      {/* Main Section */}
      <div className="relative w-full h-full py-12 sm:py-20 overflow-hidden flex flex-col items-center justify-center">
        <AnimatedGrid />

        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center animate-hero-title-fade">
          <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
            Welcome to Mindhelpa Dashboard
          </h1>

          <button
            onClick={handleManageProfile}
            className="font-sans mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-xl text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/50"
          >
            Manage Profile
          </button>
        </div>
      </div>

      <div className="pb-24 sm:pb-32"></div>

      {/* Animations */}
      <style jsx global>{`
        .animate-hero-title-fade {
          animation: hero-title-fade 1.5s ease-out forwards;
        }
        @keyframes hero-title-fade {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-spin-slow-medium {
          animation: spin-slow-medium 50s linear infinite;
          transform-origin: center;
        }
        @keyframes spin-slow-medium {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
