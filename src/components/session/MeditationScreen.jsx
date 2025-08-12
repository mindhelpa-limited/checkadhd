'use client';

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import meditationData from "./meditationData"; // ✅ Importing your meditation data

export default function MeditationScreen({ onNext }) {
  // Timer state for the 5-minute countdown
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true); // 💡 The timer starts automatically

  // Audio refs for both voiceover and background music
  const voiceoverAudioRef = useRef(null);
  const backgroundAudioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // 0.0 to 1.0
  const [isMediaLoaded, setIsMediaLoaded] = useState({ voiceover: false, background: false, video: false });

  // Video background ref
  const videoRef = useRef(null);
  const [mediaError, setMediaError] = useState(false);

  // Use the first meditation entry for the session
  const meditation = meditationData[0];

  // Effect to handle the 5-minute timer
  useEffect(() => {
    if (timerRunning) {
      const timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        }
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            setTimerRunning(false);
            if (onNext) {
              onNext();
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerRunning, minutes, seconds, onNext]);

  // Effect to manage background music volume and mute status
  useEffect(() => {
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = volume;
      backgroundAudioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // New useEffect to start the media automatically once all files are loaded
  useEffect(() => {
    if (isMediaLoaded.voiceover && isMediaLoaded.background && isMediaLoaded.video) {
      if (voiceoverAudioRef.current) voiceoverAudioRef.current.play();
      if (backgroundAudioRef.current) backgroundAudioRef.current.play();
      if (videoRef.current) videoRef.current.play();
    }
  }, [isMediaLoaded]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleMediaLoad = (type) => {
    setIsMediaLoaded(prev => ({ ...prev, [type]: true }));
  };

  const handleMediaError = () => {
    setMediaError(true);
  };

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
              key={minutes + ":" + seconds}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl md:text-9xl font-mono font-bold tracking-tighter"
            >
              {formatTime(minutes)}:{formatTime(seconds)}
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
