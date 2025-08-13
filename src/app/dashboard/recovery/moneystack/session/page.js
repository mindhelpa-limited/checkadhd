'use client';

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Import all the components needed for the session flow
import MeditationScreen from "../../../../../components/session/MeditationScreen";
import MoneyStackGame from "../../../../../components/games/MoneyStackGame";
import RehydrationBreakScreen from "../../../../../components/session/RehydrationBreakScreen";
import ExerciseBreak from "../../../../../components/session/ExerciseBreak";
import ScoreScreen from "../../../../../components/session/ScoreScreen";

// Define the stages of the session and their durations
const STAGES = [
  { id: 'meditation', component: MeditationScreen, duration: 5 * 60 * 1000 },
  { id: 'game1', component: MoneyStackGame, duration: 7 * 60 * 1000 },
  { id: 'rehydration', component: RehydrationBreakScreen, duration: 2 * 60 * 1000 },
  { id: 'game2', component: MoneyStackGame, duration: 7 * 60 * 1000 },
  { id: 'exercise', component: ExerciseBreak, duration: 2 * 60 * 1000 },
  { id: 'game3', component: MoneyStackGame, duration: 7 * 60 * 1000 },
  { id: 'score', component: ScoreScreen, duration: null },
];

const ROWS = 20;
const COLS = 10;

// The main component for the Money Stack game session
export default function MoneyStackSessionPage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [sessionData, setSessionData] = useState({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
    score: 0,
    segmentScores: {
      game1: 0,
      game2: 0,
      game3: 0,
    },
  });

  // New state variables to track overall session metrics for the score screen
  const [totalScore, setTotalScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0); // in milliseconds
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  // This function handles the transition to the next stage and saves the game state
  const handleNextStage = (updatedState = {}) => {
    const prevStage = STAGES[currentStageIndex];
    const prevStageId = prevStage.id;
    const prevStageDuration = prevStage.duration;

    // If the previous stage was a game, update the session data and metrics
    if (prevStageId.includes('game')) {
      const newScoreForSegment = updatedState.score - sessionData.score;
      setSessionData(prev => ({
        ...prev,
        ...updatedState,
        segmentScores: {
          ...prev.segmentScores,
          [prevStageId]: newScoreForSegment,
        },
      }));

      // Update total score and total time spent in games
      setTotalScore(prev => prev + newScoreForSegment);
      setTotalTime(prev => prev + prevStageDuration);

      // Update the streak based on the score
      // (Example logic: a streak is earned for every 500 points)
      if (newScoreForSegment > 500) {
        setCurrentStreak(prev => prev + 1);
      } else {
        setCurrentStreak(0); // Reset the streak if the score is too low
      }
    }

    // Keep track of the highest streak achieved
    if (currentStreak > highestStreak) {
      setHighestStreak(currentStreak);
    }

    // Move to the next stage in the sequence
    if (currentStageIndex < STAGES.length - 1) {
      setCurrentStageIndex(prevIndex => prevIndex + 1);
    } else {
      console.log("Session complete! Final data:", { totalScore, highestStreak, totalTime });
    }
  };

  // Determine the current component and its props based on the stage
  const CurrentComponent = STAGES[currentStageIndex].component;
  const isGameStage = STAGES[currentStageIndex].id.includes('game');
  const isScoreStage = STAGES[currentStageIndex].id === 'score';

  // Use useMemo to prevent unnecessary re-renders of the ScoreScreen component
  const scoreScreenProps = useMemo(() => {
    if (isScoreStage) {
      return {
        totalScore: totalScore,
        highestStreak: highestStreak,
        totalTime: totalTime,
      };
    }
    return {};
  }, [isScoreStage, totalScore, highestStreak, totalTime]);

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStageIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          {isGameStage ? (
            <CurrentComponent
              onNext={handleNextStage}
              initialState={{ board: sessionData.board, score: sessionData.score }}
              duration={STAGES[currentStageIndex].duration}
              title={`Money Stack Session ${currentStageIndex / 2 + 1}`}
            />
          ) : isScoreStage ? (
            // Pass the calculated props to the ScoreScreen component
            <ScoreScreen {...scoreScreenProps} />
          ) : (
            <CurrentComponent
              onNext={handleNextStage}
              sessionScores={sessionData.segmentScores}
              title={STAGES[currentStageIndex].id} // Pass the stage ID as title for other screens
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
