import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Music, XCircle, ChevronLeft, ChevronRight, ChevronDown, RotateCcw } from 'lucide-react';
import * as Tone from 'tone';

const COLS = 15;
const ROWS = 20;
const INITIAL_SPEED = 600;

// Circular control sizing (px)
const CONTROL_SIZE = 180;
const CONTROL_GAP = 8;
// Everything below this horizontal line is “control area”
const FLOOR_CLEAR = CONTROL_SIZE / 2 + CONTROL_GAP + 8;

const SHAPES = [
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
  [[0,1,0,0],[0,1,1,1],[0,0,0,0],[0,0,0,0]],
  [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
  [[0,1,1,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],
  [[1,1,0,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]],
  [[1,1,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]],
];

const Game = ({ onNext, duration }) => {
  // ===== Disable page scrolling while mounted =====
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

  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [gameSpeed] = useState(INITIAL_SPEED);
  const [timeLeft, setTimeLeft] = useState(duration / 1000);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  const placementSoundPlayer = useRef(null);
  const backgroundMusicPlayer = useRef(null);

  useEffect(() => {
    const init = async () => {
      await Tone.start();
      placementSoundPlayer.current = new Tone.Player('/moneysound.mp3').toDestination();
      backgroundMusicPlayer.current = new Tone.Player('/meditation.mp3', () => {
        backgroundMusicPlayer.current.loop = true;
        backgroundMusicPlayer.current.volume.value = -10;
        setIsAudioLoaded(true);
      }).toDestination();
    };
    init();
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
      if (isMusicPlaying && backgroundMusicPlayer.current?.loaded) backgroundMusicPlayer.current.stop();
      onNext({ score, board });
      return;
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, isMusicPlaying, onNext, score, board]);

  // Piece helpers
  const generateNewPiece = useCallback(() => {
    const idx = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[idx];
    const x = Math.floor(COLS / 2) - Math.floor(shape[0].length / 2);
    const y = 0;
    return { shape, x, y };
  }, []);

  const isValidMove = useCallback((p, b) => {
    for (let r = 0; r < p.shape.length; r++) {
      for (let c = 0; c < p.shape[r].length; c++) {
        if (p.shape[r][c] !== 0) {
          const br = p.y + r;
          const bc = p.x + c;
          if (bc < 0 || bc >= COLS || br >= ROWS || (br >= 0 && b[br][bc] !== 0)) return false;
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
      const kept = prev.filter((row) => !row.every((cell) => cell !== 0));
      const cleared = ROWS - kept.length;
      if (cleared > 0) {
        setScore((s) => s + cleared * 100);
        const empty = Array.from({ length: cleared }, () => Array(COLS).fill(0));
        return [...empty, ...kept];
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
        case 'left': np.x--; break;
        case 'right': np.x++; break;
        case 'down': moveDown(); return;
        case 'rotate':
          np.shape = np.shape[0].map((_, col) => np.shape.map((row) => row[col]).reverse());
          break;
        default: return;
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

  // Spawn + keyboard
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

  // ===== RENDERING (crisp, solid blocks; no rotation) =====
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
      <div key={ri} className="flex leading-none">
        {row.map((cell, ci) => (
          <div
            key={ci}
            className={`w-6 h-6 border border-gray-700 box-content ${
              cell === 0
                ? 'bg-transparent'
                : 'bg-emerald-400'
            }`}
            style={{
              // crisp edges, no skew
              borderRadius: cell === 0 ? 0 : 3,
              boxShadow: cell === 0 ? 'none' : '0 2px 0 rgba(0,0,0,0.25), inset 0 0 2px rgba(255,255,255,0.25)',
            }}
          >
            {cell !== 0 && (
              <div className="w-full h-full flex items-center justify-center text-xs font-extrabold text-emerald-950">
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
    const shape = nextPiece.shape.slice(0, 2);
    return (
      <div className="p-0 bg-transparent rounded-md">
        {shape.map((row, ri) => (
          <div key={ri} className="flex leading-none">
            {row.map((cell, ci) => (
              <div
                key={ci}
                className={`w-1.5 h-1.5 ${cell === 0 ? 'bg-transparent' : 'bg-emerald-400'}`}
                style={{
                  borderRadius: cell === 0 ? 0 : 1,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
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
          <button
            onClick={toggleBackgroundMusic}
            className="p-1 bg-gray-800 text-green-400 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/50"
            aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
          >
            {isMusicPlaying ? <Music className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          </button>

          <div className="flex-grow flex items-center justify-center space-x-2">
            <span className="text-xs font-semibold text-emerald-300 drop-shadow">Cash:</span>
            <span className="text-sm font-bold text-white">${score}</span>
            <span className="text-xs font-semibold text-emerald-300 drop-shadow ml-4">Time:</span>
            <span className="text-sm font-bold text-white">{formatTime(timeLeft)}</span>
          </div>

          <div className="flex items-center space-x-2">
            <h2 className="text-[8px] font-semibold text-emerald-300 drop-shadow">NEXT</h2>
            <div className="flex justify-center p-0.5">{renderNextPiece()}</div>
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold border-2 border-white">
              N
            </div>
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
          }}
        >
          {/* Grid begins at top; keep room at bottom for controls */}
          <div className="w-full flex flex-col items-center" style={{ paddingBottom: FLOOR_CLEAR + 16 }}>
            {renderBoard()}
          </div>

          {/* >>> FLOOR LINE (clear boundary where blocks stop) <<< */}
          <div
            className="absolute left-0 right-0"
            style={{ bottom: FLOOR_CLEAR, height: 0, borderTop: '2px solid #10B981' /* emerald-500 */ }}
          />

          {/* Opaque mask under the circular control (no background peeking) */}
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
                onClick={() => handlePlayerAction('rotate')}
                className="w-10 h-10 rounded-full bg-gray-800 text-emerald-400 border border-emerald-500 shadow-lg active:scale-95 flex items-center justify-center"
                aria-label="Rotate"
              >
                <RotateCcw className="w-4 h-4" />
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
                onClick={() => handlePlayerAction('rotate')}
                className="w-12 h-12 rounded-full bg-emerald-400 text-gray-900 font-bold border border-white shadow-xl active:scale-95 flex items-center justify-center"
                aria-label="Rotate (Center)"
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

export default Game;
