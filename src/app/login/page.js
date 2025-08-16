"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            tier: "free",
          });
          router.push("/pricing");
        } else {
          const userData = docSnap.data();
          router.push(userData?.tier === "premium" ? "/dashboard" : "/pricing");
        }
      } else {
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // ✅ JS-only version (no TypeScript annotation)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a122a]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-[#0a122a] text-white">
      {/* LEFT: Icon + copy */}
      <div className="hidden md:flex flex-col justify-center items-center p-10 text-center">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 ring-1 ring-white/10 shadow-[0_10px_30px_rgba(59,130,246,0.45)] grid place-items-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <span className="text-xl font-semibold">Secure Login</span>
        </div>

        <h1 className="text-3xl font-bold">Take Control of Your ADHD Journey</h1>
        <p className="mt-4 text-gray-300 max-w-sm">
          Your personalized program for focus, progress, and lasting change starts here.
        </p>
      </div>

      {/* RIGHT: Form */}
      <div className="flex flex-col justify-center items-center p-8 bg-[#0d1538]">
        <div className="w-full max-w-sm">
          <div className="text-left mb-10">
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-blue-400 hover:text-blue-300">
                Sign Up
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
                <Mail className="w-4 h-4 text-blue-400" /> Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Lock className="w-4 h-4 text-blue-400" /> Password
                </label>
                <Link href="/reset-password" className="text-sm font-medium text-blue-400 hover:text-blue-300">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-lg shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
