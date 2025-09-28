'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { CreditCardIcon } from "@heroicons/react/24/outline";

export default function TestPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      const userDocRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleManageSubscription = async () => {
    setIsManagingSubscription(true);
    setMessage("");
    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const token = await currentUser.getIdToken();

      const res = await fetch("/api/manage-subscription", {
        method: "POST",
        headers: { 
          // FIX: Changed to use backticks (`) for the template literal 
          Authorization: `Bearer ${token}`, 
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not open billing portal.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Manage subscription error:", error);
      setMessage(`❌ ${error.message}`);
      setIsManagingSubscription(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-500 font-semibold">Loading test page...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border rounded-2xl shadow-lg p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <CreditCardIcon className="h-6 w-6 mr-2 text-green-500" />
          Coaching Subscription Test
        </h2>

        {message && (
          <p className="mb-4 text-sm text-red-500">{message}</p>
        )}

        <div className="flex justify-between items-center">
          <p className="text-lg">Coaching Plan</p>
          {userData?.tier === "coaching" ? (
            <motion.button
              onClick={handleManageSubscription}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isManagingSubscription}
              className="px-5 py-2 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700"
            >
              {isManagingSubscription ? "Redirecting..." : "Manage Subscription"}
            </motion.button>
          ) : (
            <span className="text-gray-400">Nil</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}