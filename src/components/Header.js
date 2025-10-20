"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Menu,
    X,
    ArrowRight,
    HeartPulse,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    Stethoscope,
    GraduationCap,
    HeartHandshake,
    Users,
    Gift // Import the Gift icon
} from "lucide-react";

// Updated MobileMenuItem to accept an optional 'icon' prop for the RIGHT side and pulse effect
const MobileMenuItem = ({ href, children, onClick, icon: Icon, pulseEffect }) => (
    <Link
        href={href}
        onClick={onClick}
        className="flex items-center w-full px-4 py-3 border-b border-gray-700 last:border-b-0 hover:bg-[#1f294c] transition-colors duration-200 group"
    >
        {/* Left side: Standard items don't have an icon here, the previous version had a placeholder which I'll remove as it's not needed for standard items */}
        <span className="font-sans text-white text-lg font-light flex-grow truncate">{children}</span>
        
        {/* Right side: Conditionally render the custom Icon or the standard ArrowRight */}
        {Icon ? (
            // Custom Icon for Claim Gifts (replaces ArrowRight)
            <Icon 
                size={20} 
                className={`text-blue-400 transition-colors duration-200 ${pulseEffect ? 'animate-pulse' : ''}`} 
            />
        ) : (
            // Standard ArrowRight icon
            <ArrowRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
        )}
    </Link>
);

// New component for Dropdown Item to include the icon
const DropdownMenuItem = ({ href, children, onClick, icon: Icon }) => (
    <Link
        href={href}
        onClick={onClick}
        className="flex items-center px-4 py-2 text-white hover:bg-[#1f294c] transition-colors duration-200 rounded-lg"
    >
        {Icon && <Icon size={18} className="mr-3 text-blue-400" />}
        <span className="text-left flex-grow">{children}</span>
    </Link>
);


export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [pricingDropdownOpen, setPricingDropdownOpen] = useState(false);

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

    const togglePricingDropdown = () => {
        setPricingDropdownOpen(!pricingDropdownOpen);
    };

    const navLinks = (
        <>
            <MobileMenuItem href="/" onClick={() => setMenuOpen(false)}>Home</MobileMenuItem>
            <MobileMenuItem href="/services" onClick={() => setMenuOpen(false)}>Services</MobileMenuItem>
            <MobileMenuItem href="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</MobileMenuItem>

            {/* Mobile Pricing Dropdown Trigger */}
            <div
                onClick={togglePricingDropdown}
                className="flex items-center w-full px-4 py-3 border-b border-gray-700 last:border-b-0 hover:bg-[#1f294c] transition-colors duration-200 cursor-pointer"
            >
                <span className="font-sans text-white text-lg font-light flex-grow">Pricing</span>
                {pricingDropdownOpen ? <ChevronUp size={20} className="text-gray-400 transition-transform duration-200" /> : <ChevronDown size={20} className="text-gray-400 transition-transform duration-200" />}
            </div>

            {/* Mobile Pricing Dropdown Menu */}
            {pricingDropdownOpen && (
                <div className="flex flex-col">
                    <MobileMenuItem
                        href="/pricing-adhd-assessment"
                        onClick={() => {setMenuOpen(false); setPricingDropdownOpen(false);}}
                        icon={ClipboardList}
                    >
                        ADHD Assessment
                    </MobileMenuItem>
                    <MobileMenuItem
                        href="/pricing-adhd-clinical-assessment"
                        onClick={() => {setMenuOpen(false); setPricingDropdownOpen(false);}}
                        icon={Stethoscope}
                    >
                        ADHD Clinical Assessment
                    </MobileMenuItem>
                    {/*
                    <MobileMenuItem
                        href="/pricing-mental-health-recovery-tools"
                        onClick={() => {setMenuOpen(false); setPricingDropdownOpen(false);}}
                        icon={HeartPulse}
                    >
                        Mental Health Recovery
                    </MobileMenuItem>
                    */}
                    <MobileMenuItem
                        href="/book-a-coach"
                        onClick={() => {setMenuOpen(false); setPricingDropdownOpen(false);}}
                        icon={Users}
                    >
                        Psychiatrist-Led Coaching
                    </MobileMenuItem>
                </div>
            )}

            <MobileMenuItem href="/resources" onClick={() => setMenuOpen(false)}>Resources</MobileMenuItem>
            
            {/* UPDATED MOBILE MENU ITEM: Claim Gifts (after Resources) */}
            <MobileMenuItem 
                href="/free-gifts" 
                onClick={() => setMenuOpen(false)}
                icon={Gift} // Use the Gift icon to replace ArrowRight
                pulseEffect={true} // Enable pulse effect for the icon
            >
                Claim Gifts
            </MobileMenuItem>
        </>
    );

    return (
        <header className="bg-[#101b3d] backdrop-blur-md text-white w-full relative md:fixed md:top-0 md:left-0 md:right-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <img src="/logo.png" alt="ADHD Check Logo" className="h-14" />
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex space-x-8 font-sans font-medium text-white items-center">
                    <Link href="/" className="hover:text-blue-400 transition-all duration-200">Home</Link>
                    <Link href="/services" className="hover:text-blue-400 transition-all duration-200">Services</Link>
                    <Link href="/how-it-works" className="hover:text-blue-400 transition-all duration-200">How It Works</Link>

                    {/* Desktop Pricing Dropdown (Background is bg-[#101b3d]) */}
                    <div className="relative group">
                        <button
                            onClick={togglePricingDropdown}
                            className="hover:text-blue-400 transition-all duration-200 flex items-center"
                        >
                            Pricing
                            {pricingDropdownOpen ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                        </button>
                        <div className={`
                            absolute left-1/2 -translate-x-1/2 mt-2 py-2 w-72 bg-[#101b3d] border border-white/10 rounded-xl shadow-xl z-50
                            transform transition-all duration-300 ease-in-out
                            ${pricingDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                        `}>
                            <div className="text-left">
                                <DropdownMenuItem
                                    href="/pricing-adhd-assessment"
                                    onClick={() => setPricingDropdownOpen(false)}
                                    icon={ClipboardList}
                                >
                                    ADHD Assessment
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    href="/pricing-adhd-clinical-assessment"
                                    onClick={() => setPricingDropdownOpen(false)}
                                    icon={Stethoscope}
                                >
                                    ADHD Clinical Assessment
                                </DropdownMenuItem>
                                {/*
                                <DropdownMenuItem
                                    href="/pricing-mental-health-recovery-tools"
                                    onClick={() => setPricingDropdownOpen(false)}
                                    icon={GraduationCap}
                                >
                                    Mental Health Recovery
                                </DropdownMenuItem>
                                */}
                                <DropdownMenuItem
                                    href="/book-a-coach"
                                    onClick={() => setPricingDropdownOpen(false)}
                                    icon={Users}
                                >
                                    Psychiatrist-Led Coaching
                                </DropdownMenuItem>
                            </div>
                        </div>
                    </div>

                    <Link href="/resources" className="hover:text-blue-400 transition-all duration-200">Resources</Link>
                    
                    {/* UPDATED DESKTOP MENU ITEM: Claim Gifts (after Resources) */}
                    <Link 
                        href="/free-gifts" 
                        className="hover:text-blue-400 transition-all duration-200" // Standard hover effect
                    >
                        Claim Gifts
                    </Link>

                    {/* User Login/Logout Logic */}
                    {user ? (
                        <>
                            <Link href="/dashboard/home" className="hover:text-blue-400 transition-all duration-200">Dashboard</Link>
                            <button
                                onClick={handleLogout}
                                className="text-red-400 font-semibold hover:underline"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg shadow"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-green-600 hover:bg-green-700 transition-colors text-white font-semibold py-2 px-4 rounded-lg shadow"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Button (Hamburger) - Icons remain white (text-white) */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu (Animated) - Background is already bg-[#101b3d] */}
            <div className={`
                md:hidden
                absolute right-4 top-[calc(100%+0.5rem)] max-w-xs w-full p-4
                bg-[#101b3d] border border-white/10 rounded-3xl shadow-xl z-[60]
                transform transition-all duration-300 ease-in-out
                ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'}
            `}>
                <nav className="flex flex-col py-4 font-sans font-light text-white">
                    {navLinks}
                    {/* User Login/Logout Logic */}
                    {user ? (
                        <>
                            <MobileMenuItem href="/dashboard/home" onClick={() => setMenuOpen(false)}>Dashboard</MobileMenuItem>
                            <button onClick={handleLogout} className="text-lg w-full text-left px-4 py-3 text-red-400 font-semibold">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <MobileMenuItem href="/login" onClick={() => setMenuOpen(false)}>Login</MobileMenuItem>
                            <div className="mt-4 px-4 w-full">
                                <Link href="/signup" onClick={() => setMenuOpen(false)} className="w-full text-center block py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold shadow hover:bg-blue-700 transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}