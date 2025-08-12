"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { auth, db } from "@/lib/firebase"; // Importing Firebase auth and db
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Importing Firestore functions

const ScoreScreen = ({ totalScore, highestStreak, totalTime }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to format time from milliseconds to MM:SS format
  const formatTime = (timeInMs) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Asynchronous function to save the score to Firestore
  const saveScoreToDatabase = async () => {
    if (loading) return; // Prevent multiple clicks
    
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
      // Get a reference to the user's document
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      // Get the existing data to update the score
      const currentData = userDocSnap.exists() ? userDocSnap.data() : { totalMoneyStacked: 0 };
      
      const newTotalMoneyStacked = (currentData.totalMoneyStacked || 0) + totalScore;
      
      // Update the Firestore document with the new total score and a new best streak
      await updateDoc(userDocRef, {
        totalMoneyStacked: newTotalMoneyStacked,
        bestStreak: Math.max(currentData.bestStreak || 0, highestStreak) // Keep the highest streak
      });

      console.log("Score and streak updated successfully!");
      
      // Navigate back to the progress page after saving
      router.push("/progress");
      
    } catch (e) {
      console.error("Error updating document: ", e);
      setError("Failed to save your score. Please try again.");
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

        {/* Display for final score */}
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 animate-slide-in-up">
          <h2 className="text-3xl font-semibold text-green-300 mb-2">Final Score</h2>
          <motion.span
            className="text-6xl font-bold text-white block leading-none"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          >
            ${totalScore}
          </motion.span>
        </div>

        {/* Stats for streak and time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700 animate-slide-in-up"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-green-300">Highest Streak</h3>
            <span className="text-4xl font-bold text-white">{highestStreak}</span>
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
        
        {/* Error message display */}
        {error && <p className="text-red-400 font-medium">{error}</p>}

        {/* Call to action button */}
        <motion.button
          className="w-full py-4 px-6 mt-6 bg-green-500 hover:bg-green-600 text-gray-900 text-xl font-bold rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          onClick={saveScoreToDatabase}
          disabled={loading}
        >
          {loading ? "Saving..." : "Finish Session"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ScoreScreen;
