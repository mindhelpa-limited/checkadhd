"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Report from "./Report";
import { Download, CheckCircle, Loader2, Play, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
    doc,
    getDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    limit,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";

// ====================================================================
// CONSTANTS & HELPERS
// ====================================================================

const questions = [
    "Do you often have difficulty sustaining attention in tasks or play activities?",
    "Do you frequently make careless mistakes in schoolwork, work, or other activities?",
    "Do you often not seem to listen when spoken to directly?",
    "Do you often fail to follow through on instructions and finish schoolwork, chores, or duties in the workplace?",
    "Do you often have difficulty organizing tasks and activities?",
    "Do you often avoid, dislike, or are reluctant to engage in tasks that require sustained mental effort?",
    "Do you often lose things necessary for tasks or activities?",
    "Are you often easily distracted by external stimuli?",
    "Are you often forgetful in daily activities?",
    "Do you often fidget with or tap your hands or feet, or squirm in your seat?",
    "Do you often leave your seat in situations when remaining seated is expected?",
    "Do you often run or climb in situations where it is inappropriate?",
    "Are you often unable to play or engage in leisure activities quietly?",
    'Are you often "on the go," acting as if driven by a motor?',
    "Do you often talk excessively?",
    "Do you often blurt out answers before questions have been completed?",
    "Do you often have difficulty waiting your turn?",
    "Do you often interrupt or intrude on others?",
    "Do you have trouble staying focused during conversations?",
    "Are you easily distracted by your own thoughts or daydreams?",
    "Do you find it difficult to complete tasks that have multiple steps?",
    "Do you misplace personal items like keys, wallet, or phone frequently?",
    "Is it hard for you to prioritize what needs to be done?",
    "Do you often get bored with a task after only a few minutes?",
    "Do you feel a need to move around or fidget, even when you are supposed to be still?",
    "Do you find yourself interrupting people or finishing their sentences?",
    "Do you often act on impulse without thinking about the consequences?",
    "Is it difficult for you to wait in line or for your turn?",
    "Do you have trouble paying attention to details?",
    'Do you often seem to be "spacing out" during class or meetings?',
    "Is it hard for you to follow through on promises or commitments?",
    "Do you tend to be messy or disorganized?",
    "Do you find it hard to stick with a project once the initial excitement has worn off?",
    "Do you feel restless or on edge most of the time?",
    "Is it hard for you to listen to a full movie or show without getting distracted?",
    "Do you often lose track of time?",
    "Do you have a hard time managing your emotions?",
    "Do you tend to act impulsively in social situations?",
    "Is it hard for you to control your temper?",
    "Do you feel overwhelmed by too many tasks at once?",
    "Do you struggle with remembering appointments or deadlines?",
    "Do you often start new projects before finishing old ones?",
    "Do you have trouble staying motivated for long-term goals?",
    "Do you often feel like you have a 'short fuse'?",
    "Do you have a tendency to take risks without thinking?",
    "Is it hard for you to keep your personal space tidy?",
    "Do you often speak without thinking?",
    "Is it difficult for you to sit still for an extended period, like on a plane or in a long meeting?",
    "Do you often feel restless when you are supposed to be relaxing?",
    "Do you have trouble getting started on tasks you know you need to do?",
    "Do you often forget what you were just about to say?",
    "Do you struggle with managing your time effectively?",
    "Do you often feel like you are always rushing?",
    "Do you have difficulty following a schedule?",
    "Do you find it hard to organize your thoughts before speaking?",
    "Do you often find yourself doing several things at once without completing any of them?",
    "Do you have trouble staying on topic in a conversation?",
    "Do you often fidget with objects, such as a pen or a paper clip?",
    "Do you often get distracted by background noise?",
    "Do you feel a need for constant stimulation?",
    "Is it difficult for you to complete a book from start to finish?",
    "Do you often forget important dates?",
    "Do you find it hard to resist the urge to buy things on impulse?",
    "Do you often feel bored easily?",
    "Is it hard for you to keep your belongings in order?",
    "Do you often feel overwhelmed by details?",
    "Do you have difficulty working quietly?",
    "Do you often feel the need to move or tap your foot while seated?",
    "Is it hard for you to stay focused on a task that is not interesting?",
    "Do you often have difficulty waiting for your turn in group activities?",
    "Do you find it hard to manage your finances or pay bills on time?",
    "Do you frequently lose your train of thought?",
    "Do you have a hard time completing tasks that are difficult or tedious?",
];

const options = ["Never", "Rarely", "Sometimes", "Often", "Very Often"];

const milestoneMessages = [
    "Keep Going!",
    "Great Focus!",
    "You're Doing Great!",
    "Excellent Progress!",
    "Fantastic Effort!",
];

const ADHD_TEST_PROGRESS_KEY = "adhdTestProgress";

function riskFromPercent(scorePercentage) {
    if (scorePercentage >= 75)
        return {
            level: "High likelihood of ADHD traits",
            riskLevelText: "High Risk",
        };
    if (scorePercentage >= 40)
        return {
            level: "Moderate likelihood of ADHD traits",
            riskLevelText: "Moderate Risk",
        };
    return {
        level: "Low likelihood of ADHD traits",
        riskLevelText: "Low Risk",
    };
}

const getRetakeInfo = (lastDate, now = new Date()) => {
    if (!lastDate) return { allowed: true, timeLeftText: "" };
    const ms7d = 7 * 24 * 60 * 60 * 1000;
    const diff = lastDate.getTime() + ms7d - now.getTime();
    if (diff <= 0) return { allowed: true, timeLeftText: "" };
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes || (!days && !hours)) parts.push(`${minutes}m`);
    return { allowed: false, timeLeftText: parts.join(" ") };
};

// ====================================================================
// MAIN COMPONENT
// ====================================================================
export default function AdhdTestPage() {
    const router = useRouter();
    const [step, setStep] = useState("loading"); // loading, disclaimer, form, quiz, results, retakeWait
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState(
        () => new Array(questions.length).fill(null)
    );
    const [userInfo, setUserInfo] = useState({ name: "", sex: "", dob: "" });
    const [milestoneNotification, setMilestoneNotification] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [loadedProgress, setLoadedProgress] = useState(null);
    const audioRef = useRef(null);
    const stepRef = useRef(step);

    const [retakeAvailable, setRetakeAvailable] = useState(true);
    const [timeLeft, setTimeLeft] = useState("");
    const [lastTestDate, setLastTestDate] = useState(null);

    useEffect(() => {
        stepRef.current = step;
    }, [step]);

    // Apply global styles for the page
    useEffect(() => {
        document.body.style.backgroundColor = "#0A0A0A";
        document.documentElement.style.backgroundColor = "#0A0A0A";
        document.body.style.overflowX = "hidden";
        document.documentElement.style.overflowX = "hidden";
        document.body.style.width = "100vw";
        document.documentElement.style.width = "100vw";
        document.body.style.position = "relative";

        return () => {
            document.body.style.overflowX = "";
            document.documentElement.style.overflowX = "";
            document.body.style.backgroundColor = "";
            document.documentElement.style.backgroundColor = "";
            document.body.style.width = "";
            document.documentElement.style.width = "";
        };
    }, []);

    // Handle auth, retake checks, and progress loading
    useEffect(() => {
        const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.replace("/login");
                return;
            }

            const userDocRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists() || docSnap.data()?.tier !== "premium") {
                router.replace("/pricing-adhd-assessment");
                return;
            }

            const colRef = collection(db, "users", currentUser.uid, "results");
            const q = query(colRef, orderBy("takenAt", "desc"), limit(1));

            const unsubLatest = onSnapshot(
                q,
                (snap) => {
                    const doc0 = snap.docs[0];
                    let lastTakenDate = null;

                    if (doc0) {
                        const data = doc0.data();
                        if (data?.takenAt) {
                            if (typeof data.takenAt.toDate === "function") {
                                lastTakenDate = data.takenAt.toDate();
                            } else if (
                                typeof data.takenAt === "string" ||
                                typeof data.takenAt === "number"
                            ) {
                                lastTakenDate = new Date(data.takenAt);
                            }
                        }
                    }

                    setLastTestDate(lastTakenDate);
                    const { allowed, timeLeftText } =
                        getRetakeInfo(lastTakenDate);
                    setRetakeAvailable(allowed);
                    setTimeLeft(timeLeftText);

                    if (stepRef.current === "results") {
                        return;
                    }

                    if (!allowed) {
                        setStep("retakeWait");
                    } else {
                        try {
                            const savedProgress = localStorage.getItem(
                                ADHD_TEST_PROGRESS_KEY
                            );
                            if (savedProgress) {
                                const parsed = JSON.parse(savedProgress);
                                if (
                                    parsed &&
                                    typeof parsed.current === "number" &&
                                    Array.isArray(parsed.answers)
                                ) {
                                    setLoadedProgress(parsed);
                                    setStep("resumePrompt");
                                } else {
                                    localStorage.removeItem(
                                        ADHD_TEST_PROGRESS_KEY
                                    );
                                    setStep("disclaimer");
                                }
                            } else {
                                setStep("disclaimer");
                            }
                        } catch (error) {
                            console.error("Failed to load progress:", error);
                            localStorage.removeItem(ADHD_TEST_PROGRESS_KEY);
                            setStep("disclaimer");
                        }
                    }
                },
                (err) => {
                    console.error("Latest result subscription error:", err);
                    setStep("disclaimer");
                }
            );
            return () => unsubLatest();
        });

        return () => unsubAuth();
    }, [router]);

    // Save progress to localStorage during the quiz
    useEffect(() => {
        if (step === "quiz") {
            const progress = { current, answers, userInfo };
            localStorage.setItem(
                ADHD_TEST_PROGRESS_KEY,
                JSON.stringify(progress)
            );
        }
    }, [current, answers, userInfo, step]);

    // Save results to Firestore on completion
    useEffect(() => {
        if (step === "results") {
            (async () => {
                try {
                    const currentUser = auth.currentUser;
                    if (currentUser) {
                        const totalScore = answers.reduce(
                            (sum, a) => (a != null ? sum + a : sum),
                            0
                        );
                        const maxScore = questions.length * 4;
                        const scorePercentage = Math.round(
                            (totalScore / maxScore) * 100
                        );
                        const { level, riskLevelText } =
                            riskFromPercent(scorePercentage);

                        await addDoc(
                            collection(db, "users", currentUser.uid, "results"),
                            {
                                scorePercentage,
                                riskLevelText,
                                level,
                                takenAt: serverTimestamp(),
                                // ✅ ADDED THESE TWO LINES
                                userInfo: userInfo,
                                answers: answers,
                            }
                        );
                    }
                } catch (err) {
                    console.error("Error saving result:", err);
                }
            })();

            localStorage.removeItem(ADHD_TEST_PROGRESS_KEY);
            confetti({
                particleCount: 250,
                spread: 160,
                origin: { y: 0.3 },
                zIndex: 10001,
            });
        }
    }, [step, answers, userInfo]); // Added userInfo dependency

    const handleStart = () => {
        if (!userInfo.name || !userInfo.sex || !userInfo.dob) {
            alert("Please complete all fields.");
            return;
        }
        if (!retakeAvailable) {
            alert(`You can retake the assessment in ${timeLeft}.`);
            router.replace("/dashboard");
            return;
        }
        localStorage.removeItem(ADHD_TEST_PROGRESS_KEY);
        setAnswers(new Array(questions.length).fill(null));
        setCurrent(0);
        setStep("quiz");
    };

    const handleResume = () => {
        if (!retakeAvailable) {
            alert(`You can retake the assessment in ${timeLeft}.`);
            router.replace("/dashboard");
            return;
        }
        if (loadedProgress) {
            setAnswers(loadedProgress.answers);
            setCurrent(loadedProgress.current);
            setUserInfo(loadedProgress.userInfo);
            setStep("quiz");
        }
    };

    const handleStartOver = () => {
        localStorage.removeItem(ADHD_TEST_PROGRESS_KEY);
        setAnswers(new Array(questions.length).fill(null));
        setCurrent(0);
        setUserInfo({ name: "", sex: "", dob: "" });
        setStep("disclaimer");
    };

    const handleAnswer = (answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[current] = answerIndex;
        setAnswers(newAnswers);

        if ((current + 1) % 5 === 0 && current < questions.length - 1) {
            const message =
                milestoneMessages[
                    Math.floor(Math.random() * milestoneMessages.length)
                ];
            setMilestoneNotification(`🎉 ${message} 🎉`);
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                zIndex: 10001,
            });
            setTimeout(() => setMilestoneNotification(""), 3500);
        }

        setTimeout(() => {
            if (current < questions.length - 1) {
                setCurrent(current + 1);
            } else {
                setStep("results");
            }
        }, 300);
    };

    const handleGoBack = () => {
        if (current > 0) setCurrent(current - 1);
    };

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const html2pdfModule = (await import("html2pdf.js")).default;
            const element = document.getElementById("report-content");
            if (!element) return;
            await html2pdfModule()
                .from(element)
                .set({
                    margin: [10, 10, 10, 10],
                    filename: `ADHD_Assessment_Report_${(
                        userInfo.name || "User"
                    ).replace(/\s/g, "_")}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                })
                .save();
            confetti({
                particleCount: 200,
                spread: 180,
                origin: { y: 0.8 },
                zIndex: 10002,
            });
            setIsDownloading("success");
            setTimeout(() => setIsDownloading(false), 5000);
        } catch (e) {
            console.error(e);
            setIsDownloading(false);
        }
    };

    const layoutClass = ["disclaimer", "resumePrompt", "retakeWait"].includes(
        step
    )
        ? "flex items-center justify-center"
        : "block pb-24";

    return (
        <div
            className={`fixed inset-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 bg-[#0A0A0A] text-gray-200 ${layoutClass}`}
        >
            <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />

            {/* Animated Background */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob-delay" />
            </div>

            {/* Milestone Message */}
            {milestoneNotification && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[10001] bg-blue-500/80 backdrop-blur-sm text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-lg font-bold shadow-lg rounded-full animate-fade-in">
                    {milestoneNotification}
                </div>
            )}

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-lg md:max-w-2xl mx-auto">
                {/* Retake Wait Screen */}
                {step === "retakeWait" && (
                    <div className="bg-[#1A1A1A]/70 backdrop-blur-md p-8 md:p-10 rounded-3xl text-center shadow-2xl border border-[#2c2c2c] animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Assessment Locked
                        </h2>
                        <div className="p-6 md:p-8 bg-gray-900/50 rounded-2xl border border-gray-700 mb-8">
                            <p className="text-gray-400 text-lg leading-relaxed mb-4">
                                You've recently completed the assessment. To
                                ensure accurate results, you can retake it in:
                            </p>
                            <p className="text-4xl md:text-5xl font-bold text-blue-400 tracking-wider">
                                {timeLeft}
                            </p>
                        </div>
                        <a
                            href="/dashboard"
                            className="w-full inline-block px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-blue-500 hover:bg-blue-600"
                        >
                            Go to Dashboard
                        </a>
                    </div>
                )}

                {/* Resume Prompt Screen */}
                {step === "resumePrompt" && (
                    <div className="bg-[#1A1A1A]/70 backdrop-blur-md p-8 md:p-10 rounded-3xl text-center shadow-2xl border border-[#2c2c2c] animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Welcome Back!
                        </h2>
                        <div className="p-6 md:p-8 bg-gray-900/50 rounded-2xl border border-gray-700 mb-8">
                            <p className="text-gray-400 text-lg leading-relaxed">
                                We saved your progress from your last session.
                                Would you like to pick up where you left off?
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleResume}
                                className="w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-blue-500 hover:bg-blue-600"
                            >
                                <Play /> Resume
                            </button>
                            <button
                                onClick={handleStartOver}
                                className="w-full flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-gray-600 hover:bg-gray-700"
                            >
                                <RotateCcw /> Start Over
                            </button>
                        </div>
                    </div>
                )}

                {/* Disclaimer Screen */}
                {step === "disclaimer" && (
                    <div className="bg-[#1A1A1A]/70 backdrop-blur-md p-8 md:p-10 rounded-3xl text-center shadow-2xl border border-[#2c2c2c] animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            A Quick Note on Accuracy
                        </h2>
                        <div className="p-6 md:p-8 bg-gray-900/50 rounded-2xl border border-gray-700 mb-8">
                            <p className="text-gray-400 text-lg leading-relaxed">
                                This test is a tool to help you reflect on your
                                habits and tendencies. For a proper diagnosis,
                                please consult a qualified healthcare
                                professional.
                            </p>
                        </div>
                        <button
                            onClick={() => setStep("form")}
                            className="w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-blue-500 hover:bg-blue-600"
                        >
                            Let's Begin
                        </button>
                    </div>
                )}

                {/* User Info Form */}
                {step === "form" && (
                    <div className="bg-[#1A1A1A]/70 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-2xl border border-[#2c2c2c] animate-fade-in">
                        <div className="text-center text-5xl mb-4">🧠</div>
                        <h2 className="text-3xl font-bold text-white text-center mb-2">
                            Personal Information
                        </h2>
                        <p className="text-gray-400 text-center mb-8">
                            Please provide your details to personalize your
                            report.
                        </p>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-400 font-semibold mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={userInfo.name}
                                    onChange={(e) =>
                                        setUserInfo({
                                            ...userInfo,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold mb-2">
                                    Sex
                                </label>
                                <select
                                    value={userInfo.sex}
                                    onChange={(e) =>
                                        setUserInfo({
                                            ...userInfo,
                                            sex: e.target.value,
                                        })
                                    }
                                    className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                    <option value="Prefer not to say">
                                        Prefer not to say
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 font-semibold mb-2">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={userInfo.dob}
                                    onChange={(e) =>
                                        setUserInfo({
                                            ...userInfo,
                                            dob: e.target.value,
                                        })
                                    }
                                    className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-xl mt-8 text-sm text-center text-gray-500">
                            🔐 Your personal information is used only to
                            personalize your assessment report and is not stored
                            on our servers.
                        </div>
                        <button
                            onClick={handleStart}
                            className="mt-8 w-full px-8 py-4 text-lg font-semibold text-white rounded-2xl bg-blue-500 hover:bg-blue-600"
                        >
                            Begin ADHD Assessment
                        </button>
                    </div>
                )}

                {/* Quiz Interface */}
                {step === "quiz" && (
                    <div className="bg-[#1A1A1A]/70 p-8 md:p-10 rounded-3xl border border-[#2c2c2c] shadow-2xl animate-fade-in">
                        <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-6">
                            <div
                                className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-4 transition-all duration-500 ease-out"
                                style={{
                                    width: `${
                                        ((current + 1) / questions.length) *
                                        100
                                    }%`,
                                }}
                            >
                                <span className="text-white text-sm font-semibold">
                                    {Math.round(
                                        ((current + 1) / questions.length) *
                                            100
                                    )}
                                    %
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-center mb-6">
                            Question {current + 1} of {questions.length}
                        </p>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-8 text-center">
                            {questions[current]}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    className={`py-4 px-6 text-lg font-semibold rounded-2xl transition-all duration-200 ${
                                        answers[current] === idx
                                            ? "bg-blue-500 text-white shadow-lg"
                                            : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                                    }`}
                                    onClick={() => handleAnswer(idx)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-start">
                            <button
                                onClick={handleGoBack}
                                disabled={current === 0}
                                className={`px-6 py-3 font-semibold rounded-2xl transition-colors ${
                                    current === 0
                                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                                        : "bg-gray-600 hover:bg-gray-700 text-white"
                                }`}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {/* Results Screen */}
                {step === "results" && (
                    <div>
                        <Report userInfo={userInfo} answers={answers} />
                        <div className="mt-8 flex flex-col items-center">
                            <button
                                onClick={handleDownloadPDF}
                                disabled={isDownloading !== false}
                                className={`w-full max-w-xs px-8 py-4 font-semibold text-white rounded-2xl transition-colors flex items-center justify-center space-x-2 ${
                                    isDownloading === "success"
                                        ? "bg-green-500 hover:bg-green-600"
                                        : "bg-blue-500 hover:bg-blue-600"
                                }`}
                            >
                                {isDownloading === true && (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                )}
                                {isDownloading === "success" && (
                                    <CheckCircle className="h-6 w-6" />
                                )}
                                {isDownloading === false && (
                                    <Download className="h-6 w-6" />
                                )}
                                {isDownloading === true && (
                                    <span>Generating Report...</span>
                                )}
                                {isDownloading === "success" && (
                                    <span className="font-bold text-lg md:text-xl animate-pulse">
                                        DOWNLOADED to your device!
                                    </span>
                                )}
                                {isDownloading === false && (
                                    <span>Download Detailed Report (PDF)</span>
                                )}
                            </button>
                            <a
                                href="/dashboard/adhd-private"
                                className="mt-4 w-full max-w-xs px-8 py-4 font-semibold text-white text-center rounded-2xl bg-gray-600 hover:bg-gray-700"
                            >
                                Take A one-on-one test 👨🏻‍⚕️
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}