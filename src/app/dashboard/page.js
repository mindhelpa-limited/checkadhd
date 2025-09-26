'use client';
import { auth, db } from "@/lib/firebase";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import {
  ChatBubbleBottomCenterTextIcon,
  CalendarDaysIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion } from 'framer-motion';

// --- Small UI components (visual-only tweaks, no logic) ---

const ScoreRing = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  // Adjusted for Dark Mode: Base color is a dark gray, progress bar is a light blue
  const offset = circumference - (Number(score) / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90 animate-spin-slow">
        <circle
          className="text-[#374151]" // Dark gray base ring
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="64"
          cy="64"
        />
        <circle
          className="text-[#60A5FA] transition-all duration-1000 ease-in-out" // Lighter blue progress
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

const RetakeTestModal = ({ timeLeft, onClose, onViewResults, playClickSound }) => (
  // Darker backdrop
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative p-8 rounded-3xl shadow-2xl border max-w-sm w-full"
      style={{
        borderColor: '#1F2937', // Dark border
        // Dark, glowing background for the modal
        backgroundImage: `
          radial-gradient(60% 40% at 20% 0%, rgba(59,130,246,0.15), transparent 60%),
          radial-gradient(50% 30% at 80% 10%, rgba(20,184,166,0.15), transparent 60%),
          linear-gradient(180deg, #1F2937 0%, #111827 100%)
        `
      }}
    >
      <button
        onClick={() => { playClickSound(); onClose(); }}
        className="absolute top-4 right-4 text-[#9CA3AF] hover:text-white transition-colors"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
      <div className="text-center">
        <ClockIcon className="h-16 w-16 text-[#60A5FA] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Retake Not Yet Available</h3>
        <p className="text-[#9CA3AF] mb-6">
          You must wait 14 days between tests to ensure accurate results.
        </p>
        <div className="rounded-xl mb-4 p-4 border" style={{ borderColor: '#374151', background: '#1F2937' }}>
          <p className="text-[#9CA3AF]">Time remaining until retake:</p>
          <strong className="text-2xl text-white font-bold block mt-1">
            {timeLeft}
          </strong>
        </div>
        <button
          onClick={() => { playClickSound(); onViewResults(); }}
          className="w-full px-8 py-3 text-sm font-semibold text-white rounded-2xl transition-colors"
          style={{
            background: 'linear-gradient(135deg, #FB923C, #F87171)', // Kept the warm button style
            boxShadow: '0 8px 20px rgba(248,113,113,0.35)'
          }}
        >
          View Current Result
        </button>
      </div>
    </motion.div>
  </div>
);

const FullScreenLoader = ({ message }) => (
  <div
    className="fixed inset-0 flex items-center justify-center z-50"
    style={{
      // Dark mode background for the loader
      backgroundImage: `
        radial-gradient(60% 40% at 20% 0%, rgba(59,130,246,0.15), transparent 60%),
        radial-gradient(50% 30% at 80% 12%, rgba(20,184,166,0.15), transparent 60%),
        radial-gradient(40% 30% at 50% 100%, rgba(167,139,250,0.15), transparent 60%),
        linear-gradient(to bottom, #030712, #111827 40%, #1F2937 100%)
      `
    }}
  >
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#60A5FA]"></div>
    <p className="ml-4 text-[#9CA3AF]">{message}</p>
  </div>
);

const getAdhdStatus = (score) => {
  const s = Number(score) || 0;
  if (s >= 70) return "High Likelihood";
  if (s >= 40) return "Moderate Likelihood";
  return "Low Likelihood";
};

// --- Dashboard Component (styling only) ---

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [latestId, setLatestId] = useState(null);
  const [scoreOutOf100, setScoreOutOf100] = useState(null);
  const [riskLevelText, setRiskLevelText] = useState("");
  const [levelLabel, setLevelLabel] = useState("");
  const [lastTestDate, setLastTestDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Verifying access...");
  const [hasTakenTest, setHasTakenTest] = useState(false);
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
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setLoadingMessage("Checking your subscription...");
      const userDocRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        router.replace("/pricing");
        return;
      }

      const data = docSnap.data();
      if (data?.tier !== "premium") {
        router.replace("/pricing");
        return;
      }

      setUserData({ tier: data.tier }); 
      setLoadingMessage("Loading your latest result...");

      const colRef = collection(db, "users", currentUser.uid, "results");
      const q = query(colRef, orderBy("takenAt", "desc"), limit(1));
      const unsubLatest = onSnapshot(
        q,
        (snap) => {
          const doc0 = snap.docs[0];
          if (!doc0) {
            setHasTakenTest(false);
            setLatestId(null);
            setScoreOutOf100(null);
            setRiskLevelText("");
            setLevelLabel("");
            setLastTestDate(null);
            setRetakeAvailable(true);
            setLoading(false);
            return;
          }

          const d = doc0.data();
          const takenAt =
            d?.takenAt?.toDate?.() ??
            (d?.takenAt ? new Date(d.takenAt) : null);

          setHasTakenTest(true);
          setLatestId(doc0.id);
          setScoreOutOf100(d?.scorePercentage ?? null);
          setRiskLevelText(d?.riskLevelText ?? "");
          setLevelLabel(d?.level ?? "");
          setLastTestDate(takenAt || null);
          setLoading(false);

          setRetakeAvailable(true);
        },
        (err) => {
          console.error("Latest result subscription error:", err);
          setHasTakenTest(false);
          setLatestId(null);
          setScoreOutOf100(null);
          setRiskLevelText("");
          setLevelLabel("");
          setLastTestDate(null);
          setRetakeAvailable(true);
          setLoading(false);
        }
      );
      return () => unsubLatest();
    });
    return () => unsub();
  }, [router]);

  const handleTestButtonClick = () => {
    playClickSound();
    router.push("/dashboard/adhd-test");
  };

  // FIX: Use window.location.href for absolute, external URL
  const handleViewResultsClick = () => {
    playClickSound();
    window.location.href = "https://mindhelpa.com/dashboard/adhd-history"; 
  };

  if (loading) {
    return <FullScreenLoader message={loadingMessage} />;
  }

  return (
    <main
      className="relative min-h-screen p-6 md:p-10 overflow-x-hidden font-sans" 
      style={{
        color: '#D1D5DB', // Light gray text for dark mode
        // Dark, rich background gradient with soft glows
        backgroundImage: `
          radial-gradient(60% 40% at 20% 0%, rgba(59,130,246,0.15), transparent 60%),
          radial-gradient(50% 30% at 80% 12%, rgba(20,184,166,0.15), transparent 60%),
          radial-gradient(40% 30% at 50% 100%, rgba(167,139,250,0.15), transparent 60%),
          linear-gradient(to bottom, #030712, #111827 40%, #1F2937 100%)
        `
      }}
    >
      <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />

      {/* Subtle ambient glows (adjusted opacity for dark mode) */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full filter blur-3xl opacity-30 animate-blob"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.30), transparent 60%)' }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full filter blur-3xl opacity-25 animate-blob-delay"
          style={{ background: 'radial-gradient(circle at 70% 70%, rgba(167,139,250,0.30), transparent 60%)' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Dashboard Info Card (Slot 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{
              scale: 1.02,
              // Dark mode shadow effect
              boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 10px rgba(59,130,246,0.15)", 
              rotate: 0.2,
            }}
            className="group relative overflow-hidden p-6 md:p-8 rounded-3xl border md:col-span-2 order-2 md:order-1 transition-all duration-300" 
            style={{
              borderColor: '#374151', // Dark border
              // Dark card background with subtle shine
              backgroundImage: `
                radial-gradient(35% 60% at 15% 0%, rgba(59,130,246,0.1), transparent 70%),
                radial-gradient(30% 50% at 85% 10%, rgba(20,184,166,0.1), transparent 70%),
                linear-gradient(160deg, #1F2937, #111827 100%)
              `,
              boxShadow: 'inset 0 0 1px rgba(255,255,255,0.1)'
            }}
          >
            <div className="absolute inset-0 opacity-15 group-hover:opacity-30 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.15), rgba(167,139,250,0.15))' }} />

            <div className="mb-6"></div> 

            {userData && (
              <ul className="space-y-4 md:space-y-6">
                
                {/* ADHD Status Item */}
                <motion.li
                  whileHover={{ scale: 1.02, backgroundColor: '#111827' }} // Darker hover state
                  className="flex items-center p-4 rounded-xl border transition-all duration-300"
                  style={{ borderColor: '#374151', background: '#1F2937' }} // Dark item background
                >
                  <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-[#A78BFA] mr-4 flex-shrink-0" />
                  <div>
                    <strong className="text-white">ADHD Status:</strong>
                    <p className="font-semibold text-[#60A5FA]">
                      {hasTakenTest && scoreOutOf100 != null ? getAdhdStatus(scoreOutOf100) : "Not available yet"}
                    </p>
                    {hasTakenTest && riskLevelText && (
                      <p className="text-xs text-[#9CA3AF] mt-1">{levelLabel} • {riskLevelText}</p>
                    )}
                  </div>
                </motion.li>

                {/* View Results Item (Clickable) */}
                <motion.li
                  onClick={handleViewResultsClick}
                  whileHover={{ scale: 1.02, backgroundColor: '#111827', cursor: 'pointer' }} // Darker hover state
                  className="flex items-center p-4 rounded-xl border transition-all duration-300 cursor-pointer"
                  style={{ borderColor: '#374151', background: '#1F2937' }} // Dark item background
                >
                  <CalendarDaysIcon className="h-6 w-6 text-[#FB923C] mr-4 flex-shrink-0" />
                  <div>
                    <strong className="text-white">View Results:</strong>
                    <p className="text-[#9CA3AF]">
                      {hasTakenTest && lastTestDate
                        ? `Last test taken: ${lastTestDate.toLocaleDateString()}`
                        : "No test history yet"}
                    </p>
                  </div>
                </motion.li>
              </ul>
            )}
          </motion.div>


          {/* Actions card (Slot 1) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{
              scale: 1.02,
              // Dark mode shadow effect
              boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 10px rgba(248,113,113,0.15)",
              rotate: -0.2,
            }}
            className="relative overflow-hidden p-6 md:p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 order-1 md:order-2" 
            style={{
              borderColor: '#374151', // Dark border
              // Dark card background with subtle shine
              backgroundImage: `
                radial-gradient(35% 60% at 15% 0%, rgba(59,130,246,0.1), transparent 70%),
                radial-gradient(30% 50% at 85% 10%, rgba(20,184,166,0.1), transparent 70%),
                linear-gradient(160deg, #1F2937, #111827 100%)
              `,
              boxShadow: 'inset 0 0 1px rgba(255,255,255,0.1)'
            }}
          >
            <div className="absolute inset-0 opacity-20 transition-opacity duration-300"
                style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.15), rgba(167,139,250,0.15))' }} />
            
            <div className="flex flex-col items-center relative z-10">
              <h3 className="text-xl font-bold mb-4 text-white text-center">
                Ready for your test?
              </h3>
              
              {hasTakenTest && scoreOutOf100 != null && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.3 }}
                  className="mb-4"
                >
                  <ScoreRing score={scoreOutOf100} />
                </motion.div>
              )}

              {/* Last Test Date displayed before the button */}
              {hasTakenTest && lastTestDate && (
                <div className="text-center mb-6 p-3 bg-white/10 rounded-lg border border-gray-700 w-full">
                  <p className="text-[#9CA3AF] text-sm">Last Test Taken:</p>
                  <strong className="text-white text-md font-semibold block">
                    {lastTestDate.toLocaleDateString()}
                  </strong>
                </div>
              )}

              <p className="text-[#9CA3AF] mb-6 text-sm md:text-base text-center">
                Take the ADHD test to get an up-to-date assessment.
              </p>
            </div>

            <div className="relative z-10">
              <motion.button
                onClick={handleTestButtonClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-opacity-40 text-white"
                style={{
                  // Kept the warm button style for contrast
                  background: 'linear-gradient(135deg, #FB923C, #F87171)',
                  boxShadow: '0 10px 28px rgba(248,113,113,0.55)'
                }}
              >
                {hasTakenTest ? "Retake the Test" : "Take the ADHD Test"}
              </motion.button>
            </div>
          </motion.div>
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap');

        /* Set the default text color for the entire body to white/light-gray */
        body { 
          font-family: 'Inter', sans-serif; 
          color: #D1D5DB; 
          background: #030712;
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.06); }
          66% { transform: translate(-20px, 20px) scale(0.96); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes blob-delay {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-30px, 50px) scale(1.06); }
          66% { transform: translate(20px, -20px) scale(0.96); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 18s infinite ease-in-out; }
        .animate-blob-delay { animation: blob-delay 18s infinite ease-in-out; }

        @keyframes spin-slow {
          from { transform: rotate(270deg); }
          to { transform: rotate(630deg); }
        }

        @keyframes shine {
          0%, 100% { color: #34D399; filter: drop-shadow(0 0 5px rgba(52,211,153,0.5)); }
          50% { color: #FCD34D; filter: drop-shadow(0 0 10px rgba(252,211,77,0.7)); }
        }
        .animate-shine { animation: shine 3s infinite ease-in-out; }
      `}</style>
    </main>
  );
}