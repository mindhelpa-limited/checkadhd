import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, ChevronDown, Music, XCircle } from 'lucide-react';
import * as Tone from 'tone';

// Game constants
const COLS = 10;
const ROWS = 20;
const INITIAL_SPEED = 600; // milliseconds

// Define the shapes of the money stacks (Tetris-style)
// I, L, J, T, S, Z, O
const SHAPES = [
  // I-Stack
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  // L-Stack
  [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  // J-Stack
  [[0, 1, 0, 0], [0, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  // T-Stack
  [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  // S-Stack
  [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  // Z-Stack
  [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
  // O-Stack
  [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
];

const MoneyStackGame = ({ onNext, duration }) => {
  const [board, setBoard] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [gameSpeed] = useState(INITIAL_SPEED);
  const [timeLeft, setTimeLeft] = useState(duration / 1000); // Time in seconds
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  // New state to track if audio is loaded
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  // Refs for Tone.js players
  const placementSoundPlayer = useRef(null);
  const backgroundMusicPlayer = useRef(null);

  // Initialize Tone.js players and start background music automatically
  useEffect(() => {
    const initializeAudio = async () => {
      // Await Tone.start() to ensure audio context is active
      await Tone.start();
      
      // Create and load player for the placement sound (moneysound.mp3)
      placementSoundPlayer.current = new Tone.Player("/moneysound.mp3", () => {
        // This callback runs when the buffer is loaded.
        console.log("Placement sound loaded.");
      }).toDestination();
      
      // Create and load player for the background music (meditation.mp3)
      backgroundMusicPlayer.current = new Tone.Player("/meditation.mp3", () => {
        // This callback runs when the music buffer is loaded.
        backgroundMusicPlayer.current.loop = true;
        backgroundMusicPlayer.current.volume.value = -10; // Set a lower volume for background music
        console.log("Background music loaded.");
        setIsAudioLoaded(true); // Now we know the audio is ready
      }).toDestination();
    };

    initializeAudio();

    // Cleanup function to dispose of the players
    return () => {
      if (placementSoundPlayer.current) placementSoundPlayer.current.dispose();
      if (backgroundMusicPlayer.current) backgroundMusicPlayer.current.dispose();
    };
  }, []);

  // New useEffect to start the music once the audio is loaded
  useEffect(() => {
    if (isAudioLoaded) {
      backgroundMusicPlayer.current.start();
      setIsMusicPlaying(true);
    }
  }, [isAudioLoaded]);

  // Function to play the piece placement sound (moneysound.mp3)
  const playPlacementSound = async () => {
    await Tone.start();
    // Check if the player is ready before attempting to play
    if (placementSoundPlayer.current && placementSoundPlayer.current.loaded) {
      // Start the sound from the beginning each time, playing it once
      placementSoundPlayer.current.start();
    }
  };

  // Function to toggle background music
  const toggleBackgroundMusic = async () => {
    await Tone.start();
    // Check if the player is ready before attempting to toggle
    if (backgroundMusicPlayer.current && backgroundMusicPlayer.current.loaded) {
      if (isMusicPlaying) {
        backgroundMusicPlayer.current.stop();
        setIsMusicPlaying(false);
      } else {
        backgroundMusicPlayer.current.start();
        setIsMusicPlaying(true);
      }
    }
  };


  // Timer Effect to handle the countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      // Stop music only if the player is loaded and playing
      if (isMusicPlaying && backgroundMusicPlayer.current && backgroundMusicPlayer.current.loaded) {
        backgroundMusicPlayer.current.stop();
      }
      onNext({ score, board });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [onNext, score, board, timeLeft, isMusicPlaying]);

  // Generate a new random piece
  const generateNewPiece = useCallback(() => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[shapeIndex];
    const x = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2);
    const y = 0;
    return { shape, x, y };
  }, []);

  // Check if a move is valid
  const isValidMove = useCallback((newPiece, newBoard) => {
    for (let row = 0; row < newPiece.shape.length; row++) {
      for (let col = 0; col < newPiece.shape[row].length; col++) {
        if (newPiece.shape[row][col] !== 0) {
          const boardRow = newPiece.y + row;
          const boardCol = newPiece.x + col;

          if (
            boardCol < 0 || boardCol >= COLS ||
            boardRow >= ROWS ||
            (boardRow >= 0 && newBoard[boardRow][boardCol] !== 0)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  // Place the piece on the board and check for cleared rows
  const placePiece = useCallback(() => {
    if (!currentPiece) return;

    // Play placement sound (moneysound.mp3)
    playPlacementSound();

    setBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col] !== 0) {
            const boardRow = currentPiece.y + row;
            const boardCol = currentPiece.x + col;
            if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
              newBoard[boardRow][boardCol] = 1; // Mark as occupied
            }
          }
        }
      }
      return newBoard;
    });

    // Check for full rows and clear them
    setBoard(prevBoard => {
      const newBoard = prevBoard.filter(row => !row.every(cell => cell !== 0));
      const clearedRowsCount = ROWS - newBoard.length;
      if (clearedRowsCount > 0) {
        // We will not add line clear sound here, as per your request to only add money sound
        setScore(prevScore => prevScore + clearedRowsCount * 100);
        const emptyRows = Array.from({ length: clearedRowsCount }, () => Array(COLS).fill(0));
        return [...emptyRows, ...newBoard];
      }
      return prevBoard; // Return original board if no rows cleared
    });

    // Move to the next piece. If the next piece cannot be placed, clear the board and continue.
    const next = nextPiece;
    if (!isValidMove(next, board)) {
      setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    }
    setCurrentPiece(next);
    setNextPiece(generateNewPiece());
  }, [currentPiece, board, isValidMove, nextPiece, generateNewPiece, playPlacementSound]);

  // Handle piece movement (downward gravity)
  const moveDown = useCallback(() => {
    if (!currentPiece) return;

    const newPieceState = { ...currentPiece, y: currentPiece.y + 1 };
    if (isValidMove(newPieceState, board)) {
      setCurrentPiece(newPieceState);
    } else {
      placePiece();
    }
  }, [currentPiece, board, isValidMove, placePiece]);

  // Handle a user's action via keyboard or touch controls
  const handlePlayerAction = useCallback((action) => {
    if (!currentPiece) return;
  
    let newPieceState = { ...currentPiece };
    switch (action) {
      case 'ArrowLeft':
      case 'left':
        newPieceState.x--;
        break;
      case 'ArrowRight':
      case 'right':
        newPieceState.x++;
        break;
      case 'ArrowDown':
      case 'down':
        moveDown();
        return; // The moveDown function already handles updating the state.
      case 'ArrowUp':
      case 'rotate':
        // Rotate the piece
        const rotatedShape = newPieceState.shape[0].map((_, colIndex) =>
          newPieceState.shape.map(row => row[colIndex]).reverse()
        );
        newPieceState.shape = rotatedShape;
        break;
      case ' ': // Hard drop
      case 'hardDrop':
        let dropPiece = { ...currentPiece };
        while (isValidMove({ ...dropPiece, y: dropPiece.y + 1 }, board)) {
          dropPiece.y++;
        }
        setCurrentPiece(dropPiece);
        placePiece();
        return; // The placePiece function already handles updating the state.
      default:
        return; // Do nothing for other keys/actions
    }
  
    if (isValidMove(newPieceState, board)) {
      setCurrentPiece(newPieceState);
    }
  }, [currentPiece, board, isValidMove, placePiece, moveDown]);
  

  // Game loop for falling pieces
  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(moveDown, gameSpeed);
      return () => clearInterval(interval);
    }
  }, [moveDown, gameSpeed, timeLeft]);

  // Initial setup of the game
  useEffect(() => {
    if (!currentPiece) {
      setCurrentPiece(generateNewPiece());
      setNextPiece(generateNewPiece());
    }
    // Handle keyboard input
    const handleKeyDown = (e) => {
      handlePlayerAction(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPiece, generateNewPiece, handlePlayerAction]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Render the game board and current piece
  const renderBoard = () => {
    const combinedBoard = [...board.map(row => [...row])];
    if (currentPiece) {
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col] !== 0) {
            const boardRow = currentPiece.y + row;
            const boardCol = currentPiece.x + col;
            if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
              combinedBoard[boardRow][boardCol] = 1;
            }
          }
        }
      }
    }
    return combinedBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <div
            key={colIndex}
            className={`w-6 h-6 p-0.5 border border-gray-700 ${cell === 0 ? 'bg-gray-900' : 'bg-gradient-to-br from-green-300 via-green-400 to-green-500 shadow-md rotate-3'}`}
          >
            {cell !== 0 && (
              <div className="w-full h-full bg-green-400 rounded-sm shadow-inner flex items-center justify-center text-sm font-bold text-gray-800">
                $
              </div>
            )}
          </div>
        ))}
      </div>
    ));
  };
  
  // Render the next piece preview
  const renderNextPiece = () => {
    if (!nextPiece) return null;
    return (
      <div className="p-2 border-2 border-green-500 bg-gray-950 shadow-inner rounded-md">
        {nextPiece.shape.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`w-4 h-4 p-0.5 border border-gray-800 ${cell === 0 ? 'bg-transparent' : 'bg-gradient-to-br from-green-300 via-green-400 to-green-500 shadow-md rotate-3'}`}
              >
                {cell !== 0 && (
                  <div className="w-full h-full bg-green-400 rounded-sm shadow-inner flex items-center justify-center text-xs font-bold text-gray-800">
                    $
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-200 p-4 font-sans antialiased bg-cover bg-center"
      style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://images.unsplash.com/photo-1590283603417-106b0d9129d2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)' }}
    >
      <div className="max-w-4xl w-full bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-2 border-gray-700 p-8 space-y-8 animate-fade-in-up flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">

        <button
          onClick={toggleBackgroundMusic}
          className="absolute top-4 right-4 p-3 bg-gray-800 text-green-400 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          aria-label={isMusicPlaying ? "Pause music" : "Play music"}
        >
          {isMusicPlaying ? <Music className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
        </button>
        
        {/* Mobile Stats and Next Piece - visible on small screens */}
        <div className="flex lg:hidden w-full justify-between items-center px-4 py-2 bg-gray-800 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.2)] border border-gray-700 mb-4">
          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold text-green-300 drop-shadow">Money Stacked</h2>
            <span className="text-2xl font-bold text-white">${score}</span>
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold text-green-300 drop-shadow">Time</h2>
            <span className="text-2xl font-bold text-white">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-xl font-semibold text-green-300 drop-shadow">Next</h2>
            <div className="flex justify-center">
              {renderNextPiece()}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full lg:w-auto">
          <h1 className="text-4xl font-bold text-green-400 text-center tracking-wider drop-shadow-md mb-4 lg:hidden">Stacking Money</h1>
          
          <div className="relative border-4 border-green-500 p-1 bg-gray-950 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] rounded-md overflow-hidden">
            {renderBoard()}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-gray-800 opacity-20 text-9xl font-extrabold tracking-tighter">$$$</span>
            </div>
          </div>
          
          {/* Mobile Controls */}
          <div className="lg:hidden w-full flex justify-between items-center mt-6 p-4">
            <button
              onClick={() => handlePlayerAction('left')}
              className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 text-green-400 rounded-full shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => handlePlayerAction('rotate')}
                className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 text-green-400 rounded-full shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
              >
                <RotateCcw className="w-8 h-8" />
              </button>
              <button
                onClick={() => handlePlayerAction('down')}
                className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 text-green-400 rounded-full shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
              >
                <ChevronDown className="w-8 h-8" />
              </button>
            </div>
            <button
              onClick={() => handlePlayerAction('right')}
              className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 text-green-400 rounded-full shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
        
        {/* Desktop Stats and Next Piece - visible on large screens */}
        <div className="hidden lg:flex w-full lg:w-1/3 flex-col items-center lg:items-start space-y-8 mt-8 lg:mt-0">
          <div className="w-full bg-gray-800 rounded-xl p-4 shadow-[0_10px_20px_rgba(0,0,0,0.2)] border border-gray-700">
            <h2 className="text-2xl font-semibold text-green-300 mb-2 drop-shadow">Game Stats</h2>
            <div className="text-xl font-medium text-gray-300">
              <span className="block mb-1">Money Stacked: <span className="font-bold text-white">${score}</span></span>
              <span className="block">Time: <span className="font-bold text-white">{formatTime(timeLeft)}</span></span>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-xl p-4 shadow-[0_10px_20px_rgba(0,0,0,0.2)] border border-gray-700">
            <h2 className="text-2xl font-semibold text-green-300 mb-2 drop-shadow">Next Stack</h2>
            {renderNextPiece()}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MoneyStackGame;
