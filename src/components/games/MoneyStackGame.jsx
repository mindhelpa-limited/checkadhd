import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Music, XCircle, ChevronLeft, ChevronRight, ChevronDown, RotateCcw } from 'lucide-react';
import * as Tone from 'tone';

// Game constants
const COLS = 15;
const ROWS = 20;
const INITIAL_SPEED = 600; // milliseconds

// Define the shapes of the pieces (Tetris-style)
const SHAPES = [
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I
  [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]], // L
  [[0,1,0,0],[0,1,1,1],[0,0,0,0],[0,0,0,0]], // J
  [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]], // T
  [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]], // S
  [[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]], // Z
  [[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]], // O
];

const Game = ({ onNext, duration }) => {
  // ===== Disable scrolling globally while this component is mounted =====
  useEffect(() => {
    const { documentElement, body } = document;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlHeight = documentElement.style.height;
    const prevBodyHeight = body.style.height;

    documentElement.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    documentElement.style.height = '100%';
    body.style.height = '100%';

    // Prevent touch scroll / rubber-band
    const preventTouchScroll = (e) => {
      e.preventDefault();
    };
    window.addEventListener('touchmove', preventTouchScroll, { passive: false });

    return () => {
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      documentElement.style.height = prevHtmlHeight;
      body.style.height = prevBodyHeight;
      window.removeEventListener('touchmove', preventTouchScroll);
    };
  }, []);
  // =====================================================================

  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [gameSpeed] = useState(INITIAL_SPEED);
  const [timeLeft, setTimeLeft] = useState(duration / 1000); // seconds
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  // Tone.js
  const placementSoundPlayer = useRef(null);
  const backgroundMusicPlayer = useRef(null);

  useEffect(() => {
    const initializeAudio = async () => {
      await Tone.start();
      placementSoundPlayer.current = new Tone.Player('/moneysound.mp3', () => {
        // loaded
      }).toDestination();

      backgroundMusicPlayer.current = new Tone.Player('/meditation.mp3', () => {
        backgroundMusicPlayer.current.loop = true;
        backgroundMusicPlayer.current.volume.value = -10;
        setIsAudioLoaded(true);
      }).toDestination();
    };
    initializeAudio();

    return () => {
      placementSoundPlayer.current?.dispose();
      backgroundMusicPlayer.current?.dispose();
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
    if (placementSoundPlayer.current?.loaded) placementSoundPlayer.current.start();
  };

  const toggleBackgroundMusic = async () => {
    await Tone.start();
    if (!backgroundMusicPlayer.current?.loaded) return;
    if (isMusicPlaying) {
      backgroundMusicPlayer.current.stop();
      setIsMusicPlaying(false);
    } else {
      backgroundMusicPlayer.current.start();
      setIsMusicPlaying(true);
    }
  };

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      if (isMusicPlaying && backgroundMusicPlayer.current?.loaded) {
        backgroundMusicPlayer.current.stop();
      }
      onNext({ score, board });
      return;
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, isMusicPlaying, onNext, score, board]);

  // Piece helpers
  const generateNewPiece = useCallback(() => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[shapeIndex];
    const x = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2);
    const y = 0;
    return { shape, x, y };
  }, []);

  const isValidMove = useCallback((newPiece, newBoard) => {
    for (let r = 0; r < newPiece.shape.length; r++) {
      for (let c = 0; c < newPiece.shape[r].length; c++) {
        if (newPiece.shape[r][c] !== 0) {
          const br = newPiece.y + r;
          const bc = newPiece.x + c;
          if (bc < 0 || bc >= COLS || br >= ROWS || (br >= 0 && newBoard[br][bc] !== 0)) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback(() => {
    if (!currentPiece) return;
    playPlacementSound();

    setBoard((prev) => {
      const nb = prev.map((row) => [...row]);
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c] !== 0) {
            const br = currentPiece.y + r;
            const bc = currentPiece.x + c;
            if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) nb[br][bc] = 1;
          }
        }
      }
      return nb;
    });

    setBoard((prev) => {
      const filtered = prev.filter((row) => !row.every((cell) => cell !== 0));
      const cleared = ROWS - filtered.length;
      if (cleared > 0) {
        setScore((s) => s + cleared * 100);
        const empty = Array.from({ length: cleared }, () => Array(COLS).fill(0));
        return [...empty, ...filtered];
      }
      return prev;
    });

    const next = nextPiece;
    if (!isValidMove(next, board)) {
      setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    }
    setCurrentPiece(next);
    setNextPiece(generateNewPiece());
  }, [currentPiece, board, nextPiece, isValidMove, generateNewPiece]);

  const moveDown = useCallback(() => {
    if (!currentPiece) return;
    const np = { ...currentPiece, y: currentPiece.y + 1 };
    if (isValidMove(np, board)) setCurrentPiece(np);
    else placePiece();
  }, [currentPiece, board, isValidMove, placePiece]);

  const handlePlayerAction = useCallback(
    (action) => {
      if (!currentPiece) return;
      let np = { ...currentPiece };

      switch (action) {
        case 'left':
          np.x--;
          break;
        case 'right':
          np.x++;
          break;
        case 'down':
          moveDown();
          return;
        case 'rotate': {
          const rotated = np.shape[0].map((_, col) => np.shape.map((row) => row[col]).reverse());
          np.shape = rotated;
          break;
        }
        default:
          return;
      }
      if (isValidMove(np, board)) setCurrentPiece(np);
    },
    [currentPiece, board, isValidMove, moveDown]
  );

  // Auto-fall
  useEffect(() => {
    if (timeLeft > 0) {
      const i = setInterval(moveDown, gameSpeed);
      return () => clearInterval(i);
    }
  }, [moveDown, gameSpeed, timeLeft]);

  // Spawn piece + keyboard controls
  useEffect(() => {
    if (!currentPiece) {
      setCurrentPiece(generateNewPiece());
      setNextPiece(generateNewPiece());
    }
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') handlePlayerAction('left');
      if (e.key === 'ArrowRight') handlePlayerAction('right');
      if (e.key === 'ArrowDown') handlePlayerAction('down');
      if (e.key === 'ArrowUp' || e.key === ' ') handlePlayerAction('rotate');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentPiece, generateNewPiece, handlePlayerAction]);

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderBoard = () => {
    const combined = board.map((row) => [...row]);
    if (currentPiece) {
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c] !== 0) {
            const br = currentPiece.y + r;
            const bc = currentPiece.x + c;
            if (br >= 0 && br < ROWS && bc >= 0 && bc < COLS) combined[br][bc] = 1;
          }
        }
      }
    }
    return combined.map((row, ri) => (
      <div key={ri} className="flex">
        {row.map((cell, ci) => (
          <div
            key={ci}
            className={`w-6 h-6 p-0.5 border border-gray-700 ${
              cell === 0
                ? 'bg-gray-900'
                : 'bg-gradient-to-br from-green-300 via-green-400 to-green-500 shadow-md rotate-3'
            }`}
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
    const shapeToRender = nextPiece.shape.slice(0, 2);
    return (
      <div className="p-0 border-0 bg-gray-950 shadow-inner rounded-md">
        {shapeToRender.map((row, ri) => (
          <div key={ri} className="flex">
            {row.map((cell, ci) => (
              <div
                key={ci}
                className={`w-1.5 h-1.5 border border-gray-800 ${
                  cell === 0
                    ? 'bg-transparent'
                    : 'bg-gradient-to-br from-green-300 via-green-400 to-green-500 shadow-md rotate-3'
                }`}
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
    <div
      className="flex flex-col h-dvh bg-gray-950 text-gray-200 font-sans antialiased bg-cover bg-center select-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(https://images.unsplash.com/photo-1590283603417-106b0d9129d2?auto=format&fit=crop&w=1950&q=80)',
        touchAction: 'none', // extra guard for mobile gestures
      }}
    >
      {/* HEADER */}
      <div className="w-full p-2">
        <div className="flex items-center justify-between py-1 px-2 bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-md shadow-lg border-2 border-gray-700 w-full">
          <button
            onClick={toggleBackgroundMusic}
            className="p-1 bg-gray-800 text-green-400 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
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
            <h2 className="text-[8px] font-semibold text-green-300 drop-shadow">NEXT</h2>
            <div className="flex justify-center p-0.5">{renderNextPiece()}</div>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold border-2 border-white">
              N
            </div>
          </div>
        </div>
      </div>

      {/* GAME AREA */}
      <div className="relative flex-1 w-full px-2 pb-2">
        <div className="relative border-4 border-green-500 p-1 bg-gray-950 shadow-[inset_0_0_10px_rgba(255,255,255,0.1)] rounded-md overflow-hidden w-full h-full flex items-center justify-center">
          {/* grid */}
          <div>{renderBoard()}</div>

          {/* $$$ watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-800 opacity-20 text-9xl font-extrabold tracking-tighter">$$$</span>
          </div>

          {/* ===== Circular D-Pad controls (inside board, bottom center) ===== */}
          <div className="pointer-events-auto absolute bottom-3 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-gray-900/70 border border-green-500 shadow-2xl flex items-center justify-center">
            {/* 3x3 grid for arrows + center */}
            <div className="grid grid-cols-3 grid-rows-3 gap-2">
              <div />
              <button
                onClick={() => handlePlayerAction('rotate')}
                className="w-10 h-10 rounded-full bg-gray-800 text-green-400 border border-green-500 shadow-lg active:scale-95 flex items-center justify-center"
                aria-label="Rotate"
                title="Rotate"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div />

              <button
                onClick={() => handlePlayerAction('left')}
                className="w-10 h-10 rounded-full bg-gray-800 text-green-400 border border-green-500 shadow-lg active:scale-95 flex items-center justify-center"
                aria-label="Left"
                title="Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Center (bigger) */}
              <button
                onClick={() => handlePlayerAction('rotate')}
                className="w-12 h-12 rounded-full bg-green-400/90 text-gray-900 font-bold border border-white shadow-xl active:scale-95 flex items-center justify-center"
                aria-label="Rotate (Center)"
                title="Rotate"
              >
                ●
              </button>

              <button
                onClick={() => handlePlayerAction('right')}
                className="w-10 h-10 rounded-full bg-gray-800 text-green-400 border border-green-500 shadow-lg active:scale-95 flex items-center justify-center"
                aria-label="Right"
                title="Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div />
              <button
                onClick={() => handlePlayerAction('down')}
                className="w-10 h-10 rounded-full bg-gray-800 text-green-400 border border-green-500 shadow-lg active:scale-95 flex items-center justify-center"
                aria-label="Down"
                title="Down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <div />
            </div>
          </div>
          {/* ===== End circular controls ===== */}
        </div>
      </div>
      {/* Footer controls REMOVED entirely */}
    </div>
  );
};

export default Game;
