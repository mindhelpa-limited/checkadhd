"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { fetchSignInMethodsForEmail } from "firebase/auth";

export default function AccountRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!sessionId) {
          router.replace("/pricing");
          return;
        }

        const res = await fetch(`/api/get-session-details?id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();

        if (!data?.email) {
          router.replace("/pricing");
          return;
        }

        // ✅ Case 1: User already logged in → go straight to dashboard
        if (auth.currentUser) {
          router.replace(`/dashboard/${data.product || ""}`);
          return;
        }

        // ✅ Case 2: Email exists → redirect to login
        const methods = await fetchSignInMethodsForEmail(auth, data.email);
        if (methods.length > 0) {
          router.replace(`/login?email=${encodeURIComponent(data.email)}&product=${data.product}`);
          return;
        }

        // ✅ Case 3: New email → redirect to signup
        router.replace(`/signup?session_id=${sessionId}`);

      } catch (err) {
        console.error("Redirect error:", err);
        router.replace("/pricing");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-white bg-[#0a122a]">
        <p>Processing your payment...</p>
      </div>
    );
  }

  return null;
}
