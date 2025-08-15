"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ExerciseBreak({
  onNext,
  duration = 2 * 60 * 1000,          // default 2 minutes (ms)
  initialRemainingMs,                 // optional resume point (ms)
}) {
  const startMs = typeof initialRemainingMs === 'number' && initialRemainingMs >= 0
    ? initialRemainingMs
    : duration;

  const [timeLeftMs, setTimeLeftMs] = useState(startMs);

  useEffect(() => {
    if (timeLeftMs <= 0) {
      onNext?.();
      return;
    }
    const endAt = Date.now() + timeLeftMs;
    const id = setInterval(() => {
      const left = endAt - Date.now();
      if (left <= 0) {
        clearInterval(id);
        setTimeLeftMs(0);
        onNext?.();
      } else {
        setTimeLeftMs(left);
      }
    }, 250);
    return () => clearInterval(id);
  }, [timeLeftMs, onNext]);

  const formatTime = (ms) => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
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
            {formatTime(timeLeftMs)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
