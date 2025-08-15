'use client';

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import meditationData from "./meditationData"; // ✅ Importing your meditation data

export default function MeditationScreen({
  onNext,
  duration = 5 * 60 * 1000,          // default 5 minutes (ms)
  initialRemainingMs,                 // optional resume point (ms)
}) {
  // ----- TIMER: use ms-based countdown so we can resume precisely -----
  const startMs = typeof initialRemainingMs === 'number' && initialRemainingMs >= 0
    ? initialRemainingMs
    : duration;

  const [timeLeftMs, setTimeLeftMs] = useState(startMs);
  const [timerRunning, setTimerRunning] = useState(true);

  useEffect(() => {
    if (!timerRunning) return;

    if (timeLeftMs <= 0) {
      setTimerRunning(false);
      onNext?.();
      return;
    }

    const endAt = Date.now() + timeLeftMs;
    const id = setInterval(() => {
      const left = endAt - Date.now();
      if (left <= 0) {
        clearInterval(id);
        setTimeLeftMs(0);
        setTimerRunning(false);
        onNext?.();
      } else {
        setTimeLeftMs(left);
      }
    }, 250);

    return () => clearInterval(id);
  }, [timerRunning, timeLeftMs, onNext]);

  const mm = Math.floor(Math.max(0, timeLeftMs) / 60000);
  const ss = String(Math.floor((Math.max(0, timeLeftMs) % 60000) / 1000)).padStart(2, '0');

  // ----- AUDIO / VIDEO (unchanged, just works as before) -----
  const voiceoverAudioRef = useRef(null);
  const backgroundAudioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // 0.0 to 1.0
  const [isMediaLoaded, setIsMediaLoaded] = useState({ voiceover: false, background: false, video: false });

  const videoRef = useRef(null);
  const [mediaError, setMediaError] = useState(false);

  const meditation = meditationData[0];

  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = volume;
      backgroundAudioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isMediaLoaded.voiceover && isMediaLoaded.background && isMediaLoaded.video) {
      // Autoplay when all media are ready
      try { voiceoverAudioRef.current?.play(); } catch {}
      try { backgroundAudioRef.current?.play(); } catch {}
      try { videoRef.current?.play(); } catch {}
    }
  }, [isMediaLoaded]);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (backgroundAudioRef.current) backgroundAudioRef.current.volume = newVolume;
    if (newVolume > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => setIsMuted(v => !v);
  const handleMediaLoad = (type) => setIsMediaLoaded(prev => ({ ...prev, [type]: true }));
  const handleMediaError = () => setMediaError(true);

  const isLoading = !isMediaLoaded.voiceover || !isMediaLoaded.background || !isMediaLoaded.video;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/sea.mp4"
        loop
        muted
        playsInline
        onLoadedData={() => handleMediaLoad('video')}
        onError={handleMediaError}
      />

      {/* Overlay to darken the video for readability */}
      <div className="absolute inset-0 bg-black opacity-60 z-10" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 flex flex-col items-center justify-center text-white text-center p-8 md:p-12 bg-gray-900/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-700 w-full max-w-xl"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 tracking-wide">
          {meditation.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Find your focus for the next five minutes.
        </p>

        {mediaError && (
          <p className="text-red-400 mb-4">Error: Could not load media. Please check file paths.</p>
        )}

        {/* Timer Display and Loading Spinner */}
        <div className="mb-8 flex items-center justify-center h-24">
          {isLoading ? (
            <Loader2 size={80} className="text-white animate-spin" />
          ) : (
            <motion.p
              key={mm + ":" + ss}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl md:text-9xl font-mono font-bold tracking-tighter"
            >
              {String(mm).padStart(2,'0')}:{ss}
            </motion.p>
          )}
        </div>

        {/* Music Controls */}
        <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-full shadow-inner w-full max-w-xs">
          <button onClick={toggleMute} className="p-2 text-gray-400 hover:text-white transition">
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            disabled={isLoading || mediaError}
          />
        </div>
      </motion.div>

      {/* Hidden Audio Elements */}
      <audio
        ref={voiceoverAudioRef}
        src={meditation.audioPath}
        onLoadedData={() => handleMediaLoad('voiceover')}
        onError={handleMediaError}
      />
      <audio
        ref={backgroundAudioRef}
        src="/meditation.mp3"
        loop
        onLoadedData={() => handleMediaLoad('background')}
        onError={handleMediaError}
      />
    </div>
  );
}
