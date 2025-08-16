'use client';

import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { GameSessionLayout } from "@/hook/useGameSessionManager";

import MeditationScreen from "../../../../../components/session/MeditationScreen";
import SnakeGame from "../../../../../components/games/SnakeGame";
import RehydrationBreakScreen from "../../../../../components/session/RehydrationBreakScreen";
import ExerciseBreak from "../../../../../components/session/ExerciseBreak";
import ScoreScreen from "../../../../../components/session/ScoreScreen";

// ---- Stage map (unchanged) ----
const STAGES = [
  { id: 'meditation',  component: MeditationScreen,    duration: 5 * 60 * 1000, isGame: false },
  { id: 'game1',       component: SnakeGame,          duration: 7 * 60 * 1000, isGame: true  },
  { id: 'rehydration', component: RehydrationBreakScreen, duration: 2 * 60 * 1000, isGame: false },
  { id: 'game2',       component: SnakeGame,          duration: 7 * 60 * 1000, isGame: true  },
  { id: 'exercise',    component: ExerciseBreak,      duration: 2 * 60 * 1000, isGame: false },
  { id: 'game3',       component: SnakeGame,          duration: 7 * 60 * 1000, isGame: true  },
  { id: 'score',       component: ScoreScreen,        duration: null,          isGame: false },
];

// ---------- Session resume helpers (same pattern as MoneyStack) ----------
const STORAGE_KEY = 'snakegame_session_v1';
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

export default function SnakeSessionPage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageRemainingMs, setStageRemainingMs] = useState(null);

  const [sessionData, setSessionData] = useState({
    score: 0,
    segmentScores: { game1: 0, game2: 0, game3: 0 },
  });
  const [totalScore, setTotalScore] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  // ---- Initial resume on mount
  useEffect(() => {
    const now = Date.now();
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      const startAt = now;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          game: 'snakegame',
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
          game: 'snakegame',
          startAt,
          currentStageIndex: 0,
          stageStartedAt: startAt,
        })
      );
      setCurrentStageIndex(0);
      setStageRemainingMs(STAGES[0].duration ?? 0);
      return;
    }

    // If session fully finished, jump to score
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

    // normalize current stage start for consistent resume
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

  // ---- Cross-tab sync via storage event
  useEffect(() => {
    const onStorage = (e) => {
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
    };
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
        segmentScores: { ...prev.segmentScores, [prevStageId]: newScoreForSegment },
      }));
      setTotalScore(prev => prev + newScoreForSegment);
      setTotalTime(prev => prev + prevStageDuration);
      setCurrentStreak(s => (newScoreForSegment > 500 ? s + 1 : 0));
      setHighestStreak(h => Math.max(h, currentStreak));
    }

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
          game: 'snakegame',
          startAt: saved.startAt ?? now,
          currentStageIndex: nextIndex,
          stageStartedAt: now,
        })
      );
    }
  };

  const currentStage = STAGES[currentStageIndex];
  const CurrentComponent = currentStage.component;
  const isGameStage = currentStage.id.includes('game');
  const isScoreStage = currentStage.id === 'score';

  const scoreScreenProps = useMemo(() => (
    isScoreStage ? { totalScore, highestStreak, totalTime } : {}
  ), [isScoreStage, totalScore, highestStreak, totalTime]);

  const initialRemainingMs =
    stageRemainingMs !== null
      ? stageRemainingMs
      : (currentStage.duration ?? 0);

  const renderContent = () => {
    if (isGameStage) {
      return (
        <CurrentComponent
          onNext={handleNextStage}
          initialState={{ score: sessionData.score }}
          duration={currentStage.duration}
          initialRemainingMs={initialRemainingMs}
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
          duration={currentStage.duration}
          initialRemainingMs={initialRemainingMs}
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
          key={currentStage.id}
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
