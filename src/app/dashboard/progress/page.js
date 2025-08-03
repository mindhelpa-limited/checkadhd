"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";

// --- Icon Components ---
const FlameIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-red-500"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/></svg>);
const TrophyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-amber-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>);
const CheckSquareIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-green-500"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/></svg>);

// --- Loader Component ---
const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    <p className="ml-4 text-gray-700">{message}</p>
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
          getDocs(query(logCollectionRef)) // Removed orderBy to avoid needing a composite index
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
    // A day is "completed" if at least one task is done.
    return log && Object.values(log).some(val => val === true);
  };
  
  const totalTasksCompleted = progressData.reduce((acc, log) => {
      // We subtract 1 because the 'date' field is also in the object
      return acc + Object.values(log).filter(val => val === true).length;
  }, 0);

  if (loading) {
    return <FullScreenLoader message="Loading Your Progress..." />;
  }

  return (
    <div className="pb-24 md:pb-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Progress</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <FlameIcon />
                <div className="ml-4">
                    <p className="text-gray-600 font-medium">Current Streak</p>
                    <p className="text-3xl font-bold text-gray-900">{userData?.streak || 0} Days</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <TrophyIcon />
                <div className="ml-4">
                    <p className="text-gray-600 font-medium">Best Streak</p>
                    <p className="text-3xl font-bold text-gray-900">{userData?.bestStreak || 0} Days</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <CheckSquareIcon />
                <div className="ml-4">
                    <p className="text-gray-600 font-medium">Total Tasks Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{totalTasksCompleted}</p>
                </div>
            </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 rounded-full hover:bg-gray-100">&lt;</button>
                <h2 className="text-xl font-bold text-gray-800">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 rounded-full hover:bg-gray-100">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-600 font-medium mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {getCalendarDays().map((day, index) => (
                    <div key={index} className={`h-12 flex items-center justify-center rounded-lg text-gray-800
                        ${!day ? 'bg-gray-50' : ''}
                        ${day && isDayCompleted(day) ? 'bg-green-400 text-white font-bold' : ''}
                        ${day && day.toDateString() === new Date().toDateString() ? 'ring-2 ring-blue-500' : ''}
                    `}>
                        {day ? day.getDate() : ''}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
