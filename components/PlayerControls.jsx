// components/PlayerControls.jsx
'use client';

import { usePlayer } from './PlayerContext';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';

export default function PlayerControls() {
  const { currentTrack, isPlaying, togglePlayPause, volume, setVolume } = usePlayer();

  if (!currentTrack) {
    return null; // Don't render the player if no track is selected
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex items-center justify-between z-50">
      <div className="flex items-center">
        <h3 className="text-sm font-semibold">{currentTrack.title}</h3>
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={togglePlayPause} className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>
      <div className="flex items-center space-x-2 w-32">
        <FaVolumeUp />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}