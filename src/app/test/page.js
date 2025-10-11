'use client';

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleManageSubscription = async () => {
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;

      // Ask for email if logged out
      const email = user?.email || prompt("Enter the email you used for checkout:");

      const res = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      // ✅ Redirect to Stripe Billing Portal
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-6">Manage Subscription Test</h1>
      <button
        onClick={handleManageSubscription}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg disabled:bg-blue-400 flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2" /> Redirecting...
          </>
        ) : (
          "Open Stripe Portal"
        )}
      </button>

      {error && <p className="text-red-400 mt-6 font-medium">{error}</p>}
    </div>
  );
}
