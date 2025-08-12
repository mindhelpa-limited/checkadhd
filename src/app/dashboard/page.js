"use client";
import { auth, db } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  InboxIcon,
  CreditCardIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    <p className="ml-4 text-gray-200">{message}</p>
  </div>
);

const getAdhdStatus = (score) => {
  if (score >= 70) {
    return "High Likelihood";
  } else if (score >= 40) {
    return "Moderate Likelihood";
  } else {
    return "Low Likelihood";
  }
};

const calculateScoreOutOf100 = (score) => {
  const maxScore = 60;
  return ((score / maxScore) * 100).toFixed(0);
};

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Verifying access...");
  const [hasTakenTest, setHasTakenTest] = useState(false);
  const [scoreOutOf100, setScoreOutOf100] = useState(null);

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
        if (data.score !== undefined && data.score !== null) {
          const score = calculateScoreOutOf100(data.score);
          setScoreOutOf100(score);
        }
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
    <main className="bg-gray-900 min-h-screen p-8 text-gray-200">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-gray-400 mb-8">Access your results and account details below.</p>
        
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <CheckBadgeIcon className="h-6 w-6 text-green-400 mr-2" />
            Your Premium Account
          </h2>
          {userData && (
            <ul className="space-y-6">
              <li className="flex items-start">
                <InboxIcon className="h-6 w-6 text-blue-400 mr-4 mt-1" />
                <div>
                  <strong className="text-white">Email:</strong>
                  <p className="text-gray-400">{userData.email}</p>
                </div>
              </li>
              <li className="flex items-start">
                <AcademicCapIcon className="h-6 w-6 text-blue-400 mr-4 mt-1" />
                <div>
                  <strong className="text-white">Score:</strong>
                  <p className="text-gray-400">
                    {scoreOutOf100 !== null ? `${scoreOutOf100} / 100` : "N/A"}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CreditCardIcon className="h-6 w-6 text-blue-400 mr-4 mt-1" />
                <div>
                  <strong className="text-white">ADHD Status:</strong>
                  <p className="font-medium text-green-400">
                    {userData.score !== undefined && userData.score !== null ? (
                      getAdhdStatus(scoreOutOf100)
                    ) : (
                      "Not available yet"
                    )}
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <CalendarDaysIcon className="h-6 w-6 text-blue-400 mr-4 mt-1" />
                <div>
                  <strong className="text-white">Last Test:</strong>
                  <p className="text-gray-400">
                    {userData.lastTest
                      ? userData.lastTest.toDate().toLocaleDateString()
                      : "Not taken yet"}
                  </p>
                </div>
              </li>
            </ul>
          )}
          <div className="mt-10">
            <button
              onClick={handleTestButtonClick}
              className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500 transition-colors duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {hasTakenTest ? "Retake the Test" : "Take the ADHD Test"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}