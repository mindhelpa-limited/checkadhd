'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile, getAuth } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);

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
        const data = docSnap.data();
        setUserData(data);
        setDisplayName(data.displayName || currentUser.displayName || "");
      } else {
        setDisplayName(currentUser.displayName || "");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setMessage("");

    try {
      await updateProfile(user, { displayName });
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { displayName }, { merge: true });
      setMessage("✅ Profile updated successfully!");
      setUserData((prev) => ({ ...(prev || {}), displayName }));
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ Failed to update profile. Please try again.");
    }
  };

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
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = await res.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        console.error("Non-JSON response from /api/manage-subscription:\n", raw);
        throw new Error("Server returned HTML instead of JSON. Check API route & auth.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Could not open billing portal.");
      }

      window.location.href = data.url;
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      setIsManagingSubscription(false);
    }
  };

  return (
    <div className="relative min-h-screen p-6 md:p-10 bg-[#F3F4F6] text-[#111827] overflow-hidden font-sans">
      {/* Subtle background blobs */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-24 -left-20 w-80 h-80 bg-[#3B82F6] rounded-full blur-3xl opacity-10" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-[#14B8A6] rounded-full blur-3xl opacity-10" />
      </div>

      <div className="relative max-w-4xl mx-auto py-4">
        <div className="flex items-center gap-3 mb-2">
          <Cog6ToothIcon className="h-8 w-8 text-[#3B82F6]" />
          <h1 className="text-3xl md:text-4xl font-bold">Your Profile</h1>
        </div>
        <p className="text-[#4B5563] mb-8">
          Manage your account details and subscription.
        </p>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_8px_30px_rgba(2,6,23,0.06)] p-6 md:p-8 mb-8"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-6">Account Details</h2>

          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-2 p-4 rounded-xl mb-5 text-sm font-medium 
                ${message.startsWith('✅')
                  ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                  : 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                }`}
            >
              {message.startsWith('✅') ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <XCircleIcon className="h-5 w-5" />
              )}
              <p>{message.substring(3).trim()}</p>
            </motion.div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-[#374151] mb-2">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-3.5 bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#374151] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={userData?.email || user?.email || ""}
                readOnly
                className="w-full p-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#6B7280] cursor-not-allowed"
              />
            </div>

            <div className="pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold
                                bg-[#3B82F6] text-white shadow-sm hover:bg-[#336fce] focus:outline-none
                                focus:ring-4 focus:ring-[#3B82F6]/25"
              >
                Save Changes
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_8px_30px_rgba(2,6,23,0.06)] p-6 md:p-8"
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-6 flex items-center">
            <CreditCardIcon className="h-6 w-6 mr-2 text-[#14B8A6]" />
            Subscription
          </h2>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-[#6B7280]">Your current plan:</p>
              <p className="text-2xl font-bold text-[#111827] capitalize">
                {userData?.tier || 'Free'}
              </p>
            </div>

            <motion.button
              onClick={handleManageSubscription}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isManagingSubscription || userData?.tier !== 'premium'}
              className={`inline-flex items-center justify-center px-5 py-3 rounded-xl font-semibold
                               focus:outline-none focus:ring-4
                               ${isManagingSubscription || userData?.tier !== 'premium'
                  ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                  : 'bg-[#14B8A6] text-white hover:bg-[#129a8e] focus:ring-[#14B8A6]/25'
                }`}
            >
              {isManagingSubscription ? 'Redirecting...' : 'Manage Subscription'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}