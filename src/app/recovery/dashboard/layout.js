"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Music,
  Headphones,
  Moon,
  PlayCircle,
  Quote,
  Target,
  BookOpen,
  PenTool,
  Eye,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { name: "Overview", href: "/recovery/dashboard", icon: <BookOpen size={20} /> },
  { name: "Music Therapy", href: "/recovery/dashboard/music", icon: <Music size={20} /> },
  { name: "Meditation", href: "/recovery/dashboard/meditation", icon: <Headphones size={20} /> },
  { name: "Sleeping Sounds", href: "/recovery/dashboard/sleep", icon: <Moon size={20} /> },
  { name: "Motivational Videos", href: "/recovery/dashboard/videos", icon: <PlayCircle size={20} /> },
  { name: "Affirmations", href: "/recovery/dashboard/affirmations", icon: <Quote size={20} /> },
  { name: "Goal Tracker", href: "/recovery/dashboard/goals", icon: <Target size={20} /> },
  { name: "Journaling", href: "/recovery/dashboard/journaling", icon: <PenTool size={20} /> },
  { name: "Visualization", href: "/recovery/dashboard/visualization", icon: <Eye size={20} /> },
];

export default function RecoveryLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white text-gray-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:block w-72 bg-white border-r border-gray-200 p-6 space-y-6">
        <h2 className="text-xl font-bold text-[#6E6AFB]">Recovery Tools</h2>
        <nav className="space-y-3">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 text-gray-700 hover:text-[#6E6AFB] hover:font-semibold transition"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#6E6AFB] text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar (Drawer) */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="relative w-72 bg-white p-6 shadow-xl z-50">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-[#6E6AFB]"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-[#6E6AFB] mb-6">Recovery Tools</h2>
            <nav className="space-y-3">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-700 hover:text-[#6E6AFB] hover:font-semibold transition"
                  onClick={() => setIsOpen(false)} // close on click
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
