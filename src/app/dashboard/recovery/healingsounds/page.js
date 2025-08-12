'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// This is the new list of your music files located in the public/healingsounds folder
// with simplified titles.
const musicTracks = [
  { id: 1, title: 'Rain Fall', src: '/healingsounds/rain-fall-SBA-300156734.mp3', plays: '3K' },
  { id: 2, title: 'Rain in Forest Ambience', src: '/healingsounds/rain-in-forest-ambience-SBA-300282361.mp3', plays: '12K' },
  { id: 3, title: 'Light Steady Rain Ambience Loop', src: '/healingsounds/rain-light-steady-ambience-loop-SBA-300138240.mp3', plays: '8K' },
  { id: 4, title: 'Rain on Window Glass', src: '/healingsounds/rain-on-window-glass-SBA-300282365.mp3', plays: '15K' },
  { id: 5, title: 'Sleeping Aid Thunderstorm', src: '/healingsounds/sleeping-aid-thunderstorm-SBA-300283330.mp3', plays: '22K' },
  { id: 6, title: 'Heavy Downpour Thunderstorm Rain', src: '/healingsounds/thunderstorm-rain-heavy-down-pour-SBA-300115024.wav', plays: '18K' },
];

export default function TherapyMusicPage() {
  // State to manage the currently selected track and its playing status
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // useRef to hold the audio element, allowing us to control it without re-renders
  const audioRef = useRef(null);

  // Initialize the audio element once when the component mounts
  useEffect(() => {
    audioRef.current = new Audio();
    // ** MODIFIED LOGIC **
    // Set the loop property to true so the track plays continuously
    audioRef.current.loop = true;
    
    // Event listener for updating the progress bar
    const updateProgress = () => {
      const { currentTime, duration } = audioRef.current;
      setProgress((currentTime / duration) * 100 || 0);
    };

    audioRef.current.addEventListener('timeupdate', updateProgress);

    // Cleanup function to pause and clear the audio when the component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current = null;
      }
    };
  }, []);

  // Effect to handle track changes (load new track and play)
  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Audio playback failed:", error);
        // Fallback to paused state if autoplay is blocked
        setIsPlaying(false);
      });
    }
  }, [currentTrack]); // This effect only runs when a new track is selected

  // Effect to handle play/pause state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Play failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]); // This effect only runs when the play/pause state is toggled

  // Handler for playing/pausing the current track from the main play button
  const handleMainPlayPause = () => {
    if (!currentTrack) {
      // If no track is playing, start with the first one
      setCurrentTrack(musicTracks[0]);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Handler for when a track in the list is clicked
  const handleTrackClick = (track) => {
    if (currentTrack && currentTrack.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-8 relative overflow-hidden">
      {/* Background radial gradient for a premium feel */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 to-gray-950 opacity-50 z-0"></div>

      {/* Main container with padding and max width */}
      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row items-center md:items-start mb-16 space-y-8 md:space-y-0 md:space-x-12"
        >
          {/* Album Art with Animation and Glow */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-72 h-72 rounded-3xl overflow-hidden shadow-2xl transition-shadow duration-300 transform-gpu"
            style={{ boxShadow: '0 0 40px rgba(0, 150, 255, 0.3)' }}
          >
            <Image
              src="/images/therapy.jpg"
              alt="Album art"
              layout="fill"
              objectFit="cover"
              className="brightness-90 transition-transform duration-500"
            />
          </motion.div>

          {/* Album Details and Controls */}
          <div className="flex-1 text-center md:text-left mt-6 md:mt-0">
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold mb-2 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Healing Sounds
            </motion.h1>
            <motion.p
              className="text-gray-400 text-lg mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Sounds • 2024
            </motion.p>
            <motion.p
              className="text-gray-400 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {musicTracks.length} songs • {Math.round(musicTracks.length * 3.5)} minutes
            </motion.p>
            
            {/* Control Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center justify-center md:justify-start mt-8 space-x-6"
            >
              <button 
                onClick={handleMainPlayPause}
                className="p-5 rounded-full bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-xl transform-gpu hover:scale-105"
              >
                {isPlaying && currentTrack ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4.004a1 1 0 001.555.832l3.86-2.002a1 1 0 000-1.664l-3.86-2.002z" />
                  </svg>
                )}
              </button>
              <button className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors shadow-lg transform-gpu hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button className="p-4 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors shadow-lg transform-gpu hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Playlist Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-4"
        >
          {musicTracks.map((track) => (
            <motion.div
              key={track.id}
              onClick={() => handleTrackClick(track)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: track.id * 0.05 }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
              className={`cursor-pointer p-5 rounded-2xl transition-all duration-300 flex items-center shadow-lg transform-gpu
                ${currentTrack?.id === track.id ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/50' : 'bg-gray-800 hover:bg-gray-700/50'}
              `}
            >
              <span className="w-8 text-center font-bold">
                {currentTrack?.id === track.id ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-5 h-5 mx-auto bg-white rounded-full"
                  />
                ) : (
                  track.id
                )}
              </span>
              <div className="flex-1 mx-4">
                <span className="font-semibold text-lg">{track.title}</span>
              </div>
              <span className="text-gray-300 text-sm">{track.plays} plays</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Now Playing Footer */}
        <AnimatePresence>
          {currentTrack && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 shadow-2xl border-t border-gray-700"
            >
              <div className="max-w-5xl mx-auto flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/images/therapy.jpg"
                      alt="Album art"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{currentTrack.title}</h3>
                    <p className="text-xs text-gray-400">Now Playing</p>
                  </div>
                </div>

                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="bg-blue-500 h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1, ease: "linear" }}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleMainPlayPause} 
                  className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
                >
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4.004a1 1 0 001.555.832l3.86-2.002a1 1 0 000-1.664l-3.86-2.002z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Style for the custom scrollbar */}
      <style jsx global>{`
        body::-webkit-scrollbar {
          width: 8px;
        }
        body::-webkit-scrollbar-track {
          background: #111827;
        }
        body::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border-radius: 4px;
        }
        body::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}