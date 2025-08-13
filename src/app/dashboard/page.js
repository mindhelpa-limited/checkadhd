"use client";
import { auth, db } from "@/lib/firebase";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  SparklesIcon,
  TrophyIcon,
  UserCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  CalendarDaysIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"; // Changed to outline icons for a cleaner look

// Component for the animated score ring
const ScoreRing = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-[#2c2c2c]"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
        <circle
          className="text-blue-400 transition-all duration-1000 ease-in-out"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
      </svg>
      <span className="absolute text-3xl font-bold text-white">{score}</span>
    </div>
  );
};

// Modal component for the retake reminder
const RetakeTestModal = ({ timeLeft, onClose, onViewResults, playClickSound }) => (
  <div className="fixed inset-0 z-50 bg-[#0A0A0A] bg-opacity-80 flex items-center justify-center p-4">
    <div className="relative bg-[#1A1A1A]/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-[#2c2c2c] max-w-sm w-full animate-fade-in">
      <button
        onClick={() => { playClickSound(); onClose(); }}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <div className="text-center">
        <ClockIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          Retake Not Yet Available
        </h3>
        <p className="text-gray-400 mb-6">
          You must wait 14 days between tests to ensure accurate results.
        </p>
        <div className="bg-[#1A1A1A] p-4 rounded-xl mb-4">
          <p className="text-gray-400">Time remaining until retake:</p>
          <strong className="text-2xl text-white font-bold block mt-1">
            {timeLeft}
          </strong>
        </div>
        <button
          onClick={() => { playClickSound(); onViewResults(); }}
          className="w-full px-8 py-3 text-sm font-semibold text-white rounded-2xl bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          View Current Result
        </button>
      </div>
    </div>
  </div>
);

const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center z-50">
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
  const [retakeAvailable, setRetakeAvailable] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const audioRef = useRef(null);

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

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
        const testTaken = !!data.lastTest;
        setHasTakenTest(testTaken);

        if (data.score !== undefined && data.score !== null) {
          const score = calculateScoreOutOf100(data.score);
          setScoreOutOf100(score);
        }

        if (testTaken) {
          const lastTestDate = data.lastTest.toDate();
          const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;
          const retakeDate = new Date(lastTestDate.getTime() + twoWeeksInMs);

          const updateTimer = () => {
            const now = new Date();
            const difference = retakeDate.getTime() - now.getTime();

            if (difference > 0) {
              const days = Math.floor(difference / (1000 * 60 * 60 * 24));
              const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
              setTimeLeft(`${days}d ${hours}h ${minutes}m`);
              setRetakeAvailable(false);
            } else {
              setTimeLeft("Now!");
              setRetakeAvailable(true);
            }
          };

          const timerId = setInterval(updateTimer, 60000);
          updateTimer();
          
          setLoading(false);
          return () => clearInterval(timerId);
        }
        setLoading(false);
      } else {
        router.replace("/pricing");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleTestButtonClick = () => {
    playClickSound();
    if (retakeAvailable) {
      router.push("/dashboard/adhd-test");
    } else {
      setShowModal(true);
    }
  };

  const handleViewResultsClick = () => {
    playClickSound();
    router.push("/dashboard/adhd-test/report");
    setShowModal(false);
  };

  if (loading) {
    return <FullScreenLoader message={loadingMessage} />;
  }

  return (
    <main className="relative min-h-screen p-6 md:p-10 text-gray-200 bg-[#0A0A0A] overflow-hidden">
      <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />

      {/* Subtle background glow effect for a premium feel */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob-delay" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 leading-tight">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-400 text-base md:text-lg mt-2 mb-8 md:mb-12">
          Access your results and account details below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Card for Premium Account Info with Glassmorphism */}
          <div className="bg-[#1A1A1A]/70 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl border border-[#2c2c2c] md:col-span-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center text-gray-200">
              <SparklesIcon className="h-6 w-6 md:h-8 md:w-8 mr-3 flex-shrink-0 text-blue-400" />
              Your Premium Account
            </h2>
            {userData && (
              <ul className="space-y-4 md:space-y-6">
                <li className="flex items-center p-4 bg-[#1A1A1A] rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:bg-[#2c2c2c] hover:shadow-lg">
                  <UserCircleIcon className="h-6 w-6 text-gray-400 mr-4 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Email:</strong>
                    <p className="text-gray-400">{userData.email}</p>
                  </div>
                </li>
                <li className="flex items-center p-4 bg-[#1A1A1A] rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:bg-[#2c2c2c] hover:shadow-lg">
                  <TrophyIcon className="h-6 w-6 text-gray-400 mr-4 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Score:</strong>
                    <p className="text-gray-400">
                      {scoreOutOf100 !== null ? `${scoreOutOf100} / 100` : "N/A"}
                    </p>
                  </div>
                </li>
                <li className="flex items-center p-4 bg-[#1A1A1A] rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:bg-[#2c2c2c] hover:shadow-lg">
                  <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-gray-400 mr-4 flex-shrink-0" />
                  <div>
                    <strong className="text-white">ADHD Status:</strong>
                    <p className="font-semibold text-blue-400">
                      {userData.score !== undefined && userData.score !== null ? (
                        getAdhdStatus(scoreOutOf100)
                      ) : (
                        "Not available yet"
                      )}
                    </p>
                  </div>
                </li>
                <li className="flex items-center p-4 bg-[#1A1A1A] rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:bg-[#2c2c2c] hover:shadow-lg">
                  <CalendarDaysIcon className="h-6 w-6 text-gray-400 mr-4 flex-shrink-0" />
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
          </div>
          
          {/* Card for Test Actions with Glassmorphism */}
          <div className="bg-[#1A1A1A]/70 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl border border-[#2c2c2c] flex flex-col justify-between transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold mb-4 text-white text-center">Ready for your test?</h3>
              <p className="text-gray-400 mb-6 text-sm md:text-base text-center">
                Take the ADHD test to get an up-to-date assessment.
              </p>
              {/* Animated Score Visualization */}
              {hasTakenTest && scoreOutOf100 !== null && (
                <div className="mb-6">
                  <ScoreRing score={scoreOutOf100} />
                </div>
              )}
            </div>
            <div>
              <button
                onClick={handleTestButtonClick}
                className={`w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-opacity-50
                  ${retakeAvailable
                    ? "bg-blue-500 hover:shadow-xl hover:-translate-y-1 active:scale-95 focus:ring-blue-500"
                    : "bg-[#2c2c2c] text-gray-400 cursor-pointer"
                  }`}
              >
                {hasTakenTest ? "Retake the Test" : "Take the ADHD Test"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <RetakeTestModal
          timeLeft={timeLeft}
          onClose={() => { playClickSound(); setShowModal(false); }}
          onViewResults={handleViewResultsClick}
          playClickSound={playClickSound}
        />
      )}

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes blob-delay {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(-30px, 50px) scale(1.1);
          }
          66% {
            transform: translate(20px, -20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 10s infinite ease-in-out;
        }
        .animate-blob-delay {
          animation: blob-delay 10s infinite ease-in-out;
        }
      `}</style>
    </main>
  );
}