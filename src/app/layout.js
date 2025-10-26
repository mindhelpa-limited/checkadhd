import "./globals.css";
import { headers } from "next/headers";
import Header from "../components/Header"; // 👈 correct relative path

export const dynamic = "force-static";

// ✅ Custom logo and metadata
export const metadata = {
  title: "Mindhelpa",
  icons: {
    icon: "/logo3.png", // 👈 your logo from /public/logo3.png
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header /> {/* 👈 Header now shows on all pages */}
        {children}
      </body>
    </html>
  );
}
