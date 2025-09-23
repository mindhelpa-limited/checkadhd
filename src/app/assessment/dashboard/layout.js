"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  FileBarChart,
  FileText,
  BookOpen,
} from "lucide-react";

/** Small helper to highlight the active link */
function SidebarLink({ href, icon: Icon, label }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
        ${active
          ? "bg-gradient-to-r from-[#4AE3C1]/15 to-[#6E6AFB]/15 text-[#0f172a] ring-1 ring-[#4AE3C1]/40"
          : "text-gray-600 hover:bg-gray-50"
        }`}
    >
      <Icon size={18} className={active ? "text-[#0f172a]" : "text-gray-500"} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function AssessmentDashboardLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-white">
      {/* Page container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-20">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  Assessment
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Your ADHD screening workspace
                </p>
              </div>

              <nav className="p-3 space-y-2">
                <SidebarLink
                  href="/assessment"
                  icon={BookOpen}
                  label="Overview"
                />
                <SidebarLink
                  href="/assessment/dashboard"
                  icon={LayoutDashboard}
                  label="Dashboard"
                />
                <SidebarLink
                  href="/assessment/dashboard/adhd-test"
                  icon={ClipboardList}
                  label="Take / Resume Test"
                />
                <SidebarLink
                  href="/assessment/dashboard/results"
                  icon={FileBarChart}
                  label="Results & History"
                />
                <SidebarLink
                  href="/assessment/dashboard/report"
                  icon={FileText}
                  label="Report / Export"
                />
              </nav>
            </div>

            {/* Brand card */}
            <div className="mt-6 rounded-2xl p-[1px] bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB]">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm text-gray-700">
                  This tool follows{" "}
                  <span className="font-medium">ASRS + DSM-5</span> guidance to
                  reflect your patterns — clearly, gently, without judgment.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-8 xl:col-span-9">
          {children}
        </main>
      </div>
    </div>
  );
}
