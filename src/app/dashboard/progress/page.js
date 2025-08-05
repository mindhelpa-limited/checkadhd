"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query } from "firebase/firestore";

// --- Icon Components ---
// A simple SVG icon for the "streak" flame
const FlameIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-red-500">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/>
    </svg>
);

// A simple SVG icon for the "best streak" trophy
const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-amber-500">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
        <path d="M4 22h16"/>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
    </svg>
);

// A simple SVG icon for "total tasks completed"
const CheckSquareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-500">
        <rect width="18" height="18" x="3" y="3" rx="2"/>
        <path d="m9 12 2 2 4-4"/>
    </svg>
);

// --- Loader Component for a clean loading screen experience ---
const FullScreenLoader = ({ message }) => (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-700 font-semibold text-lg">{message}</p>
    </div>
);

// --- Main Progress Page Component ---
export default function ProgressPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);
            
            const userDocRef = doc(db, "users", currentUser.uid);
            const logCollectionRef = collection(db, `users/${currentUser.uid}/recoveryLog`);
            
            try {
                const [userDocSnap, logQuerySnap] = await Promise.all([
                    getDoc(userDocRef),
                    getDocs(query(logCollectionRef)) 
                ]);

                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data());
                }

                const logs = logQuerySnap.docs.map(d => ({ date: d.id, ...d.data() }));
                setProgressData(logs);

            } catch (error) {
                console.error("Error fetching progress data:", error);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    // Helper function to generate days for the calendar
    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        // Add leading empty cells for days from the previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        // Add days of the current month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    // Helper function to check if a specific day has completed tasks
    const isDayCompleted = (day) => {
        if (!day) return false;
        const dateString = day.toISOString().split('T')[0];
        const log = progressData.find(log => log.date === dateString);
        // Check if the log exists and has at least one true boolean value (a completed task)
        return log && Object.values(log).some(val => typeof val === 'boolean' && val === true);
    };
    
    // Calculate the total number of tasks completed across all logged days
    const totalTasksCompleted = progressData.reduce((acc, log) => {
        // Filter for boolean values and count the 'true' ones
        return acc + Object.values(log).filter(val => typeof val === 'boolean' && val === true).length;
    }, 0);

    if (loading) {
        return <FullScreenLoader message="Loading Your Progress..." />;
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-0">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Progress</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Current Streak Card */}
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform duration-300 hover:scale-105">
                    <FlameIcon />
                    <div>
                        <p className="text-gray-600 font-medium">Current Streak</p>
                        <p className="text-4xl font-bold text-gray-900">{userData?.streak || 0}</p>
                    </div>
                </div>
                {/* Best Streak Card */}
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform duration-300 hover:scale-105">
                    <TrophyIcon />
                    <div>
                        <p className="text-gray-600 font-medium">Best Streak</p>
                        <p className="text-4xl font-bold text-gray-900">{userData?.bestStreak || 0}</p>
                    </div>
                </div>
                {/* Total Tasks Completed Card */}
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform duration-300 hover:scale-105">
                    <CheckSquareIcon />
                    <div>
                        <p className="text-gray-600 font-medium">Total Tasks Completed</p>
                        <p className="text-4xl font-bold text-gray-900">{totalTasksCompleted}</p>
                    </div>
                </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white p-8 rounded-xl shadow-md">
                {/* Calendar Header with navigation buttons */}
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">&lt;</button>
                    <h2 className="text-2xl font-bold text-gray-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">&gt;</button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-600 font-medium mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                </div>

                {/* Calendar days grid */}
                <div className="grid grid-cols-7 gap-2">
                    {getCalendarDays().map((day, index) => (
                        <div key={index} className={`h-12 flex items-center justify-center rounded-lg text-gray-800 font-semibold
                            ${!day ? 'bg-gray-100' : ''}
                            ${day && isDayCompleted(day) ? 'bg-green-500 text-white' : ''}
                            ${day && !isDayCompleted(day) && day.toDateString() !== new Date().toDateString() ? 'bg-white border' : ''}
                            ${day && day.toDateString() === new Date().toDateString() ? 'bg-blue-500 text-white ring-2 ring-blue-500 ring-offset-2' : ''}
                        `}>
                            {day ? day.getDate() : ''}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
