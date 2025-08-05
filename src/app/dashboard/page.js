// /src/app/dashboard/page.jsx

"use client";
import { auth, db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [hasTakenTest, setHasTakenTest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
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
        setHasTakenTest(!!data.lastTest); 
        setLoading(false);
      } else {
        router.replace("/pricing");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleTestButtonClick = () => {
    router.push("/dashboard/adhd-test");
  };

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
            <li>
              <strong>Last Test:</strong>{" "}
              {userData.lastTest 
                ? userData.lastTest.toDate().toLocaleDateString() 
                : "Not taken yet"}
            </li>
          </ul>
        )}
        <div className="mt-6">
          <button
            onClick={handleTestButtonClick}
            className="w-full sm:w-auto px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            {hasTakenTest ? "Retake the Test" : "Take the ADHD Test"}
          </button>
        </div>
      </div>
    </div>
  );
}