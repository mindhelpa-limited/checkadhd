'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

const ScoreScreen = ({ totalScore, totalTime, onNext, totalStagesCompleted }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatTime = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFinishSession = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);

    const user = auth.currentUser;
    if (!user) {
      console.error("User not authenticated.");
      setError("You must be logged in to save your score.");
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const currentData = userDocSnap.exists() ? userDocSnap.data() : { totalMoneyStacked: 0, dailyStreak: 0, totalStreak: 0, lastSessionDate: null };

      // Update Total Money Stacked
      const newTotalMoneyStacked = (currentData.totalMoneyStacked || 0) + totalScore;
      
      // Update Total Streak (sum of all stages ever completed)
      const newTotalStreak = (currentData.totalStreak || 0) + totalStagesCompleted;

      // Update Daily Streak
      let newDailyStreak = currentData.dailyStreak || 0;
      const lastSessionDate = currentData.lastSessionDate?.toDate();
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const isSameDay = lastSessionDate && lastSessionDate.getDate() === today.getDate() && lastSessionDate.getMonth() === today.getMonth() && lastSessionDate.getFullYear() === today.getFullYear();
      const isYesterday = lastSessionDate && lastSessionDate.getDate() === yesterday.getDate() && lastSessionDate.getMonth() === yesterday.getMonth() && lastSessionDate.getFullYear() === yesterday.getFullYear();

      if (!isSameDay) {
        if (isYesterday) {
          newDailyStreak++;
        } else {
          newDailyStreak = 1;
        }
      }

      await updateDoc(userDocRef, {
        totalMoneyStacked: newTotalMoneyStacked,
        totalStreak: newTotalStreak,
        dailyStreak: newDailyStreak,
        lastSessionDate: Timestamp.now(),
      });

      console.log("Progress updated successfully!");

      if (onNext) {
        onNext();
      } else {
        router.push("/dashboard/progress");
      }
    } catch (e) {
      console.error("Error updating document: ", e);
      setError("Failed to save your progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-center min-h-screen bg-gray-950 text-white p-4 font-sans antialiased"
    >
      <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md p-8 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-700 max-w-lg w-full text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-green-400 tracking-wide drop-shadow-md animate-fade-in-down">
          Session Complete!
        </h1>
        <p className="text-xl font-medium text-gray-300">
          You've completed the money stacking session. Great job!
        </p>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 animate-slide-in-up"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-green-300">Stages Completed</h3>
            <span className="text-4xl font-bold text-white">{totalStagesCompleted}</span>
          </motion.div>
          <motion.div
            className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 animate-slide-in-up"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-green-300">Total Time</h3>
            <span className="text-4xl font-bold text-white">{formatTime(totalTime)}</span>
          </motion.div>
        </div>
        
        {error && <p className="text-red-400 font-medium">{error}</p>}

        <motion.button
          className="w-full py-4 px-6 mt-6 bg-green-500 hover:bg-green-600 text-gray-900 text-xl font-bold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          onClick={handleFinishSession}
          disabled={loading}
        >
          {loading ? "Saving..." : "Finish Session"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ScoreScreen;