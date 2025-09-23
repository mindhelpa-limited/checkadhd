"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  BadgeCheck,
  CreditCard,
  HeadphonesIcon,
  Settings,
  Home,
  ListChecks,
  ExternalLink,
} from "lucide-react";

/** Single source of truth for nav items (desktop + mobile) */
const nav = [
  { label: "Overview", href: "/institute/dashboard", icon: GraduationCap },
  { label: "My Courses", href: "/institute/dashboard/courses", icon: BookOpen },
  { label: "Certificates", href: "/institute/dashboard/certificates", icon: BadgeCheck },
  { label: "Billing", href: "/institute/dashboard/billing", icon: CreditCard },
  { label: "Support", href: "/institute/dashboard/support", icon: HeadphonesIcon },
  { label: "Settings", href: "/institute/dashboard/settings", icon: Settings },
];

function SidebarLink({ href, label, Icon, onClick }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition
        ${
          active
            ? "bg-gradient-to-r from-[#4AE3C1]/20 to-[#6E6AFB]/20 text-[#0A0A0A] ring-1 ring-[#6E6AFB]/30"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      aria-current={active ? "page" : undefined}
    >
      <Icon
        className={`w-5 h-5 ${
          active ? "text-[#6E6AFB]" : "text-gray-400 group-hover:text-[#6E6AFB]"
        }`}
      />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Mindhelpa" className="h-8 w-auto" />
              <span className="hidden sm:block font-semibold">Mindhelpa Institute</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/institute/curriculum"
              className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-50"
            >
              Curriculum
            </Link>
            <Link
              href="/pricing"
              className="inline-flex px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white shadow
                         bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] hover:opacity-95"
            >
              Upgrade
            </Link>
          </div>
        </div>
      </header>

      {/* Shell: vertical sidebar (desktop) + main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
        {/* Vertical sidebar — desktop only */}
        <aside className="hidden lg:block">
          <div className="sticky top-[92px]">
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <SidebarLink key={n.href} href={n.href} label={n.label} Icon={n.icon} />
              ))}
            </nav>

            <div className="mt-6 space-y-2">
              <Link
                href="/institute/curriculum"
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50"
              >
                <ListChecks className="w-4 h-4 text-[#6E6AFB]" />
                <span className="text-sm font-medium">Curriculum</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50"
              >
                <Home className="w-4 h-4 text-[#4AE3C1]" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#4AE3C1]/10 to-[#6E6AFB]/10 border border-[#6E6AFB]/20">
              <p className="text-sm text-gray-700">
                Need to review modules?{" "}
                <Link
                  href="/institute/curriculum"
                  className="font-semibold text-[#6E6AFB] hover:underline"
                >
                  Open curriculum
                </Link>
                .
              </p>
            </div>
          </div>
        </aside>

        {/* Main content (extra bottom padding for mobile sticky bar) */}
        <main className="min-w-0 pb-24 lg:pb-0">{children}</main>
      </div>

      {/* Mobile drawer — contains ALL menu items + quick links */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-white shadow-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Mindhelpa" className="h-7 w-auto" />
                <span className="font-semibold">Institute</span>
              </div>
              <button
                className="p-2 rounded-lg border border-gray-200"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-2 space-y-1 overflow-y-auto">
              {nav.map((n) => (
                <SidebarLink
                  key={n.href}
                  href={n.href}
                  label={n.label}
                  Icon={n.icon}
                  onClick={() => setOpen(false)}
                />
              ))}

              {/* Divider */}
              <div className="my-3 h-px bg-gray-200" />

              {/* Extra quick links also visible in drawer */}
              <Link
                href="/institute/curriculum"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                <ListChecks className="w-5 h-5 text-[#6E6AFB]" />
                <span className="font-medium">Curriculum</span>
              </Link>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                <Home className="w-5 h-5 text-[#4AE3C1]" />
                <span className="font-medium">Back to Home</span>
              </Link>
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
              >
                <ExternalLink className="w-5 h-5 text-[#6E6AFB]" />
                <span className="font-medium">Pricing</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Sticky bottom nav — mobile only */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200"
        role="navigation"
        aria-label="Mobile quick nav"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2">
          <Link
            href="/institute/dashboard/courses"
            className="flex flex-col items-center justify-center py-3 gap-1 text-sm font-medium hover:bg-gray-50"
          >
            <BookOpen className="w-5 h-5 text-[#4AE3C1]" />
            <span>My Courses</span>
          </Link>
          <Link
            href="/institute/dashboard/certificates"
            className="flex flex-col items-center justify-center py-3 gap-1 text-sm font-medium hover:bg-gray-50"
          >
            <BadgeCheck className="w-5 h-5 text-[#6E6AFB]" />
            <span>Certificates</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
