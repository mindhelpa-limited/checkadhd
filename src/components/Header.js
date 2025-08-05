"use client";
import { auth } from "@/lib/firebase";
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
    <header className="bg-black/40 backdrop-blur-md text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="ADHD Check Logo" className="h-8" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 font-medium text-white items-center">
          <Link href="/" className="hover:text-focus-gold transition-all duration-200">Home</Link>
          <Link href="/features" className="hover:text-focus-gold transition-all duration-200">Features</Link>
          <Link href="/how-it-works" className="hover:text-focus-gold transition-all duration-200">How It Works</Link>
          <Link href="/assessment" className="hover:text-focus-gold transition-all duration-200">Assessment</Link>
          <Link href="/pricing" className="hover:text-focus-gold transition-all duration-200">Pricing</Link>
          <Link href="/resources" className="hover:text-focus-gold transition-all duration-200">Resources</Link>

          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-focus-gold transition-all duration-200">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="text-red-400 font-semibold hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-focus-gold font-semibold hover:underline"
            >
              Login / Dashboard
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-3xl text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl text-white flex flex-col items-center py-4 space-y-5 font-medium shadow-xl">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/features" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
          <Link href="/assessment" onClick={() => setMenuOpen(false)}>Assessment</Link>
          <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/resources" onClick={() => setMenuOpen(false)}>Resources</Link>

          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={handleLogout} className="text-red-400 font-semibold">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="text-focus-gold font-semibold">
              Login / Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
}