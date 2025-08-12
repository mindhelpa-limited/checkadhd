"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Game constants
const COLS = 20; // Number of columns on the board
const ROWS = 20; // Number of rows on the board
const INITIAL_SPEED = 200; // milliseconds
const CELL_SIZE = 20; // Size of each cell in pixels
const GAME_DURATION = 7 * 60; // 7 minutes in seconds
const SCORE_PER_FOOD = 10; // New score per food item

// Utility function to get Firebase instances
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
  // Initial snake position as a small, three-segment worm
  const [snake, setSnake] = useState([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 }); // Initial direction: up
  const [score, setScore] = useState(0);
  const [gameStarted] = useState(true); // Game starts automatically
  const [gameSpeed] = useState(INITIAL_SPEED);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [lastEaten, setLastEaten] = useState(null);
  const gameLoopRef = useRef(null);
  const timerRef = useRef(null);

  // Function to place food at a random valid location on the board
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

  // The main game loop logic
  const gameLoop = useCallback(() => {
    // Create a new snake head based on the current direction, with wrap-around logic
    const newHead = {
      x: (snake[0].x + direction.x + COLS) % COLS,
      y: (snake[0].y + direction.y + ROWS) % ROWS,
    };

    // Create a new snake array with the new head
    const newSnake = [newHead, ...snake];

    // Check if food is eaten
    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(prevScore => prevScore + SCORE_PER_FOOD);
      // Display a temporary message for the eaten dollar
      setLastEaten({ x: food.x, y: food.y, score: score + SCORE_PER_FOOD });
      setTimeout(() => setLastEaten(null), 1000);
      // Place new food
      placeFood();
    } else {
      // Remove the tail if food was not eaten
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, placeFood, score]);

  // UseEffect for the game loop interval
  useEffect(() => {
    if (gameStarted) {
      gameLoopRef.current = setInterval(gameLoop, gameSpeed);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameStarted, gameSpeed, gameLoop]);

  // UseEffect to handle the 7-minute countdown timer
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else if (timeLeft === 0) {
      // When the timer runs out, end the session and transition to the next session
      // setGameStarted(false); // This is not needed since the component will unmount
      onFinish({ totalScore: score });
    }
  }, [gameStarted, timeLeft, onFinish, score]);

  // UseEffect to handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent snake from reversing
      if (e.key === 'ArrowUp' && direction.y === 0) setDirection({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && direction.y === 0) setDirection({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && direction.x === 0) setDirection({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && direction.x === 0) setDirection({ x: 1, y: 0 });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Helper function to format time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Render the game board
  const renderBoard = () => {
    const board = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        let cellContent = null;
        let cellClasses = "w-5 h-5 flex items-center justify-center";

        // Check if the current cell is part of the snake
        const snakeHead = snake[0];
        const isSnakeHead = snakeHead.x === col && snakeHead.y === row;
        const isSnakeBody = !isSnakeHead && snake.some(segment => segment.x === col && segment.y === row);
        
        if (isSnakeHead) {
          cellClasses += " bg-green-400 rounded-full shadow-lg";
        } else if (isSnakeBody) {
          cellClasses += " bg-green-500 rounded-sm shadow-md";
        }

        // Check if the current cell is food
        const isFood = food.x === col && food.y === row;
        if (isFood) {
          cellContent = (
            <motion.div
              key="food"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-yellow-400 text-lg font-bold"
            >
              $
            </motion.div>
          );
        }

        // Check if the cell is where the last dollar was eaten
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

        board.push(
          <div key={`${col}-${row}`} className={cellClasses}>
            {cellContent}
          </div>
        );
      }
    }
    return board;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-gray-200 p-4 font-sans antialiased">
      <div className="max-w-4xl w-full flex flex-col lg:flex-row items-center lg:items-start lg:justify-between space-y-8 lg:space-y-0 lg:space-x-8">
        
        {/* Game Stats Section */}
        <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-gray-900 rounded-xl p-6 shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-2 border-green-500 text-center"
          >
            <h1 className="text-4xl font-bold text-green-400 tracking-wider mb-2">Stack Up Wealth</h1>
            <div className="text-2xl font-semibold text-gray-300">
              Score: <span className="text-green-300 font-bold">${score}</span>
            </div>
            <div className="text-xl font-semibold text-gray-400 mt-2">
              Time Left: <span className="text-blue-400 font-bold">{formatTime(timeLeft)}</span>
            </div>
          </motion.div>
        </div>

        {/* Game Board */}
        <div className="relative w-full lg:w-2/3 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="grid gap-0 bg-gray-950 border-4 border-green-500 rounded-lg shadow-xl"
            style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`, gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)` }}
          >
            {renderBoard()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
