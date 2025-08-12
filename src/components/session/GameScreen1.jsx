"use client";
import { useEffect } from "react";

export default function GameScreen1({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 7 * 60 * 1000); // 7 minutes

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#000] text-white">
      <h1 className="text-3xl font-bold">🧠 Block Stack Game - Level 1</h1>
    </div>
  );
}
