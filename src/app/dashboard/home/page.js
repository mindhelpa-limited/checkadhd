"use client";

import { useEffect, useState, useRef } from "react";
import Link from 'next/link';
// Importing specific icons from 'react-icons/fa'
import { FaGraduationCap, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

// --- Inspirational Slides ---
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

// --- Component ---
export default function QuotesShowcase() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Auto-slide effect for the quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Handler to toggle the background music
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Autoplay prevented:", error);
          setIsPlaying(true); 
          alert("Music blocked by browser policy. Please click the Calm icon again to start playback.");
        });
      }
    }
  };

  // Styles for the dark, midnight aesthetic
  const containerClass = "relative w-screen h-screen overflow-hidden text-white bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-950";
  
  // The card position is near the top
  const quoteCardContainerClass = "relative flex items-start justify-center w-full h-full p-8 pt-8"; 
  
  const quoteCardClass = "max-w-3xl text-center bg-indigo-900/40 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl shadow-indigo-500/20 border border-indigo-700/50";
  
  // Icon box layout with small margin-top for separation
  const iconBoxLayoutClass = "flex space-x-8 p-4 bg-black/70 rounded-lg shadow-xl border border-teal-500/30 mt-4 z-20";
  const iconBaseClass = "text-2xl md:text-3xl cursor-pointer transition-transform duration-300 hover:scale-110";

  return (
    <div className={containerClass}>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* --- Main Content Area (Quote and Icons) --- */}
      <div className={quoteCardContainerClass}>
        <div className="flex flex-col items-center">
            
            {/* Quote Card - Main text content */}
            <div className={quoteCardClass}>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed font-medium transition-all duration-500 ease-in-out text-gray-200">
                {slides[index]}
              </p>
            </div>

            {/* --- Icon Box Layout --- */}
            <div className={iconBoxLayoutClass}>
                
                {/* 1. Certified Coach Icon (Navigation Link) */}
                <Link href="/dashboard/institute" passHref legacyBehavior>
                    <a className="flex flex-col items-center justify-center w-28 h-20 group">
                        <FaGraduationCap className={`${iconBaseClass} text-fuchsia-400 group-hover:text-white`} />
                        <span className="mt-1 text-xs text-gray-400 group-hover:text-fuchsia-400 transition-colors font-semibold text-center">Certified Coach</span>
                    </a>
                </Link>

                {/* Vertical Separator for visual square layout */}
                <div className="w-px bg-slate-700/50 my-2"></div>

                {/* 2. Calm Icon (Music Toggle) */}
                <div onClick={toggleMusic} className="flex flex-col items-center justify-center w-28 h-20 group cursor-pointer">
                    {isPlaying ? (
                        // Icon when music is ON
                        <FaVolumeUp className={`${iconBaseClass} text-teal-400 animate-pulse`} />
                    ) : (
                        // Icon when music is OFF
                        <FaVolumeMute className={`${iconBaseClass} text-gray-400`} />
                    )}
                    <span className={`mt-1 text-xs font-semibold transition-colors ${isPlaying ? 'text-teal-400' : 'text-gray-400 group-hover:text-white'} text-center`}>
                        {isPlaying ? 'Calm (On)' : 'Calm'}
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* --- Background Audio Element --- */}
      <audio 
        ref={audioRef}
        src="/meditation.mp3" 
        loop 
      />
    </div>
  );
}