"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    <p className="ml-4 text-gray-700">{message}</p>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Verifying access...");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login"); // ✅ replace() prevents back-button returning to dashboard
        return;
      }

      setLoadingMessage("Checking your subscription...");
      const userDocRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        console.error("❌ No user document found.");
        router.replace("/pricing");
        return;
      }

      const data = docSnap.data();

      if (data.tier === "premium") {
        setUserData(data);
        setLoading(false);
      } else {
        router.replace("/pricing");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <FullScreenLoader message={loadingMessage} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Premium Account</h2>
        {userData && (
          <ul>
            <li className="mb-2"><strong>Email:</strong> {userData.email}</li>
            <li className="mb-2"><strong>Score:</strong> {userData.score || 0}</li>
            <li className="mb-2">
              <strong>Tier:</strong>{" "}
              <span className="capitalize font-medium text-green-600">
                {userData.tier}
              </span>
            </li>
            <li><strong>Last Test:</strong> {userData.lastTest || "Not taken yet"}</li>
          </ul>
        )}
      </div>
    </div>
  );
}
