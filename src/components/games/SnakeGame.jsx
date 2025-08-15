"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ChevronLeft, ChevronRight, ChevronDown, RotateCcw } from 'lucide-react';

// Game constants
const COLS = 20;
const ROWS = 20;
const INITIAL_SPEED = 200;
const CELL_SIZE = 20;
const GAME_DURATION = 7 * 60;
const SCORE_PER_FOOD = 10;
const CONTROL_SIZE = 180;
const CONTROL_GAP = 8;
const FLOOR_CLEAR = CONTROL_SIZE / 2 + CONTROL_GAP + 8;

const getFirebaseInstances = () => {
  if (typeof window !== 'undefined' && typeof __firebase_config !== 'undefined' && typeof __initial_auth_token !== 'undefined') {
    const firebaseConfig = JSON.parse(__firebase_config);
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    return { db, auth };
  }
  return { db: null, auth: null };
};

const SnakeGame = ({ onFinish }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [gameStarted] = useState(true);
  const [gameSpeed] = useState(INITIAL_SPEED);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [lastEaten, setLastEaten] = useState(null);
  const gameLoopRef = useRef(null);
  const timerRef = useRef(null);

  // Disable page scrolling
  useEffect(() => {
    const { documentElement: html, body } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    const prevent = (e) => e.preventDefault();
    window.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      window.removeEventListener('touchmove', prevent);
    };
  }, []);

  const placeFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  }, [snake]);

  const gameLoop = useCallback(() => {
    const newHead = {
      x: (snake[0].x + direction.x + COLS) % COLS,
      y: (snake[0].y + direction.y + ROWS) % ROWS,
    };
    const newSnake = [newHead, ...snake];
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(prevScore => prevScore + SCORE_PER_FOOD);
      setLastEaten({ x: food.x, y: food.y, score: score + SCORE_PER_FOOD });
      setTimeout(() => setLastEaten(null), 1000);
      placeFood();
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  }, [snake, direction, food, placeFood, score]);

  useEffect(() => {
    if (gameStarted) {
      gameLoopRef.current = setInterval(gameLoop, gameSpeed);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameSpeed, gameLoop]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else if (timeLeft === 0) {
      onFinish({ totalScore: score });
    }
  }, [gameStarted, timeLeft, onFinish, score]);

  const handlePlayerAction = useCallback(
    (action) => {
      if (action === 'up' && direction.y === 0) setDirection({ x: 0, y: -1 });
      if (action === 'down' && direction.y === 0) setDirection({ x: 0, y: 1 });
      if (action === 'left' && direction.x === 0) setDirection({ x: -1, y: 0 });
      if (action === 'right' && direction.x === 0) setDirection({ x: 1, y: 0 });
    },
    [direction]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') handlePlayerAction('up');
      if (e.key === 'ArrowDown') handlePlayerAction('down');
      if (e.key === 'ArrowLeft') handlePlayerAction('left');
      if (e.key === 'ArrowRight') handlePlayerAction('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayerAction]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < ROWS; row++) {
      const rowCells = [];
      for (let col = 0; col < COLS; col++) {
        let cellContent = null;
        let cellClasses = "w-5 h-5 flex items-center justify-center";
        const isSnakeHead = snake[0].x === col && snake[0].y === row;
        const isSnakeBody = !isSnakeHead && snake.some(segment => segment.x === col && segment.y === row);
        const isFood = food.x === col && food.y === row;

        if (isSnakeHead) {
          cellClasses += " bg-emerald-400 rounded-sm shadow-lg";
        } else if (isSnakeBody) {
          cellClasses += " bg-emerald-500 rounded-sm shadow-md";
        }

        if (isFood) {
          cellContent = (
            <motion.div
              key="food"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-white text-md font-bold"
            >
              $
            </motion.div>
          );
        }

        if (lastEaten && lastEaten.x === col && lastEaten.y === row) {
          cellContent = (
            <motion.span
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 2 }}
              transition={{ duration: 1 }}
              className="text-green-300 font-bold absolute text-xs"
            >
              +{SCORE_PER_FOOD}
            </motion.span>
          );
        }

        rowCells.push(
          <div key={`${col}-${row}`} className={cellClasses}>
            {cellContent}
          </div>
        );
      }
      board.push(
        <div key={row} className="flex leading-none">
          {rowCells}
        </div>
      );
    }
    return board;
  };

  return (
    <div
      className="flex flex-col h-dvh text-gray-200 font-sans antialiased select-none"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(/images/money.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        touchAction: 'none',
      }}
    >
      {/* HEADER */}
      <div className="w-full p-2">
        <div className="flex items-center justify-between py-1 px-2 bg-gray-900/80 backdrop-blur-sm rounded-md shadow-lg border-2 border-gray-700 w-full">
          {/* Omitted Music control for simplicity */}
          <div className="flex-grow flex items-center justify-center space-x-2">
            <span className="text-xs font-semibold text-emerald-300 drop-shadow">Cash:</span>
            <span className="text-sm font-bold text-white">${score}</span>
            <span className="text-xs font-semibold text-emerald-300 drop-shadow ml-4">Time:</span>
            <span className="text-sm font-bold text-white">{formatTime(timeLeft)}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold border-2 border-white">
            S
          </div>
        </div>
      </div>
      {/* GAME AREA */}
      <div className="relative flex-1 w-full px-2 pb-2">
        <div
          className="relative border-4 border-emerald-500 rounded-md overflow-hidden w-full h-full flex items-start justify-center"
          style={{
            backgroundImage: 'url(/images/money.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            touchAction: 'none',
          }}
        >
          <div className="w-full flex flex-col items-center" style={{ paddingBottom: FLOOR_CLEAR + 16 }}>
            {renderBoard()}
          </div>
          {/* Floor boundary and opaque mask */}
          <div
            className="absolute left-0 right-0"
            style={{ bottom: FLOOR_CLEAR, height: 0, borderTop: '2px solid #10B981' }}
          />
          <div
            className="absolute left-0 right-0 bg-gray-950/90 pointer-events-none"
            style={{ height: FLOOR_CLEAR, bottom: 0 }}
          />
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
                aria-label="Up"
              >
                <RotateCcw className="w-4 h-4 rotate-180" />
              </button>
              <div />
              <button
                onClick={() => handlePlayerAction('left')}
                className="w-10 h-10 rounded-full bg-gray-800 text-emerald-400 border border-emerald-500 shadow-lg active:scale-95 flex items-center justify-center"
                aria-label="Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handlePlayerAction('down')}
                className="w-12 h-12 rounded-full bg-emerald-400 text-gray-900 font-bold border border-white shadow-xl active:scale-95 flex items-center justify-center"
                aria-label="Down (Center)"
              >
                ●
              </button>
              <button
                onClick={() => handlePlayerAction('right')}
                className="w-10 h-10 rounded-full bg-gray-800 text-emerald-400 border border-emerald-500 shadow-lg active:scale-95 flex items-center justify-center"
                aria-label="Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div />
              <button
                onClick={() => handlePlayerAction('down')}
                className="w-10 h-10 rounded-full bg-gray-800 text-emerald-400 border border-emerald-500 shadow-lg active:scale-95 flex items-center justify-center"
                aria-label="Down"
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

export default SnakeGame;