"use client";
import { useEffect } from "react";

export default function BreakScreen({ onNext }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="h-screen w-full bg-[#0a122a] text-white flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Hydration Break 💧</h1>
      <p className="text-lg max-w-xl">Take a sip of water. Let your brain recharge for the next level.</p>
    </div>
  );
}
