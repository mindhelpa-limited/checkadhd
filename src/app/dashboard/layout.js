"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ClipboardList,
  Stethoscope,
  User,
  LogOut,
  Activity as ToolsIcon,
} from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// =====================================================
// 1. Authentication Hook (shared by both layouts)
// =====================================================
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) setUserData(docSnap.data());
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

// =====================================================
// 2. Shared Tools Button (Mobile Floating Tab)
// =====================================================
const MobileToolsTab = ({ href, active }) => (
  <Link
    href={href}
    className={`flex flex-col items-center justify-center
      w-16 h-16 rounded-full transition-all duration-300 ease-in-out
      -mt-8 bg-[#2563EB] shadow-[0_10px_30px_rgba(37,99,235,0.4)]
      hover:shadow-[0_15px_40px_rgba(37,99,235,0.6)] text-white ring-4 ring-white/80
      ${active ? "scale-105" : "hover:scale-105"}`}
  >
    <ToolsIcon size={28} className="animate-spin-slow" style={{ animationDuration: "4s" }} />
    <span className="text-[10px] font-bold mt-1">Tools</span>
  </Link>
);

// =====================================================
// 3. Main Layout Component (Responsive Switch)
// =====================================================
export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userData } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 768);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const isRecoveryPath = pathname.startsWith("/dashboard/recovery/");
  if (isRecoveryPath) return <>{children}</>;

  const tabs = [
    { name: "Home", href: "/dashboard/home", icon: Home, mobileCustom: false },
    { name: "Assessment", href: "/dashboard", icon: ClipboardList, mobileCustom: false },
    { name: "Tools", href: "/dashboard/recovery-tools", icon: ToolsIcon, mobileCustom: true },
    { name: "Coachee", href: "/dashboard/coachee", icon: Stethoscope, mobileCustom: false },
    { name: "Profile", href: "/dashboard/profile", icon: User, mobileCustom: false },
  ];

  const getFirstName = () =>
    userData?.displayName?.split(" ")[0] ||
    userData?.email?.split("@")[0] ||
    "User";

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // =====================================================
  // 4. Desktop Version
  // =====================================================
  const DesktopView = (
    <div className="min-h-screen flex bg-[#F3F4F6] font-sans text-[#111827]">
      {/* Sidebar */}
      <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-[#E5E7EB] shadow-[0_20px_80px_rgba(2,6,23,0.08)] flex flex-col fixed left-0 top-0 bottom-0 z-30">
        <div className="h-1.5 bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#14B8A6]" />
        <div className="px-6 py-6">
          <h2 className="text-[20px] font-semibold">
            <span className="text-[#1D4ED8]">Mindhelpa</span> Limited
          </h2>
          <p className="text-sm text-[#6B7280] mt-1">Hi, {getFirstName()}</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs bg-[#EFF6FF] text-[#1E3A8A] ring-1 ring-[#DBEAFE]">
            Healing is Possible
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 pb-4 space-y-1.5 flex-1 overflow-y-auto">
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
                <tab.icon
                  size={20}
                  className={active ? "text-[#2563EB]" : "text-[#64748B] group-hover:text-[#2563EB]"}
                />
                <span className="text-sm font-medium">{tab.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
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

      {/* Main Content */}
      <main className="flex-1 ml-72 flex flex-col">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );

  // =====================================================
  // 5. Mobile Version (with sticky footer)
  // =====================================================
  const MobileView = (
    <div className="h-screen flex flex-col bg-[#F3F4F6] font-sans text-[#111827]">
      <div className="flex-1 overflow-y-auto pb-[90px]">{children}</div>

      {/* Sticky Footer */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-[9999]
                   bg-white/95 backdrop-blur-xl border-t border-gray-200
                   shadow-[0_-2px_25px_rgba(0,0,0,0.1)]
                   flex justify-around items-center py-2 safe-bottom"
      >
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          if (tab.mobileCustom)
            return <MobileToolsTab key={tab.href} href={tab.href} active={active} />;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center text-[11px] px-3 py-1.5 rounded-xl transition-all
                ${active
                  ? "text-[#2563EB] bg-[#EFF6FF]"
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

  // =====================================================
  // 6. Conditional Render (One Layout)
  // =====================================================
  return isMobile ? MobileView : DesktopView;
}
