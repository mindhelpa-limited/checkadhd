'use client';

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation"; 

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

// ---------- Session resume helpers ----------
const STORAGE_KEY = 'moneystack_session_v1';
const STAGE_MS = STAGES.map(s => s.duration ?? 0);
const TOTAL_MS = STAGE_MS.reduce((a, b) => a + b, 0);
const CUM_MS = STAGE_MS.reduce((acc, dur, i) => {
  acc[i] = (acc[i - 1] ?? 0) + dur;
  return acc;
}, []);

function locateStage(elapsedMs) {
  if (elapsedMs <= 0) return { index: 0, offset: 0 };
  for (let i = 0; i < CUM_MS.length; i++) {
    const start = (CUM_MS[i - 1] ?? 0);
    const end = CUM_MS[i];
    if (elapsedMs < end) return { index: i, offset: elapsedMs - start };
  }
  return { index: STAGES.length - 1, offset: 0 };
}

export default function MoneyStackSessionPage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageRemainingMs, setStageRemainingMs] = useState(null);
  const [sessionData, setSessionData] = useState({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
    score: 0,
    segmentScores: {
      game1: 0,
      game2: 0,
      game3: 0,
    },
  });

  const router = useRouter();

  const [totalScore, setTotalScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [totalStagesCompleted, setTotalStagesCompleted] = useState(0);

  useEffect(() => {
    const now = Date.now();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const startAt = now;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          game: 'moneystack',
          startAt,
          currentStageIndex: 0,
          stageStartedAt: startAt,
        })
      );
      setCurrentStageIndex(0);
      setStageRemainingMs(STAGES[0].duration ?? 0);
      return;
    }

    const saved = JSON.parse(raw);
    if (!saved.startAt) {
      const startAt = now;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          game: 'moneystack',
          startAt,
          currentStageIndex: 0,
          stageStartedAt: startAt,
        })
      );
      setCurrentStageIndex(0);
      setStageRemainingMs(STAGES[0].duration ?? 0);
      return;
    }

    const sessionEnd = saved.startAt + TOTAL_MS;
    if (now >= sessionEnd) {
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStageIndex(STAGES.length - 1);
      setStageRemainingMs(0);
      return;
    }

    const elapsed = now - saved.startAt;
    const { index, offset } = locateStage(elapsed);
    setCurrentStageIndex(index);
    const remaining = Math.max((STAGES[index].duration ?? 0) - offset, 0);
    setStageRemainingMs(remaining);
    const stageStartedAt = now - offset;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...saved,
        currentStageIndex: index,
        stageStartedAt,
      })
    );
  }, []);

  useEffect(() => {
    function onStorage(e) {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const saved = JSON.parse(e.newValue);
        if (!saved?.startAt) return;
        const now = Date.now();
        const elapsed = now - saved.startAt;
        const { index, offset } = locateStage(elapsed);
        setCurrentStageIndex(index);
        const remaining = Math.max((STAGES[index].duration ?? 0) - offset, 0);
        setStageRemainingMs(remaining);
      } catch {}
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleNextStage = (updatedState = {}) => {
    const prevStage = STAGES[currentStageIndex];
    const prevStageId = prevStage.id;
    const prevStageDuration = prevStage.duration ?? 0;

    if (prevStageId.includes('game')) {
      const newScoreForSegment = (updatedState.score ?? 0) - (sessionData.score ?? 0);
      setSessionData(prev => ({
        ...prev,
        ...updatedState,
        segmentScores: {
          ...prev.segmentScores,
          [prevStageId]: newScoreForSegment,
        },
      }));
      setTotalScore(prev => prev + newScoreForSegment);
      setTotalTime(prev => prev + prevStageDuration);
    }

    setTotalStagesCompleted(prev => prev + 1);

    if (currentStageIndex < STAGES.length - 1) {
      const nextIndex = currentStageIndex + 1;
      setCurrentStageIndex(nextIndex);
      setStageRemainingMs(STAGES[nextIndex].duration ?? 0);

      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      const now = Date.now();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          game: 'moneystack',
          startAt: saved.startAt ?? now,
          currentStageIndex: nextIndex,
          stageStartedAt: now,
        })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
      console.log("Session complete! Final data:", { totalScore, totalStagesCompleted, totalTime });
      router.push('/dashboard/progress');
    }
  };

  const CurrentComponent = STAGES[currentStageIndex].component;
  const isGameStage = STAGES[currentStageIndex].id.includes('game');
  const isScoreStage = STAGES[currentStageIndex].id === 'score';

  const scoreScreenProps = useMemo(() => {
    if (isScoreStage) {
      return {
        totalScore: totalScore,
        totalTime: totalTime,
        totalStagesCompleted: totalStagesCompleted,
      };
    }
    return {};
  }, [isScoreStage, totalScore, totalTime, totalStagesCompleted]);

  const initialRemainingMs =
    stageRemainingMs !== null
      ? stageRemainingMs
      : (STAGES[currentStageIndex].duration ?? 0);

  const renderComponent = () => {
    if (isGameStage) {
      return (
        <CurrentComponent
          key={STAGES[currentStageIndex].id}
          onNext={handleNextStage}
          initialState={{ board: sessionData.board, score: sessionData.score }}
          duration={STAGES[currentStageIndex].duration}
          initialRemainingMs={initialRemainingMs}
          title={`Money Stack Session ${currentStageIndex / 2 + 1}`}
        />
      );
    } else if (isScoreStage) {
      return (
        <ScoreScreen
          key={STAGES[currentStageIndex].id}
          {...scoreScreenProps}
          onNext={handleNextStage}
        />
      );
    } else {
      return (
        <CurrentComponent
          key={STAGES[currentStageIndex].id}
          onNext={handleNextStage}
          sessionScores={sessionData.segmentScores}
          duration={STAGES[currentStageIndex].duration}
          initialRemainingMs={initialRemainingMs}
          title={STAGES[currentStageIndex].id}
        />
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={STAGES[currentStageIndex].id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full"
        >
          {renderComponent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}