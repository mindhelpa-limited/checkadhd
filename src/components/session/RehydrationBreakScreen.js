import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RehydrationBreakScreen({ onNext }) {
  const [timeLeft, setTimeLeft] = useState(2 * 60); // 2 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      // Automatically advance after timer ends
      onNext();
    }
  }, [timeLeft, onNext]);

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
        <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          Rehydration Break
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-2xl">
          Take a moment to drink some water. Staying hydrated is key to maintaining focus and performance.
        </p>
        <div className="mt-8">
          <p className="text-7xl font-bold text-cyan-400">
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
