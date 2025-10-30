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

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userData } = useAuth();

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

  return (
    <div className="h-screen flex flex-col bg-[#F3F4F6] font-sans text-[#111827]">
      {/* ===== Scrollable Main Content ===== */}
      <div className="flex-1 overflow-y-auto pb-[90px] md:pb-0">
        {children}
      </div>

      {/* ===== Sticky Footer (Always Visible) ===== */}
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
}
