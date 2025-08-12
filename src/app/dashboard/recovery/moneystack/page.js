'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unlock, Trophy, Volume2, VolumeX, ChevronLeft, DollarSign, Crown } from 'lucide-react';
import Confetti from 'react-confetti';
// Custom hook to replace 'react-use' to make the code self-contained
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
};

// Array of different cool-toned color gradients for each level
const LEVEL_COLORS = [
  { gradient: 'from-cyan-500 to-blue-700', border: 'border-cyan-400', hoverBg: 'bg-cyan-500' },
  { gradient: 'from-purple-500 to-indigo-700', border: 'border-purple-400', hoverBg: 'bg-purple-500' },
  { gradient: 'from-blue-500 to-purple-700', border: 'border-blue-400', hoverBg: 'bg-blue-500' },
  { gradient: 'from-teal-500 to-cyan-700', border: 'border-teal-400', hoverBg: 'bg-teal-500' },
  { gradient: 'from-fuchsia-500 to-pink-700', border: 'border-fuchsia-400', hoverBg: 'bg-fuchsia-500' },
  { gradient: 'from-indigo-500 to-blue-700', border: 'border-indigo-400', hoverBg: 'bg-indigo-500' },
  { gradient: 'from-blue-700 to-indigo-900', border: 'border-blue-400', hoverBg: 'bg-blue-500' },
];

// The LEVELS data is updated with a 'premium' flag for the new level.
const LEVELS = [
  {
    id: 1,
    title: 'Meditate',
    subtitle: 'Relax. Get centered.',
    duration: '5 mins',
    unlocked: true,
    completed: false,
    premium: false,
  },
  {
    id: 2,
    title: 'Stack Big',
    subtitle: 'Deep focus session.',
    duration: '7 mins',
    unlocked: false,
    completed: false,
    premium: false,
  },
  {
    id: 3,
    title: 'Rehydrate Fast',
    subtitle: 'Rehydration break.',
    duration: '2 mins',
    unlocked: false,
    completed: false,
    premium: false,
  },
  {
    id: 4,
    title: 'Stack Higher',
    subtitle: 'Stay sharp.',
    duration: '7 mins',
    unlocked: false,
    completed: false,
    premium: false,
  },
  {
    id: 5,
    title: 'Train Strong',
    subtitle: 'Move. Breathe.',
    duration: '2 mins',
    unlocked: false,
    completed: false,
    premium: false,
  },
  {
    id: 6,
    title: 'Stack Max',
    subtitle: 'Let’s finish strong.',
    duration: '7 mins',
    unlocked: false,
    completed: false,
    premium: false,
  },
  {
    id: 7,
    title: 'HyperFocus',
    subtitle: 'Go to the next level.',
    duration: '10 mins',
    unlocked: false,
    completed: false,
    premium: true, // This is the new premium level
  },
];

export default function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true); // Music now starts on
  const [isPremiumUser, setIsPremiumUser] = useState(true); // Simulate premium user status
  const [lotteryCounter, setLotteryCounter] = useState(1000000);

  const audioRef = useRef(null);
  const buttonClickSoundRef = useRef(null);

  const { width, height } = useWindowSize();

  // Dynamically import the custom font (for preview)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Effect to play music on component mount. This handles browser autoplay policies.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => {
        // This catch block handles cases where the browser blocks autoplay.
        // The user can still start the music manually with the button.
        console.error("Autoplay was prevented:", e);
      });
    }
    // Set up the interval for the lottery counter
    const interval = setInterval(() => {
      setLotteryCounter(prevCounter => prevCounter + Math.floor(Math.random() * 2) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const playButtonClickSound = () => {
    if (buttonClickSoundRef.current) {
      buttonClickSoundRef.current.currentTime = 0;
      buttonClickSoundRef.current.play().catch(e => console.error("Sound playback error:", e));
    }
  };

  const handleStartSessionClick = (level) => {
    if (level.premium && !isPremiumUser) {
      // Show a custom modal for premium content instead of an alert
      // For this example, we'll keep the alert for simplicity
      alert("This is a premium level! Please upgrade to access.");
      return;
    }
    playButtonClickSound();
    setShowPopup(true);
  };

  const handleConfirmStart = () => {
    setShowPopup(false);
    setShowConfetti(true);

    setTimeout(() => {
      setShowConfetti(false);
      // Simulating navigation
      console.log("Navigating to session page...");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono flex flex-col relative overflow-hidden font-orbitron selection:bg-cyan-500 selection:text-black">
      {/* Confetti component will be here */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}

      {/* Audio Elements (NOTE: You need to provide the actual audio files) */}
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-game-level-music-635.mp3" loop />
      <audio ref={buttonClickSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3" />

      {/* Header and Controls */}
      <div className="absolute top-0 left-0 right-0 p-8 z-20 flex justify-between items-center bg-transparent">
        {/* Back Button (Simulated) */}
        <motion.a
          href="#"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="p-3 rounded-full bg-gray-800 border-2 border-cyan-500 hover:bg-gray-700 transition-all shadow-lg"
          onClick={() => console.log("Simulating back navigation...")}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </motion.a>

        {/* Music Toggle Button */}
        <motion.button
          onClick={toggleMusic}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="p-3 rounded-full bg-gray-800 border-2 border-cyan-500 hover:bg-gray-700 transition-all shadow-lg"
        >
          {isMusicPlaying ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white" />}
        </motion.button>
      </div>
      
      {/* Premium Toggle Button (for demonstration) */}
      <div className="absolute top-8 right-24 z-20">
        <button
          onClick={() => setIsPremiumUser(!isPremiumUser)}
          className={`py-2 px-4 rounded-full font-bold text-sm transition-all shadow-lg ${isPremiumUser ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}
        >
          {isPremiumUser ? 'Premium Active' : 'Go Premium!'}
        </button>
      </div>

      <div className="flex flex-col items-center justify-center pt-32 pb-8 relative z-10 p-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-extrabold mb-1 uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 font-bebas"
        >
          MoneyStack
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 font-orbitron"
        >
          Build your wealth
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-center"
        >
          <p className="text-sm uppercase text-gray-400 font-bebas tracking-wide">Daily Lottery Jackpot</p>
          <motion.div 
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-3xl md:text-5xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(252,211,77,0.7)]"
          >
            {formatCurrency(lotteryCounter)}
          </motion.div>
        </motion.div>
      </div>

      {/* Trophy Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mx-8 mb-8 p-4 rounded-3xl bg-gray-800 border-2 border-cyan-500 shadow-xl flex items-center gap-4 relative z-10 backdrop-blur-md"
      >
        <Trophy className="text-yellow-400 w-8 h-8 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)] animate-pulse" />
        <div>
          <p className="text-base font-semibold text-white uppercase tracking-wider">Earn streaks and become a Field Marshall</p>
          <p className="text-sm text-gray-400">Your Daily Focus Challenge</p>
        </div>
      </motion.div>

      {/* Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 pb-8 relative z-10 flex-grow">
        <AnimatePresence>
          {LEVELS.map((level, index) => {
            const levelColor = LEVEL_COLORS[index % LEVEL_COLORS.length];
            const isUnlockedOrPremium = level.unlocked || (level.premium && isPremiumUser);
            
            return (
              <motion.div
                key={level.id}
                onClick={() => isUnlockedOrPremium ? handleStartSessionClick(level) : null}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                whileHover={{
                  scale: isUnlockedOrPremium ? 1.05 : 1,
                  boxShadow: isUnlockedOrPremium ? "0 0 20px rgba(59, 130, 246, 0.4)" : "none",
                }}
                className={`rounded-2xl p-4 shadow-xl transition-all duration-300 relative overflow-hidden group
                  ${isUnlockedOrPremium
                      ? `bg-gradient-to-br ${levelColor.gradient} border-2 ${levelColor.border} cursor-pointer`
                      : 'bg-gray-800 border-2 border-gray-600 cursor-not-allowed opacity-50'
                  }`}
              >
                <div className={`absolute inset-0 ${levelColor.hoverBg} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="flex justify-between items-center mb-2 z-10 relative">
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">Level {level.id}</h3>
                  
                  {level.premium && (
                    <motion.div 
                      className="flex items-center space-x-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.5 + index * 0.05 + 0.2 }}
                    >
                      <Crown className="w-5 h-5 text-yellow-300 animate-pulse" />
                      <span className="text-xs font-bold text-yellow-300 hidden sm:block">PRO</span>
                    </motion.div>
                  )}
                  
                  {!level.premium && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.5 + index * 0.05 + 0.2 }}
                    >
                      <DollarSign className="w-5 h-5 text-yellow-300" />
                    </motion.div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-white">{level.title}</h2>
                <p className="text-sm text-gray-200 mb-2">{level.subtitle}</p>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-white font-bold">⏱ {level.duration}</p>
                  {!isUnlockedOrPremium && (
                    <Unlock className="w-5 h-5 text-gray-400 animate-pulse" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Start Session Button */}
      <div className="sticky bottom-0 left-0 right-0 px-8 py-4 bg-transparent backdrop-blur-sm border-t border-white/10 shadow-xl relative z-10">
        <motion.button
          onClick={() => handleStartSessionClick(LEVELS[0])} // Default to starting the first level
          whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(59, 130, 246, 0.7)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold shadow-lg transform transition-all duration-200"
        >
          Start Session
        </motion.button>
      </div>

      {/* Pop-up Modal */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 p-8 rounded-2xl max-w-sm text-center border-2 border-blue-500 shadow-2xl relative"
            >
              <h2 className="text-2xl font-extrabold mb-4 text-blue-400">Ready to Play? 🎮</h2>
              <p className="text-gray-300 mb-6">
                You're about to start a session! Boost your streak and increase your rank. Once the game begins, you can't play another session today. Are you ready?
              </p>
              <div className="flex gap-4">
                <motion.button
                  onClick={() => setShowPopup(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 rounded-full bg-gray-600 hover:bg-gray-700 text-white font-semibold transition"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleConfirmStart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                >
                  Start Game
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
