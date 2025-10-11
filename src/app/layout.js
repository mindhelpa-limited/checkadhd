// /app/layout.server.js
import "./globals.css";
import { SEO_CONFIG } from "./seoConfig";
import { headers } from "next/headers";

export const dynamic = "force-static"; // ensures OG metadata renders server-side

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

export default function ServerLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
