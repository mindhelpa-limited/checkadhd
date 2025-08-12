"use client";

import { useState } from "react";
import MeditationScreen from "@/components/session/MeditationScreen";
import GameScreen1 from "@/components/session/GameScreen1";
import BreakScreen from "@/components/session/BreakScreen";
import GameScreen2 from "@/components/session/GameScreen2";
import ExerciseBreak from "@/components/session/ExerciseBreak";
import GameScreen3 from "@/components/session/GameScreen3";

export default function SessionPage() {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const screens = [
    <MeditationScreen key="meditation" onNext={nextStep} />,
    <GameScreen1 key="game1" onNext={nextStep} />,
    <BreakScreen key="break1" onNext={nextStep} />,
    <GameScreen2 key="game2" onNext={nextStep} />,
    <ExerciseBreak key="break2" onNext={nextStep} />,
    <GameScreen3 key="game3" onNext={() => alert("🎉 Session complete! Great job.")} />,
  ];

  return <>{screens[step]}</>;
}