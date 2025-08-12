"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, RotateCcw, ArrowLeft } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// ==========================================================
// PING PONG GAME COMPONENT (FROM YOUR ORIGINAL CODE)
// ==========================================================
const PingMoneyGame = ({ onNext, duration, db, userId, title }) => {
    // Game constants
    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 500;
    const PADDLE_WIDTH = 15;
    const PADDLE_HEIGHT = 100;
    const MONEY_SIZE = 25;

    // Game state
    const [playerPaddleY, setPlayerPaddleY] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    const [aiPaddleY, setAiPaddleY] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    const [moneyX, setMoneyX] = useState(GAME_WIDTH / 2 - MONEY_SIZE / 2);
    const [moneyY, setMoneyY] = useState(GAME_HEIGHT / 2 - MONEY_SIZE / 2);
    const [moneySpeedX, setMoneySpeedX] = useState(5);
    const [moneySpeedY, setMoneySpeedY] = useState(5);
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    
    // Convert duration prop to seconds
    const durationInSeconds = duration ? parseInt(duration) * 60 : 5 * 60;
    const [timeLeft, setTimeLeft] = useState(durationInSeconds);

    const gameLoopRef = useRef(null);
    const timerRef = useRef(null);
    const lastScoreRef = useRef(0);

    // Function to save the score to Firestore
    const saveScore = async (score) => {
        if (!db || !userId) return;
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const scoreDocRef = doc(db, `artifacts/${appId}/users/${userId}/scores`);
            await setDoc(scoreDocRef, { gameScore: score, timestamp: new Date() }, { merge: true });
            console.log("Score saved successfully!");
        } catch (error) {
            console.error("Error saving score to Firestore:", error);
        }
    };
    
    // Function to reset the game state
    const resetGame = useCallback(() => {
        if (playerScore > 0 && playerScore !== lastScoreRef.current) {
            saveScore(playerScore);
            lastScoreRef.current = playerScore;
        }

        setPlayerPaddleY(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
        setAiPaddleY(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
        setMoneyX(GAME_WIDTH / 2 - MONEY_SIZE / 2);
        setMoneyY(GAME_HEIGHT / 2 - MONEY_SIZE / 2);
        setMoneySpeedX(5 * (Math.random() > 0.5 ? 1 : -1));
        setMoneySpeedY(5 * (Math.random() > 0.5 ? 1 : -1));
        setPlayerScore(0);
        setAiScore(0);
        setGameStarted(false);
        setTimeLeft(durationInSeconds);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
    }, [durationInSeconds, playerScore, db, userId]);

    // Main game loop logic
    const gameLoop = useCallback(() => {
        // === AI PADDLE LOGIC ===
        const aiTargetY = moneyY - PADDLE_HEIGHT / 2;
        const aiSpeed = 4;
        setAiPaddleY(prevY => {
            if (prevY < aiTargetY) {
                return Math.min(GAME_HEIGHT - PADDLE_HEIGHT, prevY + aiSpeed);
            } else if (prevY > aiTargetY) {
                return Math.max(0, prevY - aiSpeed);
            }
            return prevY;
        });

        // === MONEY MOVEMENT ===
        setMoneyX(prevX => prevX + moneySpeedX);
        setMoneyY(prevY => prevY + moneySpeedY);

        // === COLLISION DETECTION ===
        if (moneyY <= 0 || moneyY + MONEY_SIZE >= GAME_HEIGHT) {
            setMoneySpeedY(prevSpeed => -prevSpeed);
        }

        if (moneyX <= PADDLE_WIDTH && moneyY > playerPaddleY && moneyY < playerPaddleY + PADDLE_HEIGHT) {
            setMoneySpeedX(prevSpeed => -prevSpeed);
        }

        if (moneyX + MONEY_SIZE >= GAME_WIDTH - PADDLE_WIDTH && moneyY > aiPaddleY && moneyY < aiPaddleY + PADDLE_HEIGHT) {
            setMoneySpeedX(prevSpeed => -prevSpeed);
        }

        // === SCORING LOGIC ===
        if (moneyX <= 0) {
            setAiScore(prevScore => prevScore + 1);
            setMoneyX(GAME_WIDTH / 2 - MONEY_SIZE / 2);
            setMoneyY(GAME_HEIGHT / 2 - MONEY_SIZE / 2);
            setMoneySpeedX(5 * (Math.random() > 0.5 ? 1 : -1));
            setMoneySpeedY(5 * (Math.random() > 0.5 ? 1 : -1));
        } 
        else if (moneyX + MONEY_SIZE >= GAME_WIDTH) {
            setPlayerScore(prevScore => prevScore + 1);
            setMoneyX(GAME_WIDTH / 2 - MONEY_SIZE / 2);
            setMoneyY(GAME_HEIGHT / 2 - MONEY_SIZE / 2);
            setMoneySpeedX(5 * (Math.random() > 0.5 ? 1 : -1));
            setMoneySpeedY(5 * (Math.random() > 0.5 ? 1 : -1));
        }
    }, [moneySpeedX, moneySpeedY, playerPaddleY, aiPaddleY, moneyY]);

    // Handle paddle movement with keyboard input for the single player
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!gameStarted) return;
            if (e.key === 'ArrowUp' && playerPaddleY > 0) {
                setPlayerPaddleY(prevY => Math.max(0, prevY - 15));
            }
            if (e.key === 'ArrowDown' && playerPaddleY + PADDLE_HEIGHT < GAME_HEIGHT) {
                setPlayerPaddleY(prevY => Math.min(GAME_HEIGHT - PADDLE_HEIGHT, prevY + 15));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playerPaddleY, gameStarted]);

    // Start the game loop and timer when the game is started
    useEffect(() => {
        if (gameStarted) {
            gameLoopRef.current = setInterval(gameLoop, 16); // ~60fps
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(gameLoopRef.current);
                        clearInterval(timerRef.current);
                        onNext({ score: playerScore, duration: durationInSeconds });
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => {
                clearInterval(gameLoopRef.current);
                clearInterval(timerRef.current);
            };
        }
    }, [gameStarted, gameLoop, onNext, playerScore, durationInSeconds]);

    const handleStartGame = () => {
        if (!gameStarted) {
            setGameStarted(true);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-200 p-4 font-sans antialiased">
            <div className="text-center mb-8">
                <h1 className="text-6xl font-bold text-green-400 tracking-wider">{title}</h1>
                <p className="text-lg text-gray-400 mt-2">Player: Arrow Keys ↑/↓</p>
            </div>

            {/* Scoreboard */}
            <div className="flex justify-around w-full max-w-4xl mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-bold text-green-300"
                >
                    Your Score: ${playerScore}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-bold text-green-300"
                >
                    AI Score: ${aiScore}
                </motion.div>
            </div>

            {/* Timer */}
            <div className="text-3xl font-bold text-blue-400 mb-4">
                Time Left: {formatTime(timeLeft)}
            </div>

            {/* Game Area */}
            <motion.div
                className="relative bg-gray-900 border-4 border-green-500 rounded-lg shadow-2xl"
                style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Player Paddle */}
                <motion.div
                    className="absolute bg-green-400 rounded-lg"
                    style={{
                        width: PADDLE_WIDTH,
                        height: PADDLE_HEIGHT,
                        left: 0,
                        top: playerPaddleY,
                    }}
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                />
                {/* AI Paddle */}
                <motion.div
                    className="absolute bg-green-400 rounded-lg"
                    style={{
                        width: PADDLE_WIDTH,
                        height: PADDLE_HEIGHT,
                        right: 0,
                        top: aiPaddleY,
                    }}
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                />
                {/* Money Ball */}
                <motion.div
                    className="absolute bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-lg rounded-full shadow-lg"
                    style={{
                        width: MONEY_SIZE,
                        height: MONEY_SIZE,
                        left: moneyX,
                        top: moneyY,
                    }}
                >
                    $
                </motion.div>
                
                {/* Start button overlay */}
                {!gameStarted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-gray-950/80 rounded-lg"
                    >
                        <motion.button
                            onClick={handleStartGame}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-6 bg-green-500 text-gray-900 rounded-full shadow-lg transition-all duration-200"
                        >
                            <Play size={48} />
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>

            {/* Controls */}
            <div className="mt-8 flex gap-4">
                <motion.button
                    onClick={handleStartGame}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-500 text-gray-900 rounded-full shadow-lg font-semibold transition-all duration-200"
                >
                    Start Game
                </motion.button>
                <motion.button
                    onClick={resetGame}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-full shadow-lg font-semibold transition-all duration-200"
                >
                    <RotateCcw size={24} /> Reset
                </motion.button>
            </div>
        </div>
    );
};

// ==========================================================
// SESSION STEP PLACEHOLDER COMPONENTS
// These are simple placeholders to match the MoneyStackSessionPage structure.
// ==========================================================
const MeditationScreen = ({ onNext }) => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-teal-400">Meditation Break</h2>
      <p className="mt-4 text-xl text-gray-300">Take a deep breath and prepare for the game.</p>
      <button
        onClick={() => onNext()}
        className="mt-8 px-6 py-3 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-500 transition-colors duration-300"
      >
        Continue to Game
      </button>
    </div>
);

const RehydrationBreakScreen = ({ onNext }) => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-teal-400">Rehydration Break</h2>
      <p className="mt-4 text-xl text-gray-300">Time to grab a drink and recharge.</p>
      <button
        onClick={() => onNext()}
        className="mt-8 px-6 py-3 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-500 transition-colors duration-300"
      >
        Continue to Game
      </button>
    </div>
);

const ExerciseBreak = ({ onNext }) => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold text-teal-400">Exercise Break</h2>
      <p className="mt-4 text-xl text-gray-300">Time to stretch and get your energy back up!</p>
      <button
        onClick={() => onNext()}
        className="mt-8 px-6 py-3 bg-teal-600 text-white font-semibold rounded-full shadow-lg hover:bg-teal-500 transition-colors duration-300"
      >
        Continue to Game
      </button>
    </div>
);

const ScoreScreen = ({ totalScore, totalGames, totalTime, sessionScores }) => {
    const formattedTime = (totalTime / 1000 / 60).toFixed(2);
    
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-5xl font-bold text-emerald-400 mb-6">Session Complete!</h2>
            <div className="grid grid-cols-2 gap-6 text-xl">
                <div className="col-span-2 p-4 bg-gray-800 rounded-lg">
                    <p className="font-semibold text-gray-300">Total Score</p>
                    <p className="text-4xl font-bold text-emerald-400">${totalScore}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="font-semibold text-gray-300">Total Games Played</p>
                    <p className="text-4xl font-bold text-emerald-400">{totalGames}</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="font-semibold text-gray-300">Total Time Played</p>
                    <p className="text-4xl font-bold text-emerald-400">{formattedTime} min</p>
                </div>
                <div className="col-span-2 p-4 bg-gray-800 rounded-lg">
                    <p className="font-semibold text-gray-300">Scores per Game</p>
                    <ul className="text-left mt-2 space-y-2">
                        {Object.keys(sessionScores).map(key => (
                            <li key={key} className="flex justify-between items-center text-lg">
                                <span className="text-gray-400 font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                <span className="text-green-300 font-bold">${sessionScores[key]}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// ==========================================================
// SESSION MANAGER COMPONENT (BASED ON YOUR MONEYSTACK CODE)
// ==========================================================
const STAGES = [
    { id: 'meditation', component: MeditationScreen, duration: 5 * 60 * 1000 },
    { id: 'game1', component: PingMoneyGame, duration: 7 * 60 * 1000 },
    { id: 'rehydration', component: RehydrationBreakScreen, duration: 2 * 60 * 1000 },
    { id: 'game2', component: PingMoneyGame, duration: 7 * 60 * 1000 },
    { id: 'exercise', component: ExerciseBreak, duration: 2 * 60 * 1000 },
    { id: 'game3', component: PingMoneyGame, duration: 7 * 60 * 1000 },
    { id: 'score', component: ScoreScreen, duration: null },
];

function PingPongSessionPage({ db, userId }) {
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [sessionData, setSessionData] = useState({
        totalScore: 0,
        totalGames: 0,
        totalTime: 0,
        sessionScores: {},
    });

    // This function handles the transition to the next stage and saves the game state
    const handleNextStage = (updatedState = {}) => {
        const prevStage = STAGES[currentStageIndex];
        const prevStageId = prevStage.id;

        // If the previous stage was a game, update the session data and metrics
        if (prevStageId.includes('game')) {
            setSessionData(prev => ({
                ...prev,
                totalScore: prev.totalScore + updatedState.score,
                totalGames: prev.totalGames + 1,
                totalTime: prev.totalTime + updatedState.duration,
                sessionScores: {
                    ...prev.sessionScores,
                    [prevStageId]: updatedState.score,
                },
            }));
        }

        // Move to the next stage in the sequence
        if (currentStageIndex < STAGES.length - 1) {
            setCurrentStageIndex(prevIndex => prevIndex + 1);
        } else {
            console.log("Session complete! Final data:", sessionData);
        }
    };

    const CurrentComponent = STAGES[currentStageIndex].component;
    const isGameStage = STAGES[currentStageIndex].id.includes('game');
    const isScoreStage = STAGES[currentStageIndex].id === 'score';

    const scoreScreenProps = useMemo(() => {
        if (isScoreStage) {
            return {
                totalScore: sessionData.totalScore,
                totalGames: sessionData.totalGames,
                totalTime: sessionData.totalTime,
                sessionScores: sessionData.sessionScores,
            };
        }
        return {};
    }, [isScoreStage, sessionData]);

    return (
        <div className="relative min-h-screen bg-gray-950 text-white overflow-hidden p-8 flex items-center justify-center font-sans">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStageIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="h-[80vh] w-full max-w-2xl"
                >
                    {isGameStage ? (
                        <CurrentComponent
                            onNext={handleNextStage}
                            duration={STAGES[currentStageIndex].duration}
                            title={`Ping Pong Session Game ${currentStageIndex / 2 + 1}`}
                            db={db}
                            userId={userId}
                        />
                    ) : isScoreStage ? (
                        <ScoreScreen {...scoreScreenProps} />
                    ) : (
                        <CurrentComponent
                            onNext={handleNextStage}
                            sessionScores={sessionData.sessionScores}
                            title={STAGES[currentStageIndex].id}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// ==========================================================
// MAIN APP COMPONENT - Handles Firebase and renders the session
// ==========================================================
export default function App() {
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        if (typeof __firebase_config === 'undefined' || typeof __initial_auth_token === 'undefined') {
            console.error("Firebase global variables are not defined. The app may not function correctly.");
            setIsAuthReady(true);
            return;
        }

        const firebaseConfig = JSON.parse(__firebase_config);
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);

        setDb(firestoreDb);

        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                try {
                    await signInWithCustomToken(firebaseAuth, __initial_auth_token);
                    if (firebaseAuth.currentUser) {
                        setUserId(firebaseAuth.currentUser.uid);
                    }
                } catch (error) {
                    console.error("Firebase Auth Error:", error);
                    await signInAnonymously(firebaseAuth);
                    if (firebaseAuth.currentUser) {
                        setUserId(firebaseAuth.currentUser.uid);
                    }
                }
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <p>Loading session...</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-950 min-h-screen flex items-center justify-center">
            <PingPongSessionPage db={db} userId={userId} />
        </div>
    );
}
