"use client";

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

// ===================================
// 3. Firebase/Local Imports
// ===================================
// Firebase/Authentication Imports
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Assumes firebase config import

// ####################################################################
// ## Custom Hook: useAuth
// ####################################################################
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
    return () => unsubscribe();
  }, []);

  return { user, userData, loading };
};

// ####################################################################
// ## Helper Component: MobileToolsTab
// ####################################################################
const MobileToolsTab = ({ href, active }) => (
  <Link
    href={href}
    className={`
      flex flex-col items-center justify-center
      w-16 h-16 rounded-full
      transition-all duration-300 ease-in-out
      -mt-8
      bg-[#2563EB]
      shadow-[0_10px_30px_rgba(37,99,235,0.4)]
      hover:shadow-[0_15px_40px_rgba(37,99,235,0.6)]
      text-white
      ring-4 ring-white/80
      ${active ? "scale-105" : "hover:scale-105"}
    `}
  >
    <ToolsIcon
      size={28}
      className="animate-spin-slow"
      style={{ animationDuration: "4s" }}
    />
    <span className="text-[10px] font-bold mt-1">Tools</span>
  </Link>
);

// ####################################################################
// ## Main Component: DashboardLayout
// ####################################################################
export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userData, loading } = useAuth();

  const isRecoveryPath = pathname.startsWith("/dashboard/recovery/");

  const tabs = [
    { name: "Home", href: "/dashboard/home", icon: Home, mobileCustom: false },
    { name: "Assessment", href: "/dashboard", icon: ClipboardList, mobileCustom: false },
    {
      name: "Tools",
      href: "/dashboard/recovery-tools",
      icon: ToolsIcon,
      mobileCustom: true,
    },
    { name: "Coachee", href: "/dashboard/coachee", icon: Stethoscope, mobileCustom: false },
    { name: "Profile", href: "/dashboard/profile", icon: User, mobileCustom: false },
  ];

  const getFirstName = () => {
    if (userData?.displayName) return userData.displayName.split(" ")[0];
    if (userData?.email) return userData.email.split("@")[0];
    return "User";
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (isRecoveryPath) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-[#111827] bg-[#F3F4F6] relative">
      {/* ===== 6.1. Background/Theme Styling ===== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_8%_0%,#93C5FD_0%,transparent_40%),radial-gradient(900px_500px_at_100%_12%,#5EEAD4_0%,transparent_45%)] opacity-25" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(17,24,39,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.5),transparent_60%)]" />
      </div>

      {/* ===== Sidebar (Desktop) ===== */}
      <aside className="hidden md:flex w-72 bg-white/70 backdrop-blur-xl border-r border-[#E5E7EB] shadow-[0_20px_80px_rgba(2,6,23,0.08)] flex-col">
        <div className="relative">
          <div className="h-1.5 bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#14B8A6]" />
          <div className="px-6 py-6">
            <h2 className="text-[20px] leading-tight font-semibold tracking-tight">
              <span className="text-[#1D4ED8]">Mindhelpa</span> Limited
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">Hi, {getFirstName()}</p>
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
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all
                  ${active
                    ? "bg-white shadow-[0_10px_40px_rgba(2,6,23,0.08)] text-[#0F172A] border border-[#E5E7EB]"
                    : "text-[#475569] hover:text-[#0F172A] hover:bg-white/60 hover:shadow-[0_6px_24px_rgba(2,6,23,0.06)]"
                  }`}
              >
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

      {/* ===== Main Content (Adjusted Padding Here) ===== */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-0 md:p-0 overflow-y-auto">
          <div className="w-full h-full">
            {/* 💡 CHANGE: Added 'pb-[80px]' for mobile to clear the fixed bottom navigation, and reset it on medium screens. */}
            <div className="p-0 pb-[80px] md:p-0 md:pb-0">{children}</div>
          </div>
        </main>
      </div>

      {/* ===== Bottom Dock (Mobile - Already Fixed) ===== */}
      {/* The classes 'fixed bottom-0 left-0 right-0 z-40' make this sticky on scroll */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full bg-white/80 backdrop-blur-2xl border-t border-[#E5E7EB] shadow-[0_0px_30px_rgba(2,6,23,0.1)] flex justify-around py-3">
        {tabs.map((tab) => {
          const active = pathname === tab.href;

          if (tab.mobileCustom) {
            return (
              <MobileToolsTab
                key={tab.href}
                href={tab.href}
                active={active}
              />
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
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