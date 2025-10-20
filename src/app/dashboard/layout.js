'use client';

// ===================================
// 1. React/Next.js Core & Hooks
// ===================================
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// ===================================
// 2. Third-party Libraries & Icons
// ===================================
// Icon Imports (Lucide React)
import {
  Home,
  ClipboardList, // Assessment
  Stethoscope, // Coachee
  User, // Profile
  LogOut,
  Activity as ToolsIcon, // Alias for the main tools/recovery icon
} from "lucide-react";

// Third-party Audio Library
import * as Tone from 'tone';

// ===================================
// 3. Firebase/Local Imports
// ===================================
// Firebase/Authentication Imports
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Assumes firebase config import


// ####################################################################
// ## Custom Hook: useAuth (Ideally moved to '@/hooks/useAuth.js')
// ####################################################################

/**
 * Custom hook to monitor Firebase authentication state and fetch user data.
 * Fetches user profile data from Firestore upon successful authentication.
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        let fetchedUserData = null;
        if (docSnap.exists()) {
          fetchedUserData = docSnap.data();
        }

        setUserData(fetchedUserData);
        setUser(currentUser);
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  return { user, userData, loading };
};


// ####################################################################
// ## Helper Component: MobileToolsTab (Ideally moved to its own file)
// ####################################################################

/**
 * Custom, prominent component for the 'Tools' tab in the mobile bottom dock.
 * Features a distinct, floating design with a slow-rotating icon.
 */
const MobileToolsTab = ({ href, playClickSound, active }) => (
  <Link
    href={href}
    onClick={playClickSound}
    className={`
      flex flex-col items-center justify-center
      w-16 h-16 rounded-full
      transition-all duration-300 ease-in-out
      -mt-8 // Key style: pulls the button up into the dock center
      bg-[#2563EB] // Primary brand color background
      shadow-[0_10px_30px_rgba(37,99,235,0.4)]
      hover:shadow-[0_15px_40px_rgba(37,99,235,0.6)]
      text-white
      ring-4 ring-white/80 // Visual separation ring
      ${active ? "scale-105" : "hover:scale-105"}
    `}
  >
    <ToolsIcon // Icon with rotation animation
      size={28}
      className="animate-spin-slow"
      style={{ animationDuration: '4s' }}
    />
    <span className="text-[10px] font-bold mt-1">Tools</span>
  </Link>
);


// ####################################################################
// ## Main Component: DashboardLayout
// ####################################################################

/**
 * A responsive layout component providing persistent UI elements (sidebar/dock)
 * and managing authentication state for the dashboard.
 */
export default function DashboardLayout({ children }) {
  // --- 1. Hooks & State Initialization ---
  const pathname = usePathname();
  const router = useRouter();
  const { userData, loading } = useAuth(); // Use the custom hook
  const clickSoundPlayer = useRef(null); // Ref for Tone.js Player

  // --- 2. Constants & Configuration ---
  const isRecoveryPath = pathname.startsWith("/dashboard/recovery/"); // Conditional rendering flag

  const tabs = [
    { name: "Home", href: "/dashboard/home", icon: Home, mobileCustom: false },
    { name: "Assessment", href: "/dashboard", icon: ClipboardList, mobileCustom: false },
    {
      name: "Tools", // The central, custom mobile tab
      href: "/dashboard/recovery-tools",
      icon: ToolsIcon,
      mobileCustom: true
    },
    { name: "Coachee", href: "/dashboard/coachee", icon: Stethoscope, mobileCustom: false },
    { name: "Profile", href: "/dashboard/profile", icon: User, mobileCustom: false },
  ];

  // --- 3. Helper Functions ---

  const getFirstName = () => {
    if (userData?.displayName) {
      return userData.displayName.split(" ")[0];
    }
    if (userData?.email) {
      return userData.email.split("@")[0];
    }
    return "User";
  };

  const playClickSound = async () => {
    if (clickSoundPlayer.current?.loaded) {
      // Start Tone.js context if it's suspended (required by some browsers)
      if (Tone.context.state !== 'running') {
          await Tone.start();
      }
      clickSoundPlayer.current.start(0);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // --- 4. Effects (Lifecycle/Side-Effects) ---

  /* Initialize Tone.js Player for audio feedback. */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initTone = async () => {
        // No need to call Tone.start() here, just instantiate the player
        clickSoundPlayer.current = new Tone.Player("/sounds/click.mp3").toDestination();
        // Wait for the audio buffer to load
        await new Promise(resolve => {
          if (clickSoundPlayer.current.loaded) {
            resolve();
          } else {
            clickSoundPlayer.current.onload = resolve;
          }
        });
      };
      initTone();
    }
    // No explicit return cleanup is used here, relying on garbage collection/Tone's internal handling
  }, []);

  /* Force scroll to top on page change */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);


  // --- 5. Early Exit/Loading UI ---

  // If on a dedicated recovery sub-page, render only the content (no sidebar/dock)
  if (isRecoveryPath) return <>{children}</>;

  // A loading state would typically go here
  // if (loading) return <LoadingSpinner />;


  // --- 6. Render UI ---
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-[#111827] bg-[#F3F4F6] relative">

      {/* ===== 6.1. Background/Theme Styling ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Gradients and subtle grid pattern for visual depth */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_8%_0%,#93C5FD_0%,transparent_40%),radial-gradient(900px_500px_at_100%_12%,#5EEAD4_0%,transparent_45%)] opacity-25" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(17,24,39,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.5),transparent_60%)]" />
      </div>

      {/* ===== 6.2. Sidebar (Desktop) ===== */}
      <aside className="hidden md:flex w-72 bg-white/70 backdrop-blur-xl border-r border-[#E5E7EB] shadow-[0_20px_80px_rgba(2,6,23,0.08)] flex-col">

        {/* Brand Header & User Info */}
        <div className="relative">
          <div className="h-1.5 bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#14B8A6]" />

          <div className="px-6 py-6">
            <h2 className="text-[20px] leading-tight font-semibold tracking-tight">
              <span className="text-[#1D4ED8]">Mindhelpa</span> Limited
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">Hi, {getFirstName()}</p>

            {/* Branded Pill */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-[#EFF6FF] text-[#1E3A8A] ring-1 ring-[#DBEAFE]">
              Healing is Possible
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 pb-4 space-y-1.5 flex-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={playClickSound}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all
                  ${active
                    ? "bg-white shadow-[0_10px_40px_rgba(2,6,23,0.08)] text-[#0F172A] border border-[#E5E7EB]"
                    : "text-[#475569] hover:text-[#0F172A] hover:bg-white/60 hover:shadow-[0_6px_24px_rgba(2,6,23,0.06)]"
                  }`}
              >
                {/* Active Indicator Bar */}
                <span className={`absolute left-0 top-2 bottom-2 w-1 rounded-full transition-all
                  ${active ? "bg-gradient-to-b from-[#3B82F6] to-[#14B8A6] opacity-100"
                    : "opacity-0 group-hover:opacity-50 bg-[#93C5FD]"}`}
                />

                <tab.icon size={20} className={active ? "text-[#2563EB]" : "text-[#64748B] group-hover:text-[#2563EB]"} />
                <span className="text-sm font-medium">{tab.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-white/80 hover:bg-[#FEF2F2] text-[#B91C1C] border border-[#E5E7EB] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ===== 6.3. Main Content Area ===== */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-0 md:p-0 overflow-y-auto">
          <div className="w-full h-full">
            <div className="p-0 md:p-0">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* ===== 6.4. Bottom Dock (Mobile) ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full bg-white/80 backdrop-blur-2xl border-t border-[#E5E7EB] shadow-[0_0px_30px_rgba(2,6,23,0.1)] flex justify-around py-3">
        {tabs.map((tab) => {
          const active = pathname === tab.href;

          // Render custom tab for 'Tools'
          if (tab.mobileCustom) {
            return (
              <MobileToolsTab
                key={tab.href}
                href={tab.href}
                playClickSound={playClickSound}
                active={active}
              />
            );
          }

          // Render standard mobile tab
          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={playClickSound}
              className={`flex flex-col items-center text-[11px] px-3 py-1.5 rounded-xl transition-all
                ${active
                  ? "text-[#2563EB] bg-[#EFF6FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                  : "text-[#6B7280] hover:text-[#2563EB]"}`}
            >
              <tab.icon size={18} className="mb-0.5" />
              <span className="font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}