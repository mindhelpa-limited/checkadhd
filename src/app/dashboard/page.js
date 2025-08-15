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
    SparklesIcon,
    TrophyIcon,
    UserCircleIcon,
    ChatBubbleBottomCenterTextIcon,
    CalendarDaysIcon,
    ClockIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion } from 'framer-motion';

// --- Small UI components (unchanged) ---

const ScoreRing = ({ score }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Number(score) / 100) * circumference;

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

const RetakeTestModal = ({ timeLeft, onClose, onViewResults, playClickSound }) => (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] bg-opacity-80 flex items-center justify-center p-4">
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative bg-[#1A1A1A]/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-[#2c2c2c] max-w-sm w-full animate-fade-in"
        >
            <button
                onClick={() => { playClickSound(); onClose(); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
                <XMarkIcon className="h-6 w-6" />
            </button>
            <div className="text-center">
                <ClockIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Retake Not Yet Available</h3>
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
        </motion.div>
    </div>
);

const FullScreenLoader = ({ message }) => (
    <div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-200">{message}</p>
    </div>
);

const getAdhdStatus = (score) => {
    const s = Number(score) || 0;
    if (s >= 70) return "High Likelihood";
    if (s >= 40) return "Moderate Likelihood";
    return "Low Likelihood";
};

// --- Dashboard Component (modified for styling) ---

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
        // ... (existing logic, no changes)
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

            setUserData({ email: data.email, tier: data.tier });
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

                    if (takenAt) {
                        const retakeDate = new Date(takenAt.getTime() + 14 * 24 * 60 * 60 * 1000);
                        const updateTimer = () => {
                            const now = new Date().getTime();
                            const diff = retakeDate.getTime() - now;
                            if (diff > 0) {
                                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                setTimeLeft(`${days}d ${hours}h ${minutes}m`);
                                setRetakeAvailable(false);
                            } else {
                                setTimeLeft("Now!");
                                setRetakeAvailable(true);
                            }
                        };
                        updateTimer();
                        const timerId = setInterval(updateTimer, 60_000);
                        return () => clearInterval(timerId);
                    } else {
                        setRetakeAvailable(true);
                        setTimeLeft("");
                    }
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
        if (retakeAvailable) {
            router.push("/dashboard/adhd-test");
        } else {
            setShowModal(true);
        }
    };

    const handleViewResultsClick = () => {
        playClickSound();
        router.push("/dashboard/adhd-history");
        setShowModal(false);
    };

    if (loading) {
        return <FullScreenLoader message={loadingMessage} />;
    }

    return (
        <main className="relative min-h-screen p-6 md:p-10 text-gray-200 bg-[#0A0A0A] overflow-hidden font-sans">
            <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />

            {/* Pulsing background effect */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob" />
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob-delay" />
            </div>

            <div className="relative max-w-6xl mx-auto z-10">
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 leading-tight">
                    Welcome to Your Dashboard
                </h1>
                <p className="text-gray-400 text-base md:text-lg mt-2 mb-8 md:mb-12">
                    Access your results and account details below.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* Premium Account card (Blue-Purple) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.2)",
                            rotate: 0.5,
                        }}
                        className="group relative overflow-hidden p-6 md:p-8 rounded-3xl shadow-2xl border border-[#2c2c2c] md:col-span-2 transition-all duration-300 transform hover:rotate-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                        <div className="absolute inset-0.5 rounded-[calc(1.5rem+0.5px)] bg-black opacity-60 backdrop-blur-md"></div>
                        <div className="relative z-10">
                            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center text-gray-200">
                                <SparklesIcon className="h-6 w-6 md:h-8 md:w-8 mr-3 flex-shrink-0 text-yellow-400 drop-shadow-[0_0_5px_rgba(252,211,77,0.5)]" />
                                Your Premium Account
                            </h2>

                            {userData && (
                                <ul className="space-y-4 md:space-y-6">
                                    <motion.li
                                        whileHover={{ scale: 1.02, backgroundColor: '#2c2c2c' }}
                                        className="flex items-center p-4 rounded-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-blue-900 to-transparent"
                                    >
                                        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                        <UserCircleIcon className="h-6 w-6 text-blue-400 mr-4 flex-shrink-0 relative z-10" />
                                        <div className="relative z-10">
                                            <strong className="text-white">Email:</strong>
                                            <p className="text-gray-400">{userData.email}</p>
                                        </div>
                                    </motion.li>

                                    <motion.li
                                        whileHover={{ scale: 1.02, backgroundColor: '#2c2c2c' }}
                                        className="flex items-center p-4 rounded-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-green-900 to-transparent"
                                    >
                                        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                        <TrophyIcon className="h-6 w-6 text-green-400 mr-4 flex-shrink-0 relative z-10" />
                                        <div className="relative z-10">
                                            <strong className="text-white">Score:</strong>
                                            <p className="text-gray-400">
                                                {hasTakenTest && scoreOutOf100 != null ? `${scoreOutOf100} / 100` : "N/A"}
                                            </p>
                                        </div>
                                    </motion.li>

                                    <motion.li
                                        whileHover={{ scale: 1.02, backgroundColor: '#2c2c2c' }}
                                        className="flex items-center p-4 rounded-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-purple-900 to-transparent"
                                    >
                                        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                        <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-purple-400 mr-4 flex-shrink-0 relative z-10" />
                                        <div className="relative z-10">
                                            <strong className="text-white">ADHD Status:</strong>
                                            <p className="font-semibold text-blue-400">
                                                {hasTakenTest && scoreOutOf100 != null ? getAdhdStatus(scoreOutOf100) : "Not available yet"}
                                            </p>
                                            {hasTakenTest && riskLevelText && (
                                                <p className="text-xs text-gray-400 mt-1">{levelLabel} • {riskLevelText}</p>
                                            )}
                                        </div>
                                    </motion.li>

                                    <motion.li
                                        whileHover={{ scale: 1.02, backgroundColor: '#2c2c2c' }}
                                        className="flex items-center p-4 rounded-xl transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-orange-900 to-transparent"
                                    >
                                        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                        <CalendarDaysIcon className="h-6 w-6 text-orange-400 mr-4 flex-shrink-0 relative z-10" />
                                        <div className="relative z-10">
                                            <strong className="text-white">Last Test:</strong>
                                            <p className="text-gray-400">
                                                {hasTakenTest && lastTestDate
                                                    ? lastTestDate.toLocaleDateString()
                                                    : "Not taken yet"}
                                            </p>
                                        </div>
                                    </motion.li>
                                </ul>
                            )}
                        </div>
                    </motion.div>

                    {/* Actions card (Green-Cyan) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.2)",
                            rotate: -0.5,
                        }}
                        className="group relative overflow-hidden p-6 md:p-8 rounded-3xl shadow-2xl border border-[#2c2c2c] flex flex-col justify-between transition-all duration-300 transform hover:-rotate-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-900 to-cyan-900 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                        <div className="absolute inset-0.5 rounded-[calc(1.5rem+0.5px)] bg-black opacity-60 backdrop-blur-md"></div>
                        <div className="flex flex-col items-center relative z-10">
                            <h3 className="text-xl font-bold mb-4 text-white text-center">
                                Ready for your test?
                            </h3>
                            <p className="text-gray-400 mb-6 text-sm md:text-base text-center">
                                Take the ADHD test to get an up-to-date assessment.
                            </p>

                            {hasTakenTest && scoreOutOf100 != null && (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.3 }}
                                    className="mb-6 animate-pulse-slow"
                                >
                                    <ScoreRing score={scoreOutOf100} />
                                </motion.div>
                            )}
                        </div>

                        <div className="relative z-10">
                            <motion.button
                                onClick={handleTestButtonClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl shadow-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-opacity-50
                                    ${retakeAvailable
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl hover:-translate-y-1 focus:ring-blue-500"
                                        : "bg-gray-700 text-gray-400 cursor-not-allowed"
                                    }`}
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
                
                body {
                    font-family: 'Inter', sans-serif;
                }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes blob-delay {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(-30px, 50px) scale(1.1); }
                    66% { transform: translate(20px, -20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 15s infinite ease-in-out; }
                .animate-blob-delay { animation: blob-delay 15s infinite ease-in-out; }

                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
            `}</style>
        </main>
    );
}