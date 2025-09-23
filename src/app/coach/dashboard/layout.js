"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Calendar, CreditCard, Home, User, DollarSign } from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/coach/dashboard", label: "Overview", icon: <Home size={18} /> },
    { href: "/coach/dashboard/bookings", label: "Bookings", icon: <Calendar size={18} /> },
    { href: "/coach/dashboard/availability", label: "Availability", icon: <BarChart3 size={18} /> },
    { href: "/coach/dashboard/earnings", label: "Earnings", icon: <DollarSign size={18} /> },
    { href: "/coach/dashboard/payouts", label: "Payouts", icon: <CreditCard size={18} /> },
    { href: "/coach/dashboard/profile", label: "Profile", icon: <User size={18} /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#4AE3C1] via-[#6E6AFB] to-[#8A5CF6] text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">Mindhelpa</div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                pathname === item.href ? "bg-white/20 font-semibold" : "hover:bg-white/10"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/20">
          <button className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg transition">
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Coach Dashboard</h1>
          <div className="text-gray-600">Welcome, Dr Kelvin</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
