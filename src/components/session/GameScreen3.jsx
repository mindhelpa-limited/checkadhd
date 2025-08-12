"use client";
import { useEffect } from "react";

export default function GameScreen3({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 7 * 60 * 1000); // 7 minutes

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#111] text-white">
      <h1 className="text-3xl font-bold">🧠 Block Stack Game - Final Level</h1>
    </div>
  );
}
