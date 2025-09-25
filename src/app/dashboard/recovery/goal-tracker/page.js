"use client";

import { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
// Corrected import: FaCheckCircle -> FaCheck
import { FaFire, FaMedal, FaListCheck, FaChartLine, FaTrophy, FaCheck } from 'react-icons/fa6'; 

// --- Configuration and Helpers (Unchanged) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Ranks based on streak duration
const streakRanks = [
    { streak: 3, rank: "Captain" },
    { streak: 7, rank: "Major" },
    { streak: 30, rank: "Colonel" },
    { streak: 90, rank: "General" },
    { streak: 180, rank: "Brigadier-General" },
    { streak: 365, rank: "Field Marshall" }
];

// Helper function to get the current date as a simple string
const todayString = () => new Date().toISOString().split('T')[0];

// --- Components for Premium Design ---

// Progress Ring Component (Design Suggestion #13)
const ProgressRing = ({ progress }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background Circle */}
            <circle
                className="text-gray-700"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="60"
                cy="60"
            />
            {/* Progress Arc */}
            <circle
                className="text-emerald-400 transition-all duration-700 ease-out"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="60"
                cy="60"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(52, 211, 153, 0.7))' }} // Subtle glow
            />
            {/* Percentage Text */}
            <text
                x="60"
                y="60"
                className="text-3xl font-bold fill-white -rotate-270"
                dominantBaseline="middle"
                textAnchor="middle"
                transform="rotate(90 60 60)"
            >
                {Math.round(progress)}%
            </text>
        </svg>
    );
};

// Premium Tab Button Component
const TabButton = ({ name, activeTab, setActiveTab, icon: Icon, label }) => {
    const isActive = activeTab === name;

    // Premium styling for the segmented control slider effect
    const activeClasses = 'bg-blue-600 text-white shadow-xl shadow-blue-900/50';
    const inactiveClasses = 'text-gray-400 hover:text-white transition-colors duration-300';

    return (
        <button
            onClick={() => setActiveTab(name)}
            className={`flex-1 flex items-center justify-center p-3 rounded-xl font-semibold transition-all duration-300 ease-in-out relative z-10 ${
                isActive ? activeClasses : inactiveClasses
            }`}
        >
            <Icon className="text-xl mr-2" />
            <span className="text-sm">{label}</span>
        </button>
    );
};

// Input Component
const PremiumInput = ({ value, onChange, placeholder, accentColor }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-3 text-gray-100 bg-gray-800 rounded-lg border-b-2 border-gray-600 focus:outline-none focus:border-${accentColor}-400 transition-all duration-300 placeholder:text-gray-500`}
        />
    );
};

// --- Main App Component ---
export default function App() {
    const [dailyGoals, setDailyGoals] = useState([
        { text: 'Set your first daily goal', isDone: false },
        { text: 'Set your second daily goal', isDone: false },
        { text: 'Set your third daily goal', isDone: false }
    ]);
    const [weeklyGoals, setWeeklyGoals] = useState([
        { text: 'Set your first weekly goal', isDone: false },
        { text: 'Set your second weekly goal', isDone: false },
        { text: 'Set your third weekly goal', isDone: false }
    ]);
    const [streakCount, setStreakCount] = useState(0);
    const [rank, setRank] = useState("Cadet");
    const [lastCheckInDate, setLastCheckInDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('trackGoals'); 

    const dbRef = useRef(null);
    const authRef = useRef(null);
    const userIdRef = useRef(null);
    const notificationIntervalRef = useRef(null);
    const debounceTimeoutRef = useRef(null);

    // Get the rank based on the streak count
    const getRank = (currentStreak) => {
        let currentRank = "Cadet";
        for (const r of streakRanks) {
            if (currentStreak >= r.streak) {
                currentRank = r.rank;
            }
        }
        return currentRank;
    };
    
    // Firebase Initialization and Auth
    useEffect(() => {
        const initializeFirebase = async () => {
            try {
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);
                const db = getFirestore(app);
                dbRef.current = db;
                authRef.current = auth;

                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
                
                const unsub = onAuthStateChanged(auth, (user) => {
                    if (user) {
                        setUserId(user.uid);
                        userIdRef.current = user.uid;
                        setIsLoading(false);
                    } else {
                        setUserId(null);
                        userIdRef.current = null;
                        setIsLoading(false);
                    }
                });
                return () => unsub();
            } catch (error) {
                console.error("Firebase initialization or authentication failed:", error);
                setIsLoading(false);
            }
        };

        initializeFirebase();
    }, []);

    // Save goals to Firestore with a debounce
    const saveGoalsToFirestore = (data) => {
        if (!userIdRef.current) return;
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        setIsSaving(true);
        debounceTimeoutRef.current = setTimeout(async () => {
            const goalDocRef = doc(dbRef.current, `artifacts/${appId}/users/${userIdRef.current}/goalTracker/data`);
            try {
                await setDoc(goalDocRef, data);
            } catch (error) {
                console.error("Error writing document:", error);
            } finally {
                setIsSaving(false);
            }
        }, 500); // 500ms debounce
    };

    // Firestore Data Listener
    useEffect(() => {
        if (!userId) return;

        const goalDocRef = doc(dbRef.current, `artifacts/${appId}/users/${userId}/goalTracker/data`);
        const unsub = onSnapshot(goalDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setDailyGoals(data.dailyGoals || dailyGoals);
                setWeeklyGoals(data.weeklyGoals || weeklyGoals);
                setStreakCount(data.streakCount || 0);
                setRank(data.rank || "Cadet");
                setLastCheckInDate(data.lastCheckInDate || null);
            } else {
                // Initialize default goals if the document doesn't exist
                saveGoalsToFirestore({
                    dailyGoals,
                    weeklyGoals,
                    streakCount: 0,
                    rank: "Cadet",
                    lastCheckInDate: null
                });
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error getting document:", error);
            setIsLoading(false);
        });

        return () => unsub();
    }, [userId]);

    // Handle daily goal completion
    const handleDailyGoalToggle = (index) => {
        const newGoals = [...dailyGoals];
        newGoals[index].isDone = !newGoals[index].isDone;
        setDailyGoals(newGoals);
        saveGoalsToFirestore({ dailyGoals: newGoals, weeklyGoals, streakCount, rank, lastCheckInDate });
    };

    // Update daily goal text
    const handleDailyGoalChange = (index, text) => {
        const newGoals = [...dailyGoals];
        newGoals[index].text = text;
        setDailyGoals(newGoals);
        saveGoalsToFirestore({ dailyGoals: newGoals, weeklyGoals, streakCount, rank, lastCheckInDate });
    };

    // Handle weekly goal completion
    const handleWeeklyGoalToggle = (index) => {
        const newGoals = [...weeklyGoals];
        newGoals[index].isDone = !newGoals[index].isDone;
        setWeeklyGoals(newGoals);
        saveGoalsToFirestore({ dailyGoals, weeklyGoals: newGoals, streakCount, rank, lastCheckInDate });
    };

    // Update weekly goal text
    const handleWeeklyGoalChange = (index, text) => {
        const newGoals = [...weeklyGoals];
        newGoals[index].text = text;
        setWeeklyGoals(newGoals);
        saveGoalsToFirestore({ dailyGoals, weeklyGoals: newGoals, streakCount, rank, lastCheckInDate });
    };

    // Check and update streak logic
    useEffect(() => {
        if (isLoading || !lastCheckInDate) return;

        const today = new Date();
        const lastCheckIn = new Date(lastCheckInDate);
        const dayDifference = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24));

        if (dayDifference === 1) { // 24 hours have passed, it's a new day
            const allDone = dailyGoals.every(goal => goal.isDone);
            if (allDone) {
                const newStreak = streakCount + 1;
                const newRank = getRank(newStreak);
                setStreakCount(newStreak);
                setRank(newRank);
                // Reset daily goals for the new day
                const resetDailyGoals = dailyGoals.map(goal => ({ ...goal, isDone: false }));
                setDailyGoals(resetDailyGoals);
                // Save new state
                saveGoalsToFirestore({
                    dailyGoals: resetDailyGoals,
                    weeklyGoals,
                    streakCount: newStreak,
                    rank: newRank,
                    lastCheckInDate: todayString()
                });
            } else {
                // Streak is broken
                setStreakCount(0);
                setRank("Cadet");
                saveGoalsToFirestore({
                    dailyGoals,
                    weeklyGoals,
                    streakCount: 0,
                    rank: "Cadet",
                    lastCheckInDate: todayString()
                });
            }
        }
    }, [isLoading, lastCheckInDate]);

    // Check for daily goal completion and update streak on button click
    const handleCheckIn = () => {
        if (lastCheckInDate === todayString()) {
            return; // Already checked in today
        }
        const allDone = dailyGoals.every(goal => goal.isDone);
        const newStreak = allDone ? streakCount + 1 : 0;
        const newRank = getRank(newStreak);
        setStreakCount(newStreak);
        setRank(newRank);
        setLastCheckInDate(todayString());
        // Reset daily goals for the new day
        const resetDailyGoals = dailyGoals.map(goal => ({ ...goal, isDone: false }));
        setDailyGoals(resetDailyGoals);
        saveGoalsToFirestore({
            dailyGoals: resetDailyGoals,
            weeklyGoals,
            streakCount: newStreak,
            rank: newRank,
            lastCheckInDate: todayString()
        });
    };

    // Request notification permission
    const requestNotificationPermission = () => {
        if (!("Notification" in window)) {
            console.error("This browser does not support desktop notification");
            return;
        }
        Notification.requestPermission().then(permission => {
            setNotificationPermission(permission);
            if (permission === "granted") {
                scheduleReminders();
            }
        });
    };

    // Schedule reminders (client-side)
    const scheduleReminders = () => {
        if (notificationIntervalRef.current) {
            clearInterval(notificationIntervalRef.current);
        }
        // Set reminder to fire every 4 hours
        notificationIntervalRef.current = setInterval(() => {
            new Notification('Goal Tracker Reminder', {
                body: "Don't forget to work on your daily goals!",
                icon: 'https://placehold.co/64x64/000000/FFFFFF?text=GT'
            });
        }, 1000 * 60 * 60 * 4); // 4 hours
    };

    useEffect(() => {
        if (notificationPermission === 'granted') {
            scheduleReminders();
        }
        return () => {
            if (notificationIntervalRef.current) {
                clearInterval(notificationIntervalRef.current);
            }
        };
    }, [notificationPermission]);

    // Calculate progress for the ring
    const dailyGoalsDone = dailyGoals.filter(goal => goal.text && goal.isDone).length;
    const dailyGoalsTotal = dailyGoals.filter(goal => goal.text).length || 1;
    const dailyProgress = Math.min(100, Math.round((dailyGoalsDone / dailyGoalsTotal) * 100));
    const isDailyGoalComplete = dailyProgress === 100 && dailyGoalsTotal > 0;
    
    if (isLoading) {
        return (
            // Premium Loading State
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans">
                <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-500 border-opacity-70"></div>
                <p className="ml-4 text-xl font-light text-gray-400">Loading your matrix...</p>
            </div>
        );
    }

    return (
        // Dark Theme and Structured Layout
        <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-gray-900 text-white font-sans">
            <script src="https://cdn.tailwindcss.com"></script>

            <div 
                className="w-full max-w-xl p-4 sm:p-8 bg-gray-800 rounded-3xl shadow-2xl shadow-black/50 border border-gray-700/50 backdrop-blur-md"
                style={{
                    // Acrylic/Frosted Glass Effect on Container
                    background: 'rgba(31, 41, 55, 0.8)', 
                }}
            >
                {/* Header */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400" style={{ letterSpacing: '-1px' }}>
                        GOAL MATRIX
                    </span>
                </h1>

                {/* Segmented Control Tab Navigation */}
                <div className="relative flex justify-between p-1 bg-gray-700/50 rounded-2xl mb-8 shadow-inner shadow-black/30">
                    <TabButton name="setGoals" activeTab={activeTab} setActiveTab={setActiveTab} icon={FaListCheck} label="Set" />
                    <TabButton name="trackGoals" activeTab={activeTab} setActiveTab={setActiveTab} icon={FaChartLine} label="Track" />
                    <TabButton name="rewards" activeTab={activeTab} setActiveTab={setActiveTab} icon={FaTrophy} label="Status" />
                </div>

                {/* Tab Content Area */}
                <div 
                    className="p-6 rounded-2xl border border-gray-700/50"
                    style={{ background: 'rgba(31, 41, 55, 0.7)' }} 
                >
                    {/* Set Goals Tab */}
                    {activeTab === 'setGoals' && (
                        <>
                            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Define Your Focus</h2>
                            <div className="mb-6 space-y-4">
                                <h3 className="text-xl font-semibold text-gray-300">Daily Targets</h3>
                                <ul className="space-y-4">
                                    {dailyGoals.map((goal, index) => (
                                        <li key={index}>
                                            <PremiumInput
                                                value={goal.text}
                                                onChange={(e) => handleDailyGoalChange(index, e.target.value)}
                                                placeholder={`Daily Goal ${index + 1}`}
                                                accentColor="blue"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-gray-300">Weekly Milestones</h3>
                                <ul className="space-y-4">
                                    {weeklyGoals.map((goal, index) => (
                                        <li key={index}>
                                            <PremiumInput
                                                value={goal.text}
                                                onChange={(e) => handleWeeklyGoalChange(index, e.target.value)}
                                                placeholder={`Weekly Goal ${index + 1}`}
                                                accentColor="emerald"
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}

                    {/* Track Goals Tab */}
                    {activeTab === 'trackGoals' && (
                        <>
                            <h2 className="text-2xl font-semibold mb-4 text-emerald-400">Track Progress</h2>
                            
                            {/* Progress Ring */}
                            <div className="flex flex-col items-center justify-center my-6">
                                <ProgressRing progress={dailyProgress} />
                                <p className="mt-4 text-lg font-medium text-gray-300">Daily Completion</p>
                            </div>

                            <div className="space-y-6">
                                {/* Daily Goals List */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-300 mb-2 flex items-center">
                                        <FaListCheck className="text-emerald-400 mr-2" /> Daily Goals
                                    </h3>
                                    <ul className="space-y-2">
                                        {dailyGoals.map((goal, index) => (
                                            <li key={index} className="p-4 bg-gray-700 rounded-lg flex items-center shadow-lg shadow-black/20 hover:bg-gray-600 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={goal.isDone}
                                                    onChange={() => handleDailyGoalToggle(index)}
                                                    className="appearance-none h-6 w-6 border-2 border-emerald-500 rounded-md bg-gray-800 checked:bg-emerald-500 checked:border-transparent transition-all cursor-pointer relative"
                                                    style={{ outline: 'none', minWidth: '24px' }}
                                                />
                                                <span className={`flex-1 ml-4 text-gray-100 ${goal.isDone ? 'line-through text-gray-400 transition-all' : ''}`}>
                                                    {goal.text}
                                                </span>
                                                {/* Corrected usage: FaCheckCircle -> FaCheck */}
                                                {goal.isDone && <FaCheck className="text-emerald-400 ml-2" />}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Weekly Goals List (Simplified) */}
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-300 mb-2 flex items-center">
                                        <FaChartLine className="text-blue-400 mr-2" /> Weekly Goals
                                    </h3>
                                    <ul className="space-y-2">
                                        {weeklyGoals.map((goal, index) => (
                                            <li key={index} className="p-4 bg-gray-700 rounded-lg flex items-center shadow-lg shadow-black/20 hover:bg-gray-600 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={goal.isDone}
                                                    onChange={() => handleWeeklyGoalToggle(index)}
                                                    className="appearance-none h-6 w-6 border-2 border-blue-500 rounded-md bg-gray-800 checked:bg-blue-500 checked:border-transparent transition-all cursor-pointer"
                                                    style={{ outline: 'none', minWidth: '24px' }}
                                                />
                                                <span className={`flex-1 ml-4 text-gray-100 ${goal.isDone ? 'line-through text-gray-400 transition-all' : ''}`}>
                                                    {goal.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            {/* Check-In Button */}
                            <div className="mt-8">
                                <button
                                    onClick={handleCheckIn}
                                    disabled={lastCheckInDate === todayString()}
                                    className={`w-full px-6 py-4 font-extrabold rounded-full shadow-lg transition-all duration-300 transform ${
                                        lastCheckInDate === todayString()
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-emerald-500 to-green-400 text-white hover:scale-[1.02] shadow-emerald-500/50'
                                    }`}
                                >
                                    {isSaving ? 'Synchronizing...' : lastCheckInDate === todayString() ? 'Checked In Today' : 'Confirm Daily Completion'}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Rewards Tab */}
                    {activeTab === 'rewards' && (
                        <>
                            <h2 className="text-2xl font-semibold mb-6 text-purple-400">Your Status & Rewards</h2>
                            
                            {/* Rank and Streak Visualization */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-xl bg-gray-700 text-center shadow-inner shadow-black/30 border border-gray-600">
                                    <FaMedal className="text-4xl text-yellow-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-400 uppercase">Current Rank</p>
                                    <p className="text-2xl font-extrabold text-yellow-400 mt-1">{rank}</p>
                                </div>
                                <div className="p-5 rounded-xl bg-gray-700 text-center shadow-inner shadow-black/30 border border-gray-600">
                                    <FaFire className="text-4xl text-red-500 mx-auto mb-2" />
                                    <p className="text-sm text-gray-400 uppercase">Streak</p>
                                    <p className="text-2xl font-extrabold text-red-500 mt-1">{streakCount} {streakCount === 1 ? 'day' : 'days'}</p>
                                </div>
                            </div>

                            {/* Next Milestone */}
                            <div className="mt-6 p-4 bg-gray-700 rounded-xl border border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-300 mb-2">Next Promotion</h3>
                                <ul className="space-y-1 text-sm text-gray-400">
                                    {streakRanks.filter(r => r.streak > streakCount).slice(0, 3).map((r, i) => (
                                        <li key={i} className="flex justify-between">
                                            <span>{r.rank}</span>
                                            <span className="font-bold text-gray-200">{r.streak - streakCount} days away</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            {/* Notification Reminder Button */}
                            <div className="mt-8 flex justify-center">
                                {notificationPermission !== 'granted' && (
                                    <button
                                        onClick={requestNotificationPermission}
                                        className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
                                    >
                                        Enable Daily Reminders
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}