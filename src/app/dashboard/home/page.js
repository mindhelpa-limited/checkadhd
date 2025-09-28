"use client";

import { useEffect, useState } from "react";

const slides = [
  "You are not alone, even when the night feels heavy. Your strength is still alive, carrying you forward. Every breath you take is proof of resilience. Light has not left you; it waits inside. You are more powerful than the silence around you.",
  "Greatness lives within you, steady and unshaken. Pain may visit, but it cannot erase your worth. Every step forward is a victory already won. Hope does not abandon the brave. You are the proof that courage breathes in human form.",
  "Your story is not finished, it is unfolding. Every struggle you survived has built your foundation. You carry wisdom where others would have fallen. Even in the quiet, your life speaks loudly. You are becoming more with every sunrise.",
  "You are stronger than the doubts that chase you. Fear cannot control the one who keeps moving. Your presence carries weight and meaning. Even broken pieces shine when the light returns. You are whole, even when you feel scattered.",
  "The world is brighter because you are here. Your heart holds more resilience than it knows. Loneliness cannot erase your connection to life. Your worth is not up for debate; it is eternal. You are seen, valued, and needed in this moment.",
  "You are not defined by struggle. You are defined by the way you rise from it. Strength has always been your quiet companion. Peace is closer than the noise that hides it. You are living proof that hope never dies.",
  "Calm is not weakness, it is strength under control. In stillness you gather the energy to rise higher. Every pause is power disguised as peace. You are steady, you are clear, you are unshaken.",
  "Every scar tells a story of survival. What tried to break you only revealed your resilience. Strength is stitched into your being. You are not broken — you are rebuilt, sharper and stronger.",
  "The future is not against you — it waits for you. Each sunrise brings a fresh page to write on. Your presence already proves you belong here. You are becoming exactly who you were meant to be.",
  "Hope is never absent — it whispers in every breath. Darkness cannot bury it, storms cannot drown it. You carry light within you, unshakable and real. The world still needs the fire you bring."
];

export default function QuotesShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* Background Video */}
      {/* NOTE: The video source is likely relative to the public directory in a Next.js app. */}
      <video
        src="/videos/sea.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Background Music */}
      {/* NOTE: Audio source is relative to the public directory. */}
      <audio src="/meditation.mp3" autoPlay loop />

      {/* Quote Card */}
      {/* ORIGINAL: <div className="relative flex items-start justify-center w-full h-full p-8 pt-32">
        MODIFIED: Use 'pt-16' (a smaller padding) for mobile by default, and 'lg:pt-32' to restore the larger padding on larger screens.
      */}
      <div className="relative flex items-start justify-center w-full h-full p-8 pt-16 lg:pt-32">
        <div className="max-w-3xl text-center bg-black/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg">
          <p className="text-base sm:text-lg md:text-xl leading-relaxed font-medium transition-all duration-500 ease-in-out">
            {slides[index]}
          </p>
        </div>
      </div>
    </div>
  );
}