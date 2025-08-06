"use client";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Menu, X, ArrowRight } from "lucide-react";

const MobileMenuItem = ({ href, children, onClick }) => (
    <Link
        href={href}
        onClick={onClick}
        className="flex justify-between items-center w-full px-4 py-3 border-b border-gray-700 last:border-b-0 hover:bg-[#1f294c] transition-colors duration-200"
    >
        <span className="font-sans text-white text-lg font-light">{children}</span>
        <ArrowRight size={20} className="text-gray-400" />
    </Link>
);

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

    const navLinks = (
        <>
            <MobileMenuItem href="/" onClick={() => setMenuOpen(false)}>Home</MobileMenuItem>
            <MobileMenuItem href="/features" onClick={() => setMenuOpen(false)}>Features</MobileMenuItem>
            <MobileMenuItem href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</MobileMenuItem>
            <MobileMenuItem href="/assessment" onClick={() => setMenuOpen(false)}>Assessment</MobileMenuItem>
            <MobileMenuItem href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</MobileMenuItem>
            <MobileMenuItem href="/resources" onClick={() => setMenuOpen(false)}>Resources</MobileMenuItem>
        </>
    );

    return (
        <header className="bg-black/40 backdrop-blur-md text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <img src="/logo.png" alt="ADHD Check Logo" className="h-8" />
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex space-x-8 font-sans font-medium text-white items-center">
                    <Link href="/" className="hover:text-blue-400 transition-all duration-200">Home</Link>
                    <Link href="/features" className="hover:text-blue-400 transition-all duration-200">Features</Link>
                    <Link href="/how-it-works" className="hover:text-blue-400 transition-all duration-200">How It Works</Link>
                    <Link href="/assessment" className="hover:text-blue-400 transition-all duration-200">Assessment</Link>
                    <Link href="/pricing" className="hover:text-blue-400 transition-all duration-200">Pricing</Link>
                    <Link href="/resources" className="hover:text-blue-400 transition-all duration-200">Resources</Link>
                    {user ? (
                        <>
                            <Link href="/dashboard" className="hover:text-blue-400 transition-all duration-200">Dashboard</Link>
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
                            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg shadow"
                        >
                            Login / Dashboard
                        </Link>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu (Animated) */}
            <div className={`
                md:hidden
                fixed top-16 right-0 left-0 p-4
                bg-[#101b3d] border border-white/10 rounded-3xl shadow-xl
                transform transition-all duration-300 ease-in-out
                ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'}
            `}>
                <nav className="flex flex-col items-center py-4 font-sans font-light text-white">
                    {navLinks}
                    {user ? (
                        <>
                            <MobileMenuItem href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</MobileMenuItem>
                            <button onClick={handleLogout} className="text-lg w-full text-left px-4 py-3 text-red-400 font-semibold">
                                Logout
                            </button>
                        </>
                    ) : (
                        <MobileMenuItem href="/login" onClick={() => setMenuOpen(false)}>Login / Dashboard</MobileMenuItem>
                    )}
                     <div className="mt-4 px-4 w-full">
                        <Link href="/signup" onClick={() => setMenuOpen(false)} className="w-full text-center block py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-700 transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}