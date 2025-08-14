'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Unlock, Volume2, VolumeX, ChevronLeft, DollarSign } from 'lucide-react';
import Confetti from 'react-confetti';

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

const LEVEL_COLORS = [
    { gradient: 'from-purple-500 to-indigo-700', border: 'border-purple-400', hoverBg: 'bg-purple-500' }, // Level 1 (new)
    { gradient: 'from-purple-500 to-indigo-700', border: 'border-purple-400', hoverBg: 'bg-purple-500' }, // Level 2 (original)
    { gradient: 'from-blue-500 to-purple-700', border: 'border-blue-400', hoverBg: 'bg-blue-500' },
    { gradient: 'from-teal-500 to-cyan-700', border: 'border-teal-400', hoverBg: 'bg-teal-500' },
    { gradient: 'from-fuchsia-500 to-pink-700', border: 'border-fuchsia-400', hoverBg: 'bg-fuchsia-500' },
    { gradient: 'from-indigo-500 to-blue-700', border: 'border-indigo-400', hoverBg: 'bg-indigo-500' },
    { gradient: 'from-purple-500 to-indigo-700', border: 'border-purple-400', hoverBg: 'bg-purple-500' }, // Level 7 (new)
];

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
        premium: true,
    },
];

export default function App() {
    const [showPopup, setShowPopup] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(true);
    const [isPremiumUser, setIsPremiumUser] = useState(true); 
    const [lotteryCounter, setLotteryCounter] = useState(1000000);
    const [countdown, setCountdown] = useState(null);

    const audioRef = useRef(null);
    const buttonClickSoundRef = useRef(null);
    const countdownSoundRef = useRef(null);

    const { width, height } = useWindowSize();
    const router = useRouter();

    useEffect(() => {
        const link = document.createElement('link');
        link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Orbitron:wght@400;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(e => {
                console.error("Autoplay was prevented:", e);
            });
        }
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
            alert("This is a premium level! Please upgrade to access.");
            return;
        }
        playButtonClickSound();
        setShowPopup(true);
    };

    const handleConfirmStart = () => {
        setShowPopup(false);
        setCountdown(3);

        const countdownInterval = setInterval(() => {
            setCountdown(prev => {
                const nextCount = prev - 1;
                if (nextCount > 0) {
                    if (countdownSoundRef.current) {
                        countdownSoundRef.current.currentTime = 0;
                        countdownSoundRef.current.play();
                    }
                    return nextCount;
                } else {
                    clearInterval(countdownInterval);
                    setCountdown(null);
                    router.push('/dashboard/recovery/moneystack/session');
                    return null;
                }
            });
        }, 1000);
    };

    return (
        <div className="min-h-screen text-white font-mono flex flex-col relative overflow-hidden font-orbitron selection:bg-cyan-500 selection:text-black" style={{ backgroundImage: `url('/images/blockstack.png')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
            {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}

            <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-game-level-music-635.mp3" loop />
            <audio ref={buttonClickSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3" />
            <audio ref={countdownSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-bleep-967.mp3" />

            <div className="absolute top-0 left-0 right-0 p-8 z-20 flex justify-between items-center bg-transparent">
                <motion.button
                    onClick={() => router.back()}
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="p-3 rounded-full bg-gray-800 border-2 border-cyan-500 hover:bg-gray-700 transition-all shadow-lg"
                >
                    <ChevronLeft className="w-5 h-5 text-white" />
                </motion.button>

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
            
            <div className="flex flex-col items-center justify-center pt-32 pb-8 relative z-10 p-6 bg-black/50">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-6xl font-extrabold mb-1 uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 font-bebas drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] text-shadow-md"
                >
                    <strong className="font-extrabold">MoneyStack</strong>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-yellow-300 font-orbitron text-shadow-md"
                >
                    <strong className="font-extrabold">Build your wealth</strong>
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-4 text-center"
                >
                    <motion.div 
                        initial={{ y: -5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="text-3xl md:text-5xl font-extrabold text-yellow-400 drop-shadow-[0_0_10px_rgba(252,211,77,0.7)] text-shadow-lg"
                    >
                        <strong className="font-extrabold">{formatCurrency(lotteryCounter)}</strong>
                    </motion.div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 pb-20 relative z-10 flex-grow">
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
                                    rotate: isUnlockedOrPremium ? 1 : 0,
                                    y: isUnlockedOrPremium ? -5 : 0
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

            <div className="fixed bottom-0 left-0 right-0 px-8 py-4 bg-transparent backdrop-blur-sm border-t border-white/10 shadow-xl z-20">
                <motion.button
                    onClick={() => handleStartSessionClick(LEVELS[0])}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(59, 130, 246, 0.7)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold shadow-lg transform transition-all duration-200"
                >
                    Start Session
                </motion.button>
            </div>
            
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

            <AnimatePresence>
                {countdown !== null && (
                    <motion.div
                        key="countdown-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]"
                    >
                        <motion.div
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 1.5, opacity: 0, rotate: 180 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                duration: 0.5,
                            }}
                            className="text-9xl font-extrabold text-white text-shadow-lg"
                        >
                            {countdown > 0 ? countdown : 'GO!'}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}