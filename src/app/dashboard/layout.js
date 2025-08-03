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

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // Extract the first name from the displayName or email
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
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar for Desktop */}
      <aside className={`hidden md:flex w-64 bg-gray-900 text-white flex-col p-6`}>
        <h2 className="text-xl font-bold mb-8 text-center">ADHD Check</h2>
        <nav className="space-y-3">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                pathname === tab.href ? "bg-blue-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              <tab.icon size={20} />
              {tab.name}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top Header for Mobile */}
        <header className="md:hidden flex items-center justify-between bg-white p-4 border-b">
           <h1 className="text-lg font-semibold">
            Welcome, {getFirstName()}
          </h1>
          <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-red-500">
            <LogOut size={22} />
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center text-xs w-full pt-1 pb-0.5 transition-colors ${
              pathname === tab.href ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
            }`}
          >
            <tab.icon size={22} />
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
