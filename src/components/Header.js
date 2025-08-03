"use client";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="ADHD Check Logo" className="h-8" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6 font-medium text-gray-800 items-center">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/features" className="hover:text-blue-600">Features</Link>
          <Link href="/how-it-works" className="hover:text-blue-600">How It Works</Link>
          <Link href="/assessment" className="hover:text-blue-600">Assessment</Link>
          <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
          <Link href="/resources" className="hover:text-blue-600">Resources</Link>

          {/* Dynamic Auth Links for Desktop */}
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="text-red-600 font-semibold hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Login / Dashboard
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg flex flex-col items-center py-4 space-y-4 text-gray-800">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/features" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href="/assessment" onClick={() => setMenuOpen(false)}>Assessment</Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/resources" onClick={() => setMenuOpen(false)}>Resources</Link>

          {/* Dynamic Auth Links for Mobile */}
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="font-semibold"
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-red-600 font-semibold">
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-blue-600 font-semibold"
            >
              Login / Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
