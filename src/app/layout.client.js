"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import "./globals.css"; // ✅ Corrected path

export default function Layout({ children }) {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <html lang="en">
      <body>
        {!isDashboardPage && <Header />}
        <main>{children}</main>
      </body>
    </html>
  );
}
