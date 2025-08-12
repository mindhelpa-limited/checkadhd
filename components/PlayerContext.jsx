// components/PlayerContext.jsx
'use client';

import { createContext, useContext, useRef, useState, useEffect } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const value = {
    currentTrack,
    isPlaying,
    volume,
    playTrack,
    togglePlayPause,
    setVolume,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* The audio element is here, outside the main content flow */}
      {currentTrack && (
        <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      )}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}