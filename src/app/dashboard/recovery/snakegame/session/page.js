'use client';

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { GameSessionLayout } from "@/hook/useGameSessionManager";

import MeditationScreen from "../../../../../components/session/MeditationScreen";
import SnakeGame from "../../../../../components/games/SnakeGame";
import RehydrationBreakScreen from "../../../../../components/session/RehydrationBreakScreen";
import ExerciseBreak from "../../../../../components/session/ExerciseBreak";
import ScoreScreen from "../../../../../components/session/ScoreScreen";

const STAGES = [
  { id: 'meditation', component: MeditationScreen, duration: 5 * 60 * 1000, isGame: false },
  { id: 'game1', component: SnakeGame, duration: 7 * 60 * 1000, isGame: true },
  { id: 'rehydration', component: RehydrationBreakScreen, duration: 2 * 60 * 1000, isGame: false },
  { id: 'game2', component: SnakeGame, duration: 7 * 60 * 1000, isGame: true },
  { id: 'exercise', component: ExerciseBreak, duration: 2 * 60 * 1000, isGame: false },
  { id: 'game3', component: SnakeGame, duration: 7 * 60 * 1000, isGame: true },
  { id: 'score', component: ScoreScreen, duration: null, isGame: false },
];

export default function SnakeSessionPage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [sessionData, setSessionData] = useState({
    score: 0,
    segmentScores: { game1: 0, game2: 0, game3: 0 },
  });
  const [totalScore, setTotalScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  const handleNextStage = (updatedState = {}) => {
    const prevStage = STAGES[currentStageIndex];
    const prevStageId = prevStage.id;
    const prevStageDuration = prevStage.duration;

    if (prevStageId.includes('game')) {
      const newScoreForSegment = (updatedState.score ?? 0) - sessionData.score;
      setSessionData(prev => ({
        ...prev,
        ...updatedState,
        segmentScores: { ...prev.segmentScores, [prevStageId]: newScoreForSegment },
      }));
      setTotalScore(prev => prev + newScoreForSegment);
      setTotalTime(prev => prev + (prevStageDuration || 0));
      setCurrentStreak(s => (newScoreForSegment > 500 ? s + 1 : 0));
      setHighestStreak(h => Math.max(h, currentStreak));
    }

    if (currentStageIndex < STAGES.length - 1) {
      setCurrentStageIndex(i => i + 1);
    }
  };

  const currentStage = STAGES[currentStageIndex];
  const CurrentComponent = currentStage.component;
  const isGameStage = currentStage.id.includes('game');
  const isScoreStage = currentStage.id === 'score';

  const scoreScreenProps = useMemo(() => (
    isScoreStage ? { totalScore, highestStreak, totalTime } : {}
  ), [isScoreStage, totalScore, highestStreak, totalTime]);

  const renderContent = () => {
    if (isGameStage) {
      return (
        <CurrentComponent
          onNext={handleNextStage}
          initialState={{ score: sessionData.score }}
          duration={currentStage.duration}
          title={`Snake Session ${currentStageIndex / 2 + 1}`}
        />
      );
    } else if (isScoreStage) {
      return <ScoreScreen {...scoreScreenProps} />;
    } else {
      return (
        <CurrentComponent
          onNext={handleNextStage}
          sessionScores={sessionData.segmentScores}
          title={currentStage.id}
        />
      );
    }
  };

  return (
    <>
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
        <motion.div
          key={currentStageIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          {currentStage.isGame ? (
            <GameSessionLayout gameName="snakegame">
              {renderContent()}
            </GameSessionLayout>
          ) : (
            renderContent()
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}