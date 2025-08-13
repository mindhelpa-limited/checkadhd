import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, ChevronDown, Music, XCircle } from 'lucide-react';
import * as Tone from 'tone';

// Game constants
const COLS = 15;
const ROWS = 20;
const INITIAL_SPEED = 600; // milliseconds

// Define the shapes of the pieces (Tetris-style)
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

const Game = ({ onNext, duration }) => {
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
      await Tone.start();
      
      placementSoundPlayer.current = new Tone.Player("/moneysound.mp3", () => {
        console.log("Placement sound loaded.");
      }).toDestination();
      
      backgroundMusicPlayer.current = new Tone.Player("/meditation.mp3", () => {
        backgroundMusicPlayer.current.loop = true;
        backgroundMusicPlayer.current.volume.value = -10;
        console.log("Background music loaded.");
        setIsAudioLoaded(true);
      }).toDestination();
    };

    initializeAudio();

    return () => {
      if (placementSoundPlayer.current) placementSoundPlayer.current.dispose();
      if (backgroundMusicPlayer.current) backgroundMusicPlayer.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (isAudioLoaded) {
      backgroundMusicPlayer.current.start();
      setIsMusicPlaying(true);
    }
  }, [isAudioLoaded]);

  const playPlacementSound = async () => {
    await Tone.start();
    if (placementSoundPlayer.current && placementSoundPlayer.current.loaded) {
      placementSoundPlayer.current.start();
    }
  };

  const toggleBackgroundMusic = async () => {
    await Tone.start();
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

    playPlacementSound();

    setBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col] !== 0) {
            const boardRow = currentPiece.y + row;
            const boardCol = currentPiece.x + col;
            if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
              newBoard[boardRow][boardCol] = 1;
            }
          }
        }
      }
      return newBoard;
    });

    setBoard(prevBoard => {
      const newBoard = prevBoard.filter(row => !row.every(cell => cell !== 0));
      const clearedRowsCount = ROWS - newBoard.length;
      if (clearedRowsCount > 0) {
        setScore(prevScore => prevScore + clearedRowsCount * 100);
        const emptyRows = Array.from({ length: clearedRowsCount }, () => Array(COLS).fill(0));
        return [...emptyRows, ...newBoard];
      }
      return prevBoard;
    });

    const next = nextPiece;
    if (!isValidMove(next, board)) {
      setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    }
    setCurrentPiece(next);
    setNextPiece(generateNewPiece());
  }, [currentPiece, board, isValidMove, nextPiece, generateNewPiece, playPlacementSound]);

  const moveDown = useCallback(() => {
    if (!currentPiece) return;

    const newPieceState = { ...currentPiece, y: currentPiece.y + 1 };
    if (isValidMove(newPieceState, board)) {
      setCurrentPiece(newPieceState);
    } else {
      placePiece();
    }
  }, [currentPiece, board, isValidMove, placePiece]);

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
        return;
      case 'ArrowUp':
      case 'rotate':
        const rotatedShape = newPieceState.shape[0].map((_, colIndex) =>
          newPieceState.shape.map(row => row[colIndex]).reverse()
        );
        newPieceState.shape = rotatedShape;
        break;
      case ' ':
      case 'hardDrop':
        let dropPiece = { ...currentPiece };
        while (isValidMove({ ...dropPiece, y: dropPiece.y + 1 }, board)) {
          dropPiece.y++;
        }
        setCurrentPiece(dropPiece);
        placePiece();
        return;
      default:
        return;
    }
    
    if (isValidMove(newPieceState, board)) {
      setCurrentPiece(newPieceState);
    }
  }, [currentPiece, board, isValidMove, placePiece, moveDown]);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(moveDown, gameSpeed);
      return () => clearInterval(interval);
    }
  }, [moveDown, gameSpeed, timeLeft]);

  useEffect(() => {
    if (!currentPiece) {
      setCurrentPiece(generateNewPiece());
      setNextPiece(generateNewPiece());
    }
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
  
  const renderNextPiece = () => {
    if (!nextPiece) return null;
    // Get the first two rows of the next piece's shape
    const shapeToRender = nextPiece.shape.slice(0, 2);
    return (
      <div className="p-0 border-0 border-green-500 bg-gray-950 shadow-inner rounded-md">
        {shapeToRender.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`w-1.5 h-1.5 border border-gray-800 ${cell === 0 ? 'bg-transparent' : 'bg-gradient-to-br from-green-300 via-green-400 to-green-500 shadow-md rotate-3'}`}
              >
                {cell !== 0 && (
                  <div className="w-full h-full bg-green-400 rounded-sm shadow-inner flex items-center justify-center text-[6px] font-bold text-gray-800">
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
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-200 font-sans antialiased bg-cover bg-center"
      style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://images.unsplash.com/photo-1590283603417-106b0d9129d2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)' }}
    >
      <div className="flex-grow flex flex-col items-center justify-start pt-0 pb-0 w-full">
        <div className="w-full p-2">
          {/* HORIZONTAL HEADER */}
          <div className="flex items-center justify-between py-1 px-2 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-md shadow-lg border-2 border-gray-700 w-full">
            <button
              onClick={toggleBackgroundMusic}
              className="p-1 bg-gray-800 text-green-400 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
              aria-label={isMusicPlaying ? "Pause music" : "Play music"}
            >
              {isMusicPlaying ? <Music className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            </button>
            
            <div className="flex-grow flex items-center justify-center space-x-2">
              <span className="text-xs font-semibold text-green-300 drop-shadow">Cash:</span>
              <span className="text-sm font-bold text-white">${score}</span>
              <span className="text-xs font-semibold text-green-300 drop-shadow ml-4">Time:</span>
              <span className="text-sm font-bold text-white">{formatTime(timeLeft)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* NEXT piece and label are now side-by-side */}
              <h2 className="text-[8px] font-semibold text-green-300 drop-shadow">NEXT</h2>
              <div className="flex justify-center p-0.5">
                {renderNextPiece()}
              </div>
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold border-2 border-white">
                N
              </div>
            </div>
          </div>
          {/* END OF HORIZONTAL HEADER */}
        </div>
        
        <div className="relative border-4 border-green-500 p-1 bg-gray-950 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] rounded-md overflow-hidden mt-1 w-full flex-grow items-center justify-center">
          {renderBoard()}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-800 opacity-20 text-9xl font-extrabold tracking-tighter">$$$</span>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 w-full flex justify-center z-20">
        <div className="flex items-center justify-center gap-3 py-2 px-6 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-t-[30px] shadow-2xl border-t border-gray-700 w-full">
          <button
            onClick={() => handlePlayerAction('left')}
            className="p-1.5 bg-gradient-to-r from-gray-700 to-gray-800 text-green-400 rounded-full shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            aria-label="Move left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
  
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePlayerAction('rotate')}
              className="p-1.5 bg-gradient-to-r from-gray-700 to-gray-800 text-green-400 rounded-full shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
              aria-label="Rotate piece"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePlayerAction('down')}
              className="p-1.5 bg-gradient-to-r from-gray-700 to-gray-800 text-green-400 rounded-full shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
              aria-label="Soft drop"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
  
          <button
            onClick={() => handlePlayerAction('right')}
            className="p-1.5 bg-gradient-to-r from-gray-700 to-gray-800 text-green-400 rounded-full shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            aria-label="Move right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;