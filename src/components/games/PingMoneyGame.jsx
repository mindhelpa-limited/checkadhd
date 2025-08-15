"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Game constants
const COLS = 15;
const ROWS = 20;
const CONTROL_SIZE = 180;
const CONTROL_GAP = 8;
const FLOOR_CLEAR = CONTROL_SIZE / 2 + CONTROL_GAP + 8;

const GAME_WIDTH = 24 * COLS;
const GAME_HEIGHT = 24 * ROWS;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 25;
const INITIAL_BALL_SPEED = 5;
const AI_PADDLE_SPEED = 5;

// SVG for the ping-pong paddle
const PingPongPaddleSVG = ({ color }) => (
    <svg width={PADDLE_WIDTH} height={PADDLE_HEIGHT} viewBox="0 0 15 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="15" height="100" fill={color} rx="7" ry="7" />
    </svg>
);

const PingPongGame = ({ onGameEnd, duration = 7 * 60, db, userId }) => {
    // Disable page scrolling while mounted
    useEffect(() => {
        const { documentElement: html, body } = document;
        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;
        const prevHtmlHeight = html.style.height;
        const prevBodyHeight = body.style.height;

        html.style.overflow = 'hidden';
        body.style.overflow = 'hidden';
        html.style.height = '100%';
        body.style.height = '100%';

        const prevent = (e) => e.preventDefault();
        window.addEventListener('touchmove', prevent, { passive: false });

        return () => {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
            html.style.height = prevHtmlHeight;
            body.style.height = prevBodyHeight;
            window.removeEventListener('touchmove', prevent);
        };
    }, []);

    // Game state
    const [gameState, setGameState] = useState({
        playerPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        aiPaddleY: GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        ballX: GAME_WIDTH / 2 - BALL_SIZE / 2,
        ballY: GAME_HEIGHT / 2 - BALL_SIZE / 2,
        ballSpeedX: INITIAL_BALL_SPEED,
        ballSpeedY: INITIAL_BALL_SPEED,
        playerScore: 0,
        aiScore: 0,
        gameStarted: true,
        gameOver: false,
    });
    const [timeLeft, setTimeLeft] = useState(duration);

    const gameLoopRef = useRef(null);
    const timerRef = useRef(null);
    const playerPaddleYRef = useRef(gameState.playerPaddleY);

    useEffect(() => {
        playerPaddleYRef.current = gameState.playerPaddleY;
    }, [gameState.playerPaddleY]);

    const saveScore = useCallback(async (score) => {
        if (!db || !userId || score === 0) return;
        try {
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const scoreDocRef = doc(db, `artifacts/${appId}/users/${userId}/scores`);
            await setDoc(scoreDocRef, { score, timestamp: new Date() }, { merge: true });
        } catch (error) {
            console.error("Error saving score to Firestore:", error);
        }
    }, [db, userId]);

    const resetGame = useCallback(() => {
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
            gameStarted: true,
            gameOver: false,
        });
        setTimeLeft(duration);
    }, [duration, gameState.gameOver, gameState.playerScore, saveScore]);

    const gameLoop = useCallback(() => {
        setGameState(prevState => {
            if (prevState.gameOver) return prevState;

            const newState = { ...prevState };

            // AI PADDLE LOGIC
            const aiTargetY = newState.ballY - PADDLE_HEIGHT / 2;
            const aiSpeed = AI_PADDLE_SPEED;
            if (newState.aiPaddleY < aiTargetY) {
                newState.aiPaddleY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newState.aiPaddleY + aiSpeed);
            } else if (newState.aiPaddleY > aiTargetY) {
                newState.aiPaddleY = Math.max(0, newState.aiPaddleY - aiSpeed);
            }

            // BALL MOVEMENT
            newState.ballX += newState.ballSpeedX;
            newState.ballY += newState.ballSpeedY;

            // COLLISION DETECTION
            // Top and bottom wall collision
            if (newState.ballY <= 0 || newState.ballY + BALL_SIZE >= GAME_HEIGHT) {
                newState.ballSpeedY *= -1;
            }

            // Player paddle collision
            const playerPaddleY = playerPaddleYRef.current;
            if (
                newState.ballX <= PADDLE_WIDTH &&
                newState.ballY + BALL_SIZE > playerPaddleY &&
                newState.ballY < playerPaddleY + PADDLE_HEIGHT &&
                newState.ballSpeedX < 0
            ) {
                newState.ballSpeedX *= -1.1; // Reverse and increase speed
                newState.ballSpeedX = Math.min(Math.abs(newState.ballSpeedX), 15);
                newState.ballX = PADDLE_WIDTH; // Ensure ball is outside the paddle
            }

            // AI paddle collision
            if (
                newState.ballX + BALL_SIZE >= GAME_WIDTH - PADDLE_WIDTH &&
                newState.ballY + BALL_SIZE > newState.aiPaddleY &&
                newState.ballY < newState.aiPaddleY + PADDLE_HEIGHT &&
                newState.ballSpeedX > 0
            ) {
                newState.ballSpeedX *= -1.1; // Reverse and increase speed
                newState.ballSpeedX = Math.max(-15, -Math.abs(newState.ballSpeedX));
                newState.ballX = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE; // Ensure ball is outside the paddle
            }

            // SCORING LOGIC
            if (newState.ballX <= 0) {
                newState.aiScore++;
                newState.ballX = GAME_WIDTH / 2 - BALL_SIZE / 2;
                newState.ballY = GAME_HEIGHT / 2 - BALL_SIZE / 2;
                newState.ballSpeedX = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
                newState.ballSpeedY = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
            } else if (newState.ballX + BALL_SIZE >= GAME_WIDTH) {
                newState.playerScore++;
                newState.ballX = GAME_WIDTH / 2 - BALL_SIZE / 2;
                newState.ballY = GAME_HEIGHT / 2 - BALL_SIZE / 2;
                newState.ballSpeedX = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
                newState.ballSpeedY = INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
            }
            return newState;
        });
        gameLoopRef.current = requestAnimationFrame(gameLoop);
    }, []);

    const handlePlayerAction = useCallback(
        (action) => {
            if (!gameState.gameStarted) return;
            setGameState(prevState => {
                let newY = prevState.playerPaddleY;
                const moveSpeed = 20;
                if (action === 'up') {
                    newY = Math.max(0, newY - moveSpeed);
                } else if (action === 'down') {
                    newY = Math.min(GAME_HEIGHT - PADDLE_HEIGHT, newY + moveSpeed);
                }
                return { ...prevState, playerPaddleY: newY };
            });
        }, [gameState.gameStarted]
    );

    // Keyboard input for player paddle movement
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

    useEffect(() => {
        if (gameState.gameStarted && !gameState.gameOver) {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
            timerRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
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
            return () => {
                if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
                if (timerRef.current) clearInterval(timerRef.current);
            };
        }
    }, [gameState.gameStarted, gameState.gameOver, gameLoop, onGameEnd, gameState.playerScore, saveScore]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="flex flex-col h-dvh text-gray-200 font-sans antialiased select-none"
            style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(/images/ping-pong-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                touchAction: 'none',
            }}
        >
            {/* HEADER */}
            <div className="w-full p-2">
                <div className="flex items-center justify-between py-1 px-2 bg-gray-900/80 backdrop-blur-sm rounded-md shadow-lg border-2 border-gray-700 w-full">
                    <div className="flex-grow flex items-center justify-center space-x-2">
                        <span className="text-xs font-semibold text-emerald-300 drop-shadow">Your Score:</span>
                        <span className="text-sm font-bold text-white">${gameState.playerScore}</span>
                        <span className="text-xs font-semibold text-emerald-300 drop-shadow ml-4">Opponent Score:</span>
                        <span className="text-sm font-bold text-white">${gameState.aiScore}</span>
                        <span className="text-xs font-semibold text-emerald-300 drop-shadow ml-4">Time:</span>
                        <span className="text-sm font-bold text-white">{formatTime(timeLeft)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold border-2 border-white">
                            P
                        </div>
                    </div>
                </div>
            </div>

            {/* GAME AREA */}
            <div className="relative flex-1 w-full px-2 pb-2">
                <div
                    className="relative border-4 border-emerald-500 rounded-md overflow-hidden w-full h-full flex items-start justify-center"
                    style={{
                        backgroundImage: 'url(/images/ping-pong-bg.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        touchAction: 'none',
                    }}
                >
                    <div className="w-full h-full relative" style={{ paddingBottom: FLOOR_CLEAR + 16 }}>
                        <div className="absolute inset-y-0 left-1/2 w-1 bg-white bg-opacity-50" />
                        
                        {/* Player Paddle */}
                        <motion.div
                            className="absolute"
                            style={{
                                width: PADDLE_WIDTH,
                                height: PADDLE_HEIGHT,
                                left: 0,
                                top: gameState.playerPaddleY,
                                transition: 'top 0.05s linear',
                            }}
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
                        >
                            <PingPongPaddleSVG color="#0033A0" />
                        </motion.div>
                        
                        {/* Ball */}
                        <motion.div
                            className="absolute flex items-center justify-center rounded-full shadow-lg bg-white"
                            style={{
                                width: BALL_SIZE,
                                height: BALL_SIZE,
                                left: gameState.ballX,
                                top: gameState.ballY,
                                fontSize: `${BALL_SIZE}px`,
                                lineHeight: 1,
                            }}
                        >
                            🏓
                        </motion.div>
                    </div>

                    {/* Floor boundary */}
                    <div
                        className="absolute left-0 right-0"
                        style={{ bottom: FLOOR_CLEAR, height: 0, borderTop: '2px solid #10B981' }}
                    />

                    {/* Opaque mask under the circular control */}
                    <div
                        className="absolute left-0 right-0 bg-gray-950/90 pointer-events-none"
                        style={{ height: FLOOR_CLEAR, bottom: 0 }}
                    />

                    {/* Overlay for game over */}
                    <AnimatePresence>
                        {gameState.gameOver && (
                            <motion.div
                                key="overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/90 rounded-lg p-8"
                            >
                                <motion.h2
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="text-4xl font-bold mb-4 text-emerald-400"
                                >
                                    Game Over!
                                </motion.h2>
                                <p className="text-xl text-white mb-6">Your Score: ${gameState.playerScore}</p>
                                <p className="text-sm text-gray-400 mb-6">Use the controls below to move your paddle.</p>
                                <button
                                    onClick={resetGame}
                                    className="flex items-center px-6 py-3 bg-emerald-500 text-gray-950 rounded-full font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200"
                                >
                                    <RotateCcw className="w-5 h-5 mr-2" /> Play Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Circular D-pad */}
                    <div
                        className="pointer-events-auto absolute rounded-full bg-gray-900/75 border border-emerald-500 shadow-2xl flex items-center justify-center"
                        style={{
                            width: CONTROL_SIZE,
                            height: CONTROL_SIZE,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bottom: CONTROL_GAP,
                        }}
                    >
                        <div className="grid grid-cols-3 grid-rows-3 gap-2">
                            <div />
                            <button
                                onClick={() => handlePlayerAction('up')}
                                className="w-10 h-10 rounded-full bg-gray-800 text-emerald-400 border border-emerald-500 shadow-lg active:scale-95 flex items-center justify-center"
                                aria-label="Move Up"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                            <div />

                            <div />

                            <div />
                            <div />

                            <div />
                            <button
                                onClick={() => handlePlayerAction('down')}
                                className="w-10 h-10 rounded-full bg-gray-800 text-emerald-400 border border-emerald-500 shadow-lg active:scale-95 flex items-center justify-center"
                                aria-label="Move Down"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <div />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PingPongGame;