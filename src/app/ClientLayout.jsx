"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header"; // 👈 adjust this based on your actual folder

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardPage && <Header />}
      <main>{children}</main>
    </>
  );
}
