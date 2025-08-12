'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "./context/themeContext";

export function Providers({ children }) {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith('/dashboard');

  return (
    <ThemeProvider>
      {isDashboardPage ? null : <Navbar />}
      {children}
    </ThemeProvider>
  );
}