'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { DollarSign, Award, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Icon Components ---
const FlameIcon = ({ className }) => <Flame className={className} />;
const TrophyIcon = ({ className }) => <Award className={className} />;
const DollarSignIcon = ({ className }) => <DollarSign className={className} />;
const FullScreenLoader = ({ message }) => (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-400"></div>
        <p className="mt-4 font-light text-lg">{message}</p>
    </div>
);

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

    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const isDayCompleted = (day) => {
        if (!day) return false;
        const dateString = day.toISOString().split('T')[0];
        const log = progressData.find(log => log.date === dateString);
        return log && log.meditationCompleted === true;
    };
    
    if (loading) {
        return <FullScreenLoader message="Loading Your Progress..." />;
    }

    return (
        <div className="bg-gray-950 text-white min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="container mx-auto px-4 py-12 md:py-20"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                    Your Progress
                </h1>
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="bg-gray-800 p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center space-y-4 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-gray-700">
                            <FlameIcon className="w-12 h-12 text-red-500" />
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Daily Streak</p>
                                <p className="text-5xl font-extrabold text-white text-center mt-2">{userData?.dailyStreak || 0}</p>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center space-y-4 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-gray-700">
                            <TrophyIcon className="w-12 h-12 text-amber-400" />
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Total Streak</p>
                                <p className="text-5xl font-extrabold text-white text-center mt-2">{userData?.totalStreak || 0}</p>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-8 rounded-3xl shadow-lg flex flex-col items-center justify-center space-y-4 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-gray-700">
                            <DollarSignIcon className="w-12 h-12 text-green-400" />
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Money Stacked</p>
                                <p className="text-5xl font-extrabold text-white text-center mt-2">${userData?.totalMoneyStacked || 0}</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="bg-gray-800 p-8 md:p-12 rounded-3xl shadow-lg"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <button 
                                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} 
                                className="p-3 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <h2 className="text-3xl font-bold text-gray-100">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button 
                                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} 
                                className="p-3 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-4 text-center text-sm uppercase text-gray-400 font-bold tracking-wide mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-4">
                            {getCalendarDays().map((day, index) => (
                                <AnimatePresence key={index}>
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.2 }}
                                        className={`w-full aspect-square flex items-center justify-center rounded-xl text-lg font-bold transition-all duration-300
                                            ${!day ? 'bg-gray-900 opacity-50' : 'text-gray-100'}
                                            ${day && isDayCompleted(day) ? 'bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-md' : ''}
                                            ${day && !isDayCompleted(day) && day.toDateString() !== new Date().toDateString() ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer' : ''}
                                            ${day && day.toDateString() === new Date().toDateString() ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-xl ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800' : ''}
                                        `}
                                    >
                                        {day ? day.getDate() : ''}
                                    </motion.div>
                                </AnimatePresence>
                            ))}
                        </div>
                    </motion.div>
                </section>
            </motion.div>
        </div>
    );
}