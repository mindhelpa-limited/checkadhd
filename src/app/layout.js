// ====================================================================
// ✅ 1. Server Metadata + Global Setup
// ====================================================================
import "./globals.css";
import { SEO_CONFIG } from "./seoConfig";
import { headers } from "next/headers";
import Header from "./components/Header";
import { usePathname } from "next/navigation";

export const dynamic = "force-static"; // Ensures OG metadata renders server-side

// ====================================================================
// ✅ 2. Metadata Generation (Server-side)
// ====================================================================
export async function generateMetadata() {
  const headersList = headers();
  const referer = headersList.get("referer") || "";
  let path = "/";

  try {
    const url = new URL(referer);
    path = url.pathname || "/";
  } catch {
    path = "/";
  }

  const meta = SEO_CONFIG[path] || {
    title: "Mindhelpa – Your Path to Calm & Clarity",
    description:
      "Discover psychiatrist-led coaching, ADHD assessments, and daily recovery tools that help you find balance and focus.",
    image: "https://mindhelpa.com/images/og/default.jpg",
  };

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://mindhelpa.com${path}`,
      siteName: "Mindhelpa",
      type: "website",
      images: [{ url: meta.image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [meta.image],
    },
  };
}

// ====================================================================
// ✅ 3. Client Wrapper for Conditional Header
// ====================================================================
"use client";

function ClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith("/dashboard");

  return (
    <>
      {!isDashboardPage && <Header />}
      <main>{children}</main>
    </>
  );
}

// ====================================================================
// ✅ 4. Root Layout (Server + Client Combined)
// ====================================================================
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
