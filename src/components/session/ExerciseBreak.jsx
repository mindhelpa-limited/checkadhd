"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ExerciseBreak({ onNext }) {
  // Use a state variable for the timer
  const [timeLeft, setTimeLeft] = useState(2 * 60); // 2 minutes in seconds

  useEffect(() => {
    // Only run the timer if there's time left
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000); // Update every second

      return () => clearInterval(timer);
    } else {
      // Once the timer hits zero, advance to the next screen
      onNext();
    }
  }, [timeLeft, onNext]);

  // Helper function to format the time as MM:SS
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white p-8"
    >
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
          Stretch Break 🧘
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-2xl">
          Stretch your body gently. Breathe. Move your neck and shoulders.
        </p>
        <div className="mt-8">
          <p className="text-7xl font-bold text-emerald-400">
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
