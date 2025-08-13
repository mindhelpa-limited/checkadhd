'use client'; // This is a client-side component, required for hooks and state management

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';

// Define the structure for our session data stored in localStorage
const SESSION_STORAGE_KEY = 'gameSessionData';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes in milliseconds
const DAILY_LOCKOUT_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * A custom React hook to manage and enforce game session rules.
 * It handles session start, duration, and a 24-hour daily lockout.
 *
 * @param {string} currentGameName - The unique name of the game using this hook (e.g., "moneystack").
 * @returns {{
 * showPopup: boolean,
 * popupMessage: string,
 * isLockedOut: boolean,
 * isSessionActive: boolean,
 * timeLeft: number,
 * closePopup: () => void
 * }}
 */
function useGameSessionManager(currentGameName) {
  const router = useRouter();
  const [sessionState, setSessionState] = useState({
    activeGame: null,
    sessionStart: null,
    sessionEnd: null,
    dailyLockoutEnd: null,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // --- Functions to manage state ---

  const getSessionData = () => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem(SESSION_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : null;
    }
    return null;
  };

  const saveSessionData = (data) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    }
  };

  const endCurrentSession = () => {
    // Save the lockout timestamp
    const now = Date.now();
    const lockoutEnd = now + DAILY_LOCKOUT_MS;
    saveSessionData({
      activeGame: null,
      sessionStart: null,
      sessionEnd: null,
      dailyLockoutEnd: lockoutEnd,
    });
    // Update local state
    setSessionState({
      activeGame: null,
      sessionStart: null,
      sessionEnd: null,
      dailyLockoutEnd: lockoutEnd,
    });
    setIsLockedOut(true);
    setIsSessionActive(false);
    setTimeLeft(0);
  };

  const closePopup = () => {
    setShowPopup(false);
    // If the user closes a popup because a different game is running, redirect them.
    if (sessionState.activeGame && sessionState.activeGame !== currentGameName) {
      router.push(`/dashboard/recovery/${sessionState.activeGame}/session`);
    }
  };

  // --- Core logic in useEffect hooks ---

  // Effect to load initial state and set up the session
  useEffect(() => {
    const storedData = getSessionData();
    const now = Date.now();

    if (storedData) {
      const { activeGame, sessionEnd, dailyLockoutEnd } = storedData;

      // Check if the daily lockout is still active
      if (dailyLockoutEnd && now < dailyLockoutEnd) {
        setIsLockedOut(true);
        setPopupMessage('You have already played your daily session. Please try again tomorrow.');
        setShowPopup(true);
      }
      // Check if a different game is currently active
      else if (activeGame && activeGame !== currentGameName && now < sessionEnd) {
        setPopupMessage(`You have a session active for "${activeGame}". Please finish that session first.`);
        setShowPopup(true);
      }
      // Check if the current game is active and not finished
      else if (activeGame === currentGameName && now < sessionEnd) {
        setIsSessionActive(true);
        setSessionState(storedData);
      }
      // Session has expired, lock everything down for 24 hours
      else if (activeGame && now >= sessionEnd) {
        endCurrentSession();
      }
      // No active session or lockout, start a new one for this game
      else {
        const newSessionStart = now;
        const newSessionEnd = newSessionStart + SESSION_DURATION_MS;
        const newSessionData = {
          activeGame: currentGameName,
          sessionStart: newSessionStart,
          sessionEnd: newSessionEnd,
          dailyLockoutEnd: null,
        };
        saveSessionData(newSessionData);
        setSessionState(newSessionData);
        setIsSessionActive(true);
      }
    } else {
      // No data found, start a new session
      const newSessionStart = now;
      const newSessionEnd = newSessionStart + SESSION_DURATION_MS;
      const newSessionData = {
        activeGame: currentGameName,
        sessionStart: newSessionStart,
        sessionEnd: newSessionEnd,
        dailyLockoutEnd: null,
      };
      saveSessionData(newSessionData);
      setSessionState(newSessionData);
      setIsSessionActive(true);
    }
  }, [currentGameName, router]);

  // Effect to handle the countdown timer
  useEffect(() => {
    let timer = null;
    if (isSessionActive && sessionState.sessionEnd) {
      timer = setInterval(() => {
        const now = Date.now();
        const remaining = sessionState.sessionEnd - now;
        if (remaining > 0) {
          setTimeLeft(Math.floor(remaining / 1000)); // Time in seconds
        } else {
          // Session is over
          clearInterval(timer);
          endCurrentSession();
        }
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isSessionActive, sessionState.sessionEnd]);

  // --- Return values ---
  return {
    showPopup,
    popupMessage,
    isLockedOut,
    isSessionActive,
    timeLeft,
    closePopup,
  };
}

/**
 * A basic, reusable Popup component for displaying messages.
 */
function SessionPopup({ isOpen, message, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full mx-4 text-center border-4 border-indigo-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Session Alert</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md transform hover:scale-105"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

SessionPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

/**
 * A layout component that wraps game pages to enforce session logic.
 *
 * @param {object} props
 * @param {string} props.gameName - The unique name of the game (e.g., "moneystack").
 * @param {React.ReactNode} props.children - The game's content to be rendered inside the layout.
 */
export function GameSessionLayout({ gameName, children }) {
  const { isSessionActive, showPopup, popupMessage, timeLeft, closePopup } = useGameSessionManager(gameName);

  if (!isSessionActive) {
    return <SessionPopup isOpen={showPopup} message={popupMessage} onClose={closePopup} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 capitalize">{gameName} Game Session</h1>
      <p className="mt-4 text-xl font-medium">
        Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
      </p>
      <div className="w-full max-w-2xl mt-8 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        {children}
      </div>
    </main>
  );
}

GameSessionLayout.propTypes = {
  gameName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// Example usage in your page file (e.g., src/app/dashboard/recovery/moneystack/session/page.js)
//
// import { GameSessionLayout } from '@/hooks/useGameSessionManager';
//
// export default function MoneyStackSessionPage() {
//   return (
//     <GameSessionLayout gameName="moneystack">
//       {/* Your Money Stack game logic and UI goes here */}
//       <div>
//         <p>This is where the actual game content would be.</p>
//       </div>
//     </GameSessionLayout>
//   );
// }
