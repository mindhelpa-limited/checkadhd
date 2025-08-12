"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { DollarSign, Award, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Icon Components (Lucide React for a clean look) ---
// I've replaced the custom SVG icons with components from the 'lucide-react' library for consistency and ease of use.
// These are included here for clarity, but you would normally import them directly.
const FlameIcon = ({ className }) => <Flame className={className} />;
const TrophyIcon = ({ className }) => <Award className={className} />;
const DollarSignIcon = ({ className }) => <DollarSign className={className} />;

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
    
    if (loading) {
        return <FullScreenLoader message="Loading Your Progress..." />;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8 pb-24 md:pb-0"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Progress</h1>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              
              {/* Current Streak Card (Daily Streak) */}
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform duration-300 hover:scale-105">
                <FlameIcon className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-gray-600 font-medium">Daily Streak</p>
                  <p className="text-3xl font-bold text-gray-900">{userData?.streak || 0}</p>
                </div>
              </div>
              
              {/* Best Streak Card (Total Streak) */}
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform duration-300 hover:scale-105">
                <TrophyIcon className="w-8 h-8 text-amber-500" />
                <div>
                  <p className="text-gray-600 font-medium">Total Streak</p>
                  <p className="text-3xl font-bold text-gray-900">{userData?.bestStreak || 0}</p>
                </div>
              </div>
              
              {/* Total Money Stacked Card */}
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 transition-transform duration-300 hover:scale-105">
                <DollarSignIcon className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-gray-600 font-medium">Money Stacked</p>
                  <p className="text-3xl font-bold text-gray-900">${userData?.totalMoneyStacked || 0}</p>
                </div>
              </div>
            </div>

            {/* Calendar View */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-md"
            >
              {/* Calendar Header with navigation buttons */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </button>
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
            </motion.div>
          </motion.div>
        </div>
    );
}
