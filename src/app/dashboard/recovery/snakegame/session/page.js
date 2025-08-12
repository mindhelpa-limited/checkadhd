'use client';

import { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Import the components for each session level with corrected paths
import SnakeGame from "../../../../../components/games/SnakeGame";
import MeditationScreen from "../../../../../components/session/MeditationScreen";
import RehydrationBreakScreen from "../../../../../components/session/RehydrationBreakScreen";
import ScoreScreen from "../../../../../components/session/ScoreScreen";

// Define the structure of the session, similar to the Blockstack session
const LEVELS = [
  {
    id: 1,
    title: "Meditate",
    subtitle: "Focus and get ready.",
    type: "meditation",
    duration: "5 mins",
  },
  {
    id: 2,
    title: "Stack Big",
    subtitle: "Deep focus session.",
    type: "game",
    duration: "7 mins",
  },
  {
    id: 3,
    title: "Rehydrate Fast",
    "subtitle": "Rehydration break.",
    type: "break",
    duration: "2 mins",
  },
  {
    id: 4,
    title: "Stack Higher",
    subtitle: "Stay sharp.",
    type: "game",
    duration: "7 mins",
  },
  {
    id: 5,
    title: "Meditate",
    subtitle: "Relax. Get centered.",
    type: "meditation",
    duration: "5 mins",
  },
  {
    id: 6,
    title: "Stack Max",
    subtitle: "Let’s finish strong.",
    type: "game",
    duration: "7 mins",
  },
];

export default function SnakeSessionPage() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [sessionScores, setSessionScores] = useState([]);
  
  // This function is passed to each component to handle the transition to the next level.
  const handleNext = (gameData) => {
    // If gameData is provided (from a game component), save the score
    if (gameData && gameData.totalScore !== undefined) {
      setSessionScores(prevScores => [...prevScores, gameData.totalScore]);
    }
    setCurrentLevelIndex(prevIndex => prevIndex + 1);
  };

  const renderComponent = () => {
    // Check if the session is complete
    if (currentLevelIndex >= LEVELS.length) {
      return <ScoreScreen sessionScores={sessionScores} onNext={() => setCurrentLevelIndex(0)} />;
    }

    const currentLevel = LEVELS[currentLevelIndex];

    switch (currentLevel.type) {
      case "game":
        return <SnakeGame onFinish={handleNext} />;
      case "meditation":
        return <MeditationScreen onNext={handleNext} />;
      case "break":
        return <RehydrationBreakScreen onNext={handleNext} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative font-mono">
      {/* Back button link */}
      <Link href="/dashboard/recovery/snakegame">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="absolute top-8 left-8 z-20 p-3 rounded-full bg-gray-800 border-2 border-blue-500 hover:bg-gray-700 transition"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.button>
      </Link>

      <AnimatePresence mode="wait">
        {renderComponent()}
      </AnimatePresence>
    </div>
  );
}
