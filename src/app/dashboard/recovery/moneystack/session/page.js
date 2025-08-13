'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GameSessionLayout } from '@/hook/useGameSessionManager'; // adjust path if it's "@/hooks/..."

import MeditationScreen from '../../../../../components/session/MeditationScreen';
import MoneyStackGame from '../../../../../components/games/MoneyStackGame';
import RehydrationBreakScreen from '../../../../../components/session/RehydrationBreakScreen';
import ExerciseBreak from '../../../../../components/session/ExerciseBreak';
import ScoreScreen from '../../../../../components/session/ScoreScreen';

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

export default function MoneyStackSessionPage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [sessionData, setSessionData] = useState({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
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
    const prevStageDuration = prevStage.duration ?? 0;

    if (prevStageId.includes('game')) {
      const newScoreForSegment = (updatedState.score ?? 0) - sessionData.score;

      setSessionData(prev => ({
        ...prev,
        ...updatedState,
        segmentScores: { ...prev.segmentScores, [prevStageId]: newScoreForSegment },
      }));

      setTotalScore(prev => prev + newScoreForSegment);
      setTotalTime(prev => prev + prevStageDuration);

      setCurrentStreak(s => (newScoreForSegment > 500 ? s + 1 : 0));
      setHighestStreak(h => Math.max(h, currentStreak));
    }

    if (currentStageIndex < STAGES.length - 1) {
      setCurrentStageIndex(i => i + 1);
    } else {
      // finished; ScoreScreen will render
    }
  };

  const CurrentComponent = STAGES[currentStageIndex].component;
  const isGameStage = STAGES[currentStageIndex].id.includes('game');
  const isScoreStage = STAGES[currentStageIndex].id === 'score';

  const scoreScreenProps = useMemo(
    () => (isScoreStage ? { totalScore, highestStreak, totalTime } : {}),
    [isScoreStage, totalScore, highestStreak, totalTime]
  );

  // Build content explicitly to avoid nested ternaries
  let content = null;
  if (isGameStage) {
    content = (
      <CurrentComponent
        onNext={handleNextStage}
        initialState={{ board: sessionData.board, score: sessionData.score }}
        duration={STAGES[currentStageIndex].duration}
        title={`Money Stack Session ${Math.floor(currentStageIndex / 2) + 1}`}
      />
    );
  } else if (isScoreStage) {
    content = <ScoreScreen {...scoreScreenProps} />;
  } else {
    content = (
      <CurrentComponent
        onNext={handleNextStage}
        sessionScores={sessionData.segmentScores}
        title={STAGES[currentStageIndex].id}
      />
    );
  }

  return (
    <GameSessionLayout gameName="moneystack">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStageIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          {content}
        </motion.div>
      </AnimatePresence>
    </GameSessionLayout>
  );
}