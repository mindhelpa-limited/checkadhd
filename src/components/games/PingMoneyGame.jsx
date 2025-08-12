"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Award } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 25;
const INITIAL_BALL_SPEED = 5;
const AI_PADDLE_SPEED = 5;

// SVG for the ping-pong paddle, with a more modern, minimal design
const PingPongPaddleSVG = ({ color }) => (
    <svg width={PADDLE_WIDTH} height={PADDLE_HEIGHT} viewBox="0 0 15 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="15" height="100" fill={color} rx="7" ry="7"/>
    </svg>
);

// Main game component
const PingPongGame = ({ onGameEnd, duration, db, userId }) => {
    // Game state using a single object for easier state management in the game loop
    const [gameState, setGameState] = useState({
        playerPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        aiPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        ballX: GAME_WIDTH / 2 - BALL_SIZE / 2,
        ballY: GAME_HEIGHT / 2 - BALL_SIZE / 2,
        ballSpeedX: INITIAL_BALL_SPEED,
        ballSpeedY: INITIAL_BALL_SPEED,
        playerScore: 0,
        aiScore: 0,
        gameStarted: false,
        gameOver: false,
        showInstructions: true,
    });
    const [timeLeft, setTimeLeft] = useState(duration * 60);

    const gameLoopRef = useRef(null);
    const timerRef = useRef(null);
    const playerPaddleYRef = useRef(gameState.playerPaddleY);
    const touchYRef = useRef(null);
    
    // Update ref with state for use in game loop
    useEffect(() => {
        playerPaddleYRef.current = gameState.playerPaddleY;
    }, [gameState.playerPaddleY]);

    // Function to save the score to Firestore
    const saveScore = useCallback(async (score) => {
        if (!db || !userId || score === 0) return;
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const scoreDocRef = doc(db, `artifacts/${appId}/users/${userId}/scores`);
            // Use setDoc with merge: true to avoid overwriting other data in the document
            await setDoc(scoreDocRef, { score, timestamp: new Date() }, { merge: true });
            console.log("Score saved successfully!");
        } catch (error) {
            console.error("Error saving score to Firestore:", error);
        }
    }, [db, userId]);
    
    // Resets the game state to its initial values
    const resetGame = useCallback(() => {
        // Save score if the game was just finished
        if (gameState.gameOver && gameState.playerScore > 0) {
            saveScore(gameState.playerScore);
        }

        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
        if (timerRef.current) clearInterval(timerRef.current);

        setGameState({
            playerPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            aiPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            ballX: GAME_WIDTH / 2 - BALL_SIZE / 2,
            ballY: GAME_HEIGHT / 2 - BALL_SIZE / 2,
            ballSpeedX: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
            ballSpeedY: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
            playerScore: 0,
            aiScore: 0,
            gameStarted: false,
            gameOver: false,
            showInstructions: true,
        });
        setTimeLeft(duration * 60);
    }, [duration, gameState, saveScore]);

    // Main game update logic, using requestAnimationFrame for smoothness
    const gameLoop = useCallback(() => {
        setGameState(prevState => {
            const newState = { ...prevState };

            // === AI PADDLE LOGIC (more dynamic) ===
            const aiTargetY = newState.ballY - PADDLE_HEIGHT / 2;
            const aiSpeed = AI_PADDLE_SPEED;
            if (newState.aiPaddleY < aiTargetY) {
                newState.aiPaddleY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newState.aiPaddleY + aiSpeed);
            } else if (newState.aiPaddleY > aiTargetY) {
                newState.aiPaddleY = Math.max(0, newState.aiPaddleY - aiSpeed);
            }

            // === BALL MOVEMENT ===
            newState.ballX += newState.ballSpeedX;
            newState.ballY += newState.ballSpeedY;

            // === COLLISION DETECTION ===
            // Top and bottom wall collision
            if (newState.ballY <= 0 || newState.ballY + BALL_SIZE >= GAME_HEIGHT) {
                newState.ballSpeedY *= -1;
                // Snap to boundary to prevent sticking
                newState.ballY = newState.ballY <= 0 ? 0 : GAME_HEIGHT - BALL_SIZE;
            }

            // Player paddle collision
            if (
                newState.ballX <= PADDLE_WIDTH &&
                newState.ballY + BALL_SIZE > playerPaddleYRef.current &&
                newState.ballY < playerPaddleYRef.current + PADDLE_HEIGHT
            ) {
                // Change ball speed and direction
                newState.ballSpeedX *= -1.1; // Increase speed slightly
                newState.ballSpeedX = Math.min(newState.ballSpeedX, 15); // Cap the speed
                // Snap to paddle's edge to prevent sticking
                newState.ballX = PADDLE_WIDTH;
            }

            // AI paddle collision
            if (
                newState.ballX + BALL_SIZE >= GAME_WIDTH - PADDLE_WIDTH &&
                newState.ballY + BALL_SIZE > newState.aiPaddleY &&
                newState.ballY < newState.aiPaddleY + PADDLE_HEIGHT
            ) {
                newState.ballSpeedX *= -1.1; // Increase speed
                newState.ballSpeedX = Math.max(newState.ballSpeedX, -15); // Cap the speed
                // Snap to paddle's edge to prevent sticking
                newState.ballX = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE;
            }

            // === SCORING LOGIC ===
            if (newState.ballX <= 0) {
                newState.aiScore++;
                // Reset ball position and speed after a score
                newState.ballX = GAME_WIDTH / 2 - BALL_SIZE / 2;
                newState.ballY = GAME_HEIGHT / 2 - BALL_SIZE / 2;
                newState.ballSpeedX = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
                newState.ballSpeedY = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
            } 
            else if (newState.ballX + BALL_SIZE >= GAME_WIDTH) {
                newState.playerScore++;
                // Reset ball position and speed after a score
                newState.ballX = GAME_WIDTH / 2 - BALL_SIZE / 2;
                newState.ballY = GAME_HEIGHT / 2 - BALL_SIZE / 2;
                newState.ballSpeedX = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
                newState.ballSpeedY = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
            }
            
            return newState;
        });
        
        // Request the next frame
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, []);

    // Handle keyboard input for player paddle movement
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!gameState.gameStarted) return;
            const moveSpeed = 15;
            setGameState(prevState => {
                const newY = prevState.playerPaddleY;
                if (e.key === 'ArrowUp' || e.key === 'w') {
                    return { ...prevState, playerPaddleY: Math.max(0, newY - moveSpeed) };
                }
                if (e.key === 'ArrowDown' || e.key === 's') {
                    return { ...prevState, playerPaddleY: Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newY + moveSpeed) };
                }
                return prevState;
            });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState.gameStarted]);

    // Handle touch/swipe input for player paddle movement on mobile
    useEffect(() => {
        const handleTouchStart = (e) => {
            if (!gameState.gameStarted) return;
            e.preventDefault();
            touchYRef.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            if (!gameState.gameStarted || !touchYRef.current) return;
            e.preventDefault();
            const currentTouchY = e.touches[0].clientY;
            const deltaY = currentTouchY - touchYRef.current;
            const newY = playerPaddleYRef.current + deltaY;
            setGameState(prevState => ({
                ...prevState,
                playerPaddleY: Math.min(Math.max(0, newY), GAME_HEIGHT - PADDLE_HEIGHT),
            }));
            touchYRef.current = currentTouchY;
        };
        
        const handleTouchEnd = () => {
            touchYRef.current = null;
        };
        
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        
        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [gameState.gameStarted]);

    // Main game effect: starts game loop and timer
    useEffect(() => {
        if (gameState.gameStarted && !gameState.gameOver) {
            // Start animation loop
            gameLoopRef.current = requestAnimationFrame(gameLoop);
            
            // Start timer
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        // Game over conditions
                        if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
                        if (timerRef.current) clearInterval(timerRef.current);
                        setGameState(prevState => ({ ...prevState, gameOver: true, gameStarted: false }));
                        onGameEnd({ finalScore: gameState.playerScore });
                        saveScore(gameState.playerScore);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            
            // Cleanup function
            return () => {
                if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [gameState.gameStarted, gameState.gameOver, gameLoop, onGameEnd, gameState.playerScore, saveScore]);

    const handleStartGame = () => {
        setGameState(prevState => ({
            ...prevState,
            gameStarted: true,
            showInstructions: false,
            gameOver: false,
        }));
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-200 p-4 font-sans antialiased overflow-hidden">
            <div className="text-center mb-8">
                <h1 className="text-6xl font-bold text-green-400 tracking-wider">Emoji Ping Pong</h1>
                <p className="text-lg text-gray-400 mt-2">
                    Player: Arrow Keys ↑/↓ or Touch/Swipe
                </p>
            </div>

            {/* Scoreboard */}
            <div className="flex justify-around w-full max-w-4xl mb-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-bold text-green-300"
                >
                    Your Score: ${gameState.playerScore}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl font-bold text-red-400"
                >
                    Opponent Score: ${gameState.aiScore}
                </motion.div>
            </div>

            {/* Timer */}
            <div className="text-3xl font-bold text-blue-400 mb-4">
                Time Left: {formatTime(timeLeft)}
            </div>

            {/* Game Area */}
            <motion.div
                className="relative border-8 border-gray-700 rounded-lg shadow-2xl overflow-hidden"
                style={{
                    width: GAME_WIDTH, 
                    height: GAME_HEIGHT,
                    background: 'linear-gradient(135deg, #a0522d, #8b4513)',
                    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Center line of the board */}
                <div className="absolute inset-y-0 left-1/2 w-1 bg-white bg-opacity-50" />
                
                {/* Player Paddle */}
                <motion.div
                    className="absolute"
                    style={{
                        width: PADDLE_WIDTH,
                        height: PADDLE_HEIGHT,
                        left: 0,
                        top: gameState.playerPaddleY,
                        // Use CSS transition for smoother paddle movement
                        transition: 'top 0.05s linear',
                    }}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <PingPongPaddleSVG color="#C8102E" />
                </motion.div>
                
                {/* AI Paddle */}
                <motion.div
                    className="absolute"
                    style={{
                        width: PADDLE_WIDTH,
                        height: PADDLE_HEIGHT,
                        right: 0,
                        top: gameState.aiPaddleY,
                        transition: 'top 0.05s linear',
                    }}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <PingPongPaddleSVG color="#0033A0" />
                </motion.div>
                
                {/* Ball */}
                <motion.div
                    className="absolute flex items-center justify-center rounded-full shadow-lg"
                    style={{
                        width: BALL_SIZE,
                        height: BALL_SIZE,
                        left: gameState.ballX,
                        top: gameState.ballY,
                        fontSize: `${BALL_SIZE}px`,
                        lineHeight: 1,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                >
                    🏓
                </motion.div>
                
                {/* Overlay for instructions and game over */}
                <AnimatePresence>
                    {(gameState.showInstructions || gameState.gameOver) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/90 rounded-lg p-8"
                        >
                            {gameState.gameOver ? (
                                <div className="text-center">
                                    <h2 className="text-5xl font-bold text-red-400 mb-4 animate-pulse">Game Over!</h2>
                                    <p className="text-3xl text-gray-300">Your Final Score: <span className="text-green-300">${gameState.playerScore}</span></p>
                                    <motion.div
                                        className="mt-4 flex items-center justify-center gap-2 text-yellow-300 text-lg font-semibold"
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Award size={20} /> Score saved to Firestore!
                                    </motion.div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <h2 className="text-5xl font-bold text-green-400 mb-4 animate-pulse">Welcome to Emoji Ping Pong!</h2>
                                    <div className="text-xl text-gray-300 text-center space-y-4 max-w-xl">
                                        <p>Hit the 🏓 ball past the AI to score points!</p>
                                        <ul className="list-disc list-inside text-left mx-auto">
                                            <li>Use the <span className="font-bold text-green-300">Up</span> and <span className="font-bold text-green-300">Down</span> arrow keys.</li>
                                            <li>Or, swipe on the screen to move your paddle.</li>
                                            <li>The ball gets faster as you play.</li>
                                            <li>Game lasts for {duration} minutes.</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                            <motion.button
                                onClick={handleStartGame}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-8 p-6 bg-green-500 text-gray-900 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 font-bold text-lg"
                            >
                                <Play size={24} /> Start Game
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Controls */}
            <div className="mt-8 flex gap-4">
                <motion.button
                    onClick={handleStartGame}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-500 text-gray-900 rounded-full shadow-lg font-semibold transition-all duration-200 flex items-center gap-2"
                >
                    <Play size={24} /> Restart Game
                </motion.button>
            </div>
        </div>
    );
};

// Main App component for Firebase setup and rendering the game
export default function App() {
    const [db, setDb] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [gameResult, setGameResult] = useState(null);

    useEffect(() => {
        // Guard against missing Firebase global variables
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

        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                // Try to sign in with the provided custom token
                try {
                    await signInWithCustomToken(firebaseAuth, __initial_auth_token);
                    if (firebaseAuth.currentUser) {
                        setUserId(firebaseAuth.currentUser.uid);
                    }
                } catch (error) {
                    console.error("Firebase Auth Error:", error);
                    // Fallback to anonymous sign-in if custom token fails
                    await signInAnonymously(firebaseAuth);
                    if (firebaseAuth.currentUser) {
                        setUserId(firebaseAuth.currentUser.uid);
                    }
                }
            }
            setIsAuthReady(true);
        });

        // Cleanup the auth listener on component unmount
        return () => unsubscribe();
    }, []);

    const handleGameEnd = (result) => {
        setGameResult(result);
    };

    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
                <p>Loading game...</p>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-950 min-h-screen flex flex-col items-center justify-center">
             <PingPongGame onGameEnd={handleGameEnd} duration={5} db={db} userId={userId} />
        </div>
    );
}

