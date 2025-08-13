"use client";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Home, Activity, BarChart2, User, LogOut, Menu } from "lucide-react";

// A custom hook to manage authentication state within the layout
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
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

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isRecoveryPath = pathname.startsWith("/dashboard/recovery/");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const getFirstName = () => {
    if (userData?.displayName) {
      return userData.displayName.split(" ")[0];
    }
    if (userData?.email) {
      return userData.email.split("@")[0];
    }
    return "User";
  };

  const tabs = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Recovery", href: "/dashboard/recovery", icon: Activity },
    { name: "Progress", href: "/dashboard/progress", icon: BarChart2 },
    { name: "Profile", href: "/dashboard/profile", icon: User },
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isRecoveryPath) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-950 text-gray-100 font-sans">
      {/* Sidebar for Desktop */}
      <aside className={`hidden md:flex w-72 bg-gray-900 shadow-xl border-r border-gray-800 flex-col p-8`}>
        <div className="flex-grow flex flex-col">
          <h2 className="text-2xl font-bold mb-10 text-center text-blue-500 tracking-wider">ADHD Check</h2>
          <nav className="space-y-4 flex-grow">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ease-in-out ${
                  pathname === tab.href ? "bg-blue-600 text-white shadow-lg" : "hover:bg-gray-800 hover:text-white text-gray-400"
                }`}
              >
                <tab.icon size={22} className="flex-shrink-0" />
                <span className="text-lg font-medium">{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-4 p-4 rounded-xl transition-colors duration-200 ease-in-out hover:bg-gray-800 text-red-400"
        >
          <LogOut size={22} />
          <span className="text-lg font-medium">Logout</span>
        </button>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-gray-900 text-gray-100 shadow-xl border-l border-gray-800">
        {/* Top Header for Mobile */}
        <header className="md:hidden flex items-center justify-between bg-gray-900 p-4 border-b border-gray-800 shadow-sm text-gray-100">
          <h1 className="text-lg font-semibold">Welcome, {getFirstName()}</h1>
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500">
            <LogOut size={22} />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar bg-gradient-to-br from-gray-900 to-black">
          {children}
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 shadow-lg flex justify-around py-3 z-20">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center text-xs w-full pt-1 pb-0.5 transition-colors duration-200 ${
              pathname === tab.href ? "text-blue-500" : "text-gray-500 hover:text-blue-400"
            }`}
          >
            <tab.icon size={22} className="mb-1" />
            <span className="text-sm">{tab.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}