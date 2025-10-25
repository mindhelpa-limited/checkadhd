import "./globals.css";
import { headers } from "next/headers";
import ClientLayout from "./ClientLayout";

export const dynamic = "force-static";

// ✅ Add this — tells Next.js to use your own logo instead of Vercel’s
export const metadata = {
  title: "Mindhelpa",
  icons: {
    icon: "/logo3.png", // 👈 uses your own logo in /public/logo.png
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
