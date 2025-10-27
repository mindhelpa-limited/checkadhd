"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#101b3d] text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-12" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          <Link href="/" className="hover:text-blue-400 transition">Home</Link>
          <Link href="/services" className="hover:text-blue-400 transition">Services</Link>
          <Link href="/how-it-works" className="hover:text-blue-400 transition">How It Works</Link>
          <Link href="/pricing" className="hover:text-blue-400 transition">Pricing</Link>
          <Link href="/resources" className="hover:text-blue-400 transition">Resources</Link>
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition"
          >
            Login
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#101b3d] border-t border-white/10">
          <nav className="flex flex-col px-6 py-4 space-y-3 text-base font-light">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/resources" onClick={() => setMenuOpen(false)}>Resources</Link>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-2 bg-blue-600 text-center py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
