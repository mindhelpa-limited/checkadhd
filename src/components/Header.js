"use client";
import React, { useState, useEffect } from "react";
// Merged imports: added auth, onAuthStateChanged, signOut, Link, useRouter
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
// ADDED NEW ICONS for Pricing Submenu to the import list
import { 
    Menu, 
    X, 
    ArrowRight, 
    ChevronDown, 
    ChevronUp,
    ClipboardList, // ADHD Assessment
    Stethoscope, // ADHD Clinical Assessment
    GraduationCap, // Mindhelpa Institute
    HeartHandshake, // Mental Health Recovery
    Users // Psychiatrist Coaching
} from "lucide-react";

// Updated MobileMenuItem to accept an optional 'icon' prop and adjust styling for it
const MobileMenuItem = ({ href, children, onClick, icon: Icon }) => (
    <Link
        href={href}
        onClick={onClick}
        className="flex items-center w-full px-4 py-3 border-b border-gray-700 last:border-b-0 hover:bg-[#1f294c] transition-colors duration-200 group"
    >
        {Icon && <Icon size={20} className="mr-3 text-blue-400" />}
        {/* ADDED 'truncate' CLASS HERE to keep text on one line */}
        <span className="font-sans text-white text-lg font-light flex-grow truncate">{children}</span> 
        <ArrowRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
    </Link>
);

// New component for Desktop Dropdown Item to include the icon
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
    const [user, setUser] = useState(null); // User state from new logic
    const [pricingDropdownOpen, setPricingDropdownOpen] = useState(false);
    
    // useRouter and its import are now included
    const router = useRouter(); 

    // useEffect hook with Firebase logic
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // handleLogout function with Firebase logic
    const handleLogout = async () => {
        await signOut(auth);
        setMenuOpen(false);
        router.push("/login");
    };
    
    const togglePricingDropdown = () => {
        setPricingDropdownOpen(!pricingDropdownOpen);
    };

    // "Assessment" item is removed here
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

            {/* Mobile Pricing Dropdown Menu (using MobileMenuItem/Link) - REMOVED pl-6 for alignment */}
            {pricingDropdownOpen && (
                <div className="flex flex-col"> 
                    <MobileMenuItem 
                        href="/pricing-adhd-assessment" 
                        onClick={() => {setMenuOpen(false); setPricingDropdownOpen(false);}}
                        icon={ClipboardList}
                    >
                        ADHD Assessment
                    </MobileMenuItem>
                    
                    {/* NEW ITEM 1: ADHD Clinical Assessment */}
                    <MobileMenuItem 
                        href="/pricing-adhd-clinical-assessment" 
                        onClick={() => {setMenuOpen(false); setPricingDropdownOpen(false);}}
                        icon={Stethoscope}
                    >
                        ADHD Clinical Assessment
                    </MobileMenuItem>
                    
                    {/* NEW ITEM 2: Mindhelpa Institute */}
                    <MobileMenuItem 
                        href="/pricing-mindhelpa-institute" 
                        onClick={() => {setMenuOpen(false); setPricingDropdownOpen(false);}}
                        icon={GraduationCap}
                    >
                        Mindhelpa Institute
                    </MobileMenuItem>
                    
                    <MobileMenuItem 
                        href="/pricing-mental-health-recovery-tools" 
                        onClick={() => {setMenuOpen(false); setPricingDropdownOpen(false);}}
                        icon={HeartHandshake}
                    >
                        Mental Health Recovery
                    </MobileMenuItem>
                    <MobileMenuItem 
                        href="/book-a-coach" 
                        onClick={() => {setMenuOpen(false); setPricingDropdownOpen(false);}}
                        icon={Users}
                    >
                        Psychiatrist Coaching
                    </MobileMenuItem>
                </div>
            )}
            
            <MobileMenuItem href="/resources" onClick={() => setMenuOpen(false)}>Resources</MobileMenuItem>
        </>
    );

    return (
        <header className="bg-black/40 backdrop-blur-md text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo (using Link) */}
                <Link href="/" className="flex items-center">
                    {/* Assuming your logo path is correct, or update it if needed */}
                    <img src="/logo.png" alt="ADHD Check Logo" className="h-14" /> 
                </Link>

                {/* Desktop Menu (using Link, "Assessment" removed) */}
                <nav className="hidden md:flex space-x-8 font-sans font-medium text-white items-center">
                    <Link href="/" className="hover:text-blue-400 transition-all duration-200">Home</Link>
                    <Link href="/services" className="hover:text-blue-400 transition-all duration-200">Services</Link>
                    <Link href="/how-it-works" className="hover:text-blue-400 transition-all duration-200">How It Works</Link>
                    
                    {/* Desktop Pricing Dropdown */}
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
                            {/* 💡 text-left ensures content isn't centered, which works better with icons 💡 */}
                            <div className="text-left"> 
                                {/* Desktop dropdown items - NOW WITH ICONS */}
                                <DropdownMenuItem 
                                    href="/pricing-adhd-assessment" 
                                    onClick={() => setPricingDropdownOpen(false)}
                                    icon={ClipboardList}
                                >
                                    ADHD Assessment
                                </DropdownMenuItem>
                                
                                {/* NEW ITEM 1: ADHD Clinical Assessment */}
                                <DropdownMenuItem 
                                    href="/pricing-adhd-clinical-assessment" 
                                    onClick={() => setPricingDropdownOpen(false)} 
                                    icon={Stethoscope}
                                >
                                    ADHD Clinical Assessment
                                </DropdownMenuItem>
                                
                                {/* NEW ITEM 2: Mindhelpa Institute */}
                                <DropdownMenuItem 
                                    href="/pricing-mindhelpa-institute" 
                                    onClick={() => setPricingDropdownOpen(false)} 
                                    icon={GraduationCap}
                                >
                                    Mindhelpa Institute
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem 
                                    href="/pricing-mental-health-recovery-tools" 
                                    onClick={() => setPricingDropdownOpen(false)} 
                                    icon={HeartHandshake}
                                >
                                    Mental Health Recovery
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    href="/book-a-coach" 
                                    onClick={() => setPricingDropdownOpen(false)} 
                                    icon={Users}
                                >
                                    Psychiatrist Coaching
                                </DropdownMenuItem>
                            </div>
                        </div>
                    </div>

                    <Link href="/resources" className="hover:text-blue-400 transition-all duration-200">Resources</Link>
                    {/* User Login/Logout Logic from new code (using Link) */}
                    {user ? (
                        <>
                            {/* CHANGED LINK: from "/dashboard" to "/dashboard/home" */}
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
                fixed top-16 right-4 max-w-xs w-full p-4
                bg-[#101b3d] border border-white/10 rounded-3xl shadow-xl
                transform transition-all duration-300 ease-in-out
                ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'}
            `}>
                <nav className="flex flex-col py-4 font-sans font-light text-white">
                    {navLinks}
                    {/* User Login/Logout Logic from new code (using MobileMenuItem/Link) */}
                    {user ? (
                        <>
                            {/* CHANGED MOBILEMENUITEM: from "/dashboard" to "/dashboard/home" */}
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