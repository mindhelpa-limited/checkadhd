"use client";

import { usePathname } from "next/navigation";
import Head from "next/head";
import Header from "../components/Header";
import "./globals.css";
import { SEO_CONFIG } from "../seoConfig"; // ✅ Import your central metadata file

export default function Layout({ children }) {
  const pathname = usePathname();
  const isDashboardPage = pathname.startsWith("/dashboard");

  // Pick metadata based on current route (fallback to home)
  const meta = SEO_CONFIG[pathname] || SEO_CONFIG["/"];

  return (
    <html lang="en">
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta
          property="og:image"
          content={meta.image || "https://mindhelpa.com/images/og/default.jpg"}
        />
        <meta property="og:url" content={`https://mindhelpa.com${pathname}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta
          name="twitter:image"
          content={meta.image || "https://mindhelpa.com/images/og/default.jpg"}
        />
      </Head>

      <body>
        {!isDashboardPage && <Header />}
        <main>{children}</main>
      </body>
    </html>
  );
}
