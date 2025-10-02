// File Path: /src/components/GoalTrackerFirebase.js

'use client';
// IMPORTANT: This directive MUST be the very first line for the component
// to run in the browser and enable access to localStorage, Date, etc.

// --- EXTERNAL LIBRARIES AND HOOKS ---
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use-window-size';

// --- FIREBASE IMPORTS ---
import { db, auth } from '../lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

// ------------------------------------
// --- AUDIO UTILITY FUNCTIONS ---
// ------------------------------------

const createAudioPlayer = (src) => {
  if (typeof window !== 'undefined') {
    const audio = new Audio(src);
    // Preload for quicker playback
    audio.load();
    return () => {
      // Reset and play
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Audio playback failed:", e));
    };
  }
  return () => {}; // No-op if not in browser
};

// Memoize players to avoid creating new elements on every render
const playClickSound = createAudioPlayer('/button-click.mp3');
const playClapSound = createAudioPlayer('/clap.mp3');
// NEW: Audio player for the goal update/save sound
const playGoalUpdateSound = createAudioPlayer('/goals.mp3');


// ------------------------------------
// --- DATE HELPER FUNCTIONS (KEPT FOR FIREBASE LOGIC BUT DISPLAYS REMOVED) ---
// ------------------------------------

// REMOVED: const formatDate = (date) => { ... }

const getStartOfDay = (dateString = null) => {
  const d = dateString ? new Date(dateString) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const getWeekId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
};

// ------------------------------------
// --- PERSISTENCE HELPER FUNCTIONS ---
// ------------------------------------

const LOCAL_STORAGE_KEY = 'dailyGoalInputDrafts';
const EXPIRY_HOURS = 24;

const getDrafts = () => {
  if (typeof window === 'undefined') {
    return ['', '', ''];
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      const now = new Date().getTime();
      if (now < data.expiry) {
        return data.drafts;
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error parsing goal drafts from localStorage:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }
  return ['', '', ''];
};

const saveDrafts = (drafts) => {
  if (typeof window !== 'undefined') {
    const now = new Date().getTime();
    const expiry = now + (EXPIRY_HOURS * 60 * 60 * 1000);
    const data = {
      drafts,
      expiry,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }
};


// ------------------------------------
// --- MAIN COMPONENT ---
// ------------------------------------

export default function GoalTrackerFirebase() {
  // --- STATE ---
  const [selectedTab, setSelectedTab] = useState('Daily Goal');
  const [dailyGoals, setDailyGoals] = useState([]);
  const [weeklyGoals, setWeeklyGoals] = useState([]);
  const [openedGoalIndex, setOpenedGoalIndex] = useState(null);
  // REMOVED: [trackerFilterDate, setTrackerFilterDate] useState - Defaulting to today's date for daily queries
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Authentication State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Form Draft State
  const [tempDailyGoalTexts, setTempDailyGoalTexts] = useState(getDrafts);
  const [tempWeeklyGoalTexts, setTempWeeklyGoalTexts] = useState(['', '', '']);

  // --- HOOKS / DERIVED VALUES ---
  const { width, height } = useWindowSize();

  const userId = user?.uid;
  const currentWeekId = getWeekId();

  const startOfToday = getStartOfDay();
  // Simplified for Daily Goal tab which now always focuses on Today
  const startOfFilteredDay = startOfToday;
  const endOfFilteredDay = new Date(startOfFilteredDay);
  endOfFilteredDay.setDate(endOfFilteredDay.getDate() + 1);

  // --- EFFECTS ---

  // Time/Date Header Effect (Kept for visual header display)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Formatting only the date string
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateString = now.toLocaleDateString('en-US', options);
      setCurrentDateTime(dateString);
    };

    updateTime();
    const timerId = setInterval(updateTime, 60000);

    return () => clearInterval(timerId);
  }, []);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // Firebase Data Subscription (READ/LISTEN)
  // startOfFilteredDay now always equals startOfToday, removing dependency
  useEffect(() => {
    if (!user) {
      setDailyGoals([]);
      setWeeklyGoals([]);
      return;
    }

    const goalsCollection = collection(db, 'goals');
    const currentUserId = user.uid;

    // 1. Daily Goals Listener (Always for today's date)
    const dailyGoalsQuery = query(
      goalsCollection,
      where('userId', '==', currentUserId),
      where('type', '==', 'daily'),
      where('targetDate', '>=', startOfToday),
      where('targetDate', '<', endOfFilteredDay),
      orderBy('targetDate', 'desc')
    );
    const unsubscribeDaily = onSnapshot(dailyGoalsQuery, (snapshot) => {
      setDailyGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 3));
    });

    // 2. Weekly Goals Listener
    const weeklyGoalsQuery = query(
      goalsCollection,
      where('userId', '==', currentUserId),
      where('type', '==', 'weekly'),
      where('targetWeek', '==', currentWeekId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribeWeekly = onSnapshot(weeklyGoalsQuery, (snapshot) => {
      setWeeklyGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 3));
    });

    return () => {
      unsubscribeDaily();
      unsubscribeWeekly();
    };
  }, [user, currentWeekId]); // Removed startOfFilteredDay as it's now fixed to startOfToday


  // ------------------------------------
  // --- FIREBASE WRITE/UPDATE HANDLERS ---
  // ------------------------------------

  const toggleGoal = async (goalId, currentStatus) => {
    if (!userId) return;
    const goalRef = doc(db, 'goals', goalId);
    try {
      await updateDoc(goalRef, {
        isDone: !currentStatus,
        updatedAt: serverTimestamp()
      });

      if (!currentStatus) {
        // Play sound and show confetti only when marking as DONE
        playClapSound();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

    } catch (error) {
      console.error("Error toggling goal status: ", error);
    }
  };

  const updateGoalTitle = async (goalId, newTitle) => {
    if (!userId || !newTitle.trim()) return;
    const goalRef = doc(db, 'goals', goalId);
    try {
      await updateDoc(goalRef, {
        title: newTitle.trim(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating goal title: ", error);
    }
  };

  const addNewGoal = async (type, title, index) => {
    const goalsList = type === 'daily' ? dailyGoals : weeklyGoals;
    if (!userId || !title.trim() || goalsList.length > 3) {
      return;
    }

    // If this is an existing goal, update it
    const existingGoal = goalsList[index];
    if (existingGoal) {
      await updateGoalTitle(existingGoal.id, title);
    } else {
      // Otherwise, add a new one
      const newGoalData = {
        userId: userId,
        title: title.trim(),
        type: type,
        isDone: false,
        createdAt: serverTimestamp(),
        // Daily goals are always set for startOfToday now
        ...(type === 'daily' && { targetDate: startOfToday }),
        ...(type === 'weekly' && { targetWeek: currentWeekId })
      };
      await addDoc(collection(db, 'goals'), newGoalData);
    }
    
    // Play the goal update sound when goal is saved/updated
    playGoalUpdateSound(); // NEW: Call the play function here

    setOpenedGoalIndex(null);

    // Update state and clear localStorage draft after successful Firebase save
    if (type === 'daily') {
      setTempDailyGoalTexts(prevTexts => {
        const newTexts = [...prevTexts];
        newTexts[index] = '';
        saveDrafts(newTexts);
        return newTexts;
      });
    } else if (type === 'weekly') {
      setTempWeeklyGoalTexts(prevTexts => {
        const newTexts = [...prevTexts];
        newTexts[index] = '';
        return newTexts;
      });
    }
  };


  // ------------------------------------
  // --- TRACKER/STREAK LOGIC (MEMOS) ---
  // ------------------------------------

  const completedDailyCount = useMemo(() => dailyGoals.filter(goal => goal.isDone).length, [dailyGoals]);
  const completedWeeklyCount = useMemo(() => weeklyGoals.filter(goal => goal.isDone).length, [weeklyGoals]);
  const dailyStreakScore = completedDailyCount;
  const weeklyStreakScore = completedWeeklyCount;
  const goalPlaceholders = [0, 1, 2];

  // ------------------------------------
  // --- RENDER HELPER FUNCTIONS ---
  // ------------------------------------

  // Reusable Accordion Goal Form Renderer
  const renderGoalAccordions = (type, tempGoalTexts, setTempGoalTexts) => {
    const goals = type === 'daily' ? dailyGoals : weeklyGoals;
    const isDaily = type === 'daily';

    const handleGoalClick = (index) => {
      setOpenedGoalIndex(openedGoalIndex === index ? null : index);

      if (goals[index]?.title && !tempGoalTexts[index]) {
        setTempGoalTexts(prevTexts => {
          const newTexts = [...prevTexts];
          newTexts[index] = goals[index].title;
          if (isDaily) saveDrafts(newTexts);
          return newTexts;
        });
      }
    };

    const handleTextChange = (e, index) => {
      setTempGoalTexts(prevTexts => {
        const newTexts = [...prevTexts];
        newTexts[index] = e.target.value;

        if (isDaily) {
          saveDrafts(newTexts);
        }
        return newTexts;
      });
    };

    const handleSave = (index) => {
      addNewGoal(type, tempGoalTexts[index], index);
    };

    // Since we removed the date filter, Daily Goals are always for 'Today' now
    const canEditOrToggle = (!authLoading && userId); // Editing is always possible for 'today' (current daily goals) or current weekly goals

    return (
      <div className="space-y-3 sm:space-y-4">
        {goalPlaceholders.map((index) => {
          const goal = goals[index];
          const isOpened = openedGoalIndex === index;
          const completionStatus = goal ? (goal.isDone ? 'Completed' : 'Active') : 'Not Set';

          const currentGoalText = tempGoalTexts[index] !== undefined ? tempGoalTexts[index] : goal?.title || '';

          return (
            <div key={index} className="border border-gray-700 rounded-lg overflow-hidden shadow-md">
              {/* Accordion Header */}
              <div
                className={`flex items-center justify-between p-3 sm:p-4 cursor-pointer transition-all duration-300 ${
                  goal?.isDone
                    ? 'bg-green-900/50'
                    : isOpened
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => handleGoalClick(index)}
              >
                <div className="flex items-center min-w-0">
                  <span className={`text-base sm:text-lg font-semibold ${goal?.isDone ? 'text-green-400' : 'text-indigo-400'}`}>
                    {/* MODIFICATION: Moved trophy to come before the goal number */}
                    {isDaily ? '🏆 GOAL' : '🏆 WEEKLY'} {index + 1}
                  </span>
                  <span className={`ml-2 sm:ml-3 text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                    goal?.isDone ? 'bg-green-700 text-green-200' : goal ? 'bg-indigo-700 text-indigo-200' : 'bg-gray-600 text-gray-300'
                  }`}>
                    {completionStatus}
                  </span>
                </div>

                {/* Current Goal Title (Preview) */}
                <div className="text-gray-400 truncate max-w-[50%] sm:max-w-md ml-2 flex-grow text-right text-sm">
                  {goal?.title || 'Click to set goal'}
                </div>

                <svg className={`w-5 h-5 ml-2 text-gray-400 transition-transform duration-300 ${isOpened ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Accordion Content (Form) */}
              {isOpened && (
                <div className="p-4 bg-gray-800 border-t border-gray-700">
                  <div className="space-y-4">
                    <label htmlFor={`goal-${index}-title`} className="block text-sm font-medium text-gray-400">
                      {isDaily ? 'Daily Goal Title:' : 'Weekly Goal Title:'}
                    </label>
                    <textarea
                      id={`goal-${index}-title`}
                      rows="2"
                      value={currentGoalText}
                      onChange={(e) => handleTextChange(e, index)}
                      placeholder="What exactly do you need to achieve?"
                      className="w-full p-3 border border-gray-600 bg-gray-900 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-base"
                      disabled={!canEditOrToggle}
                    />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                      {/* Save Button */}
                      <button
                        onClick={() => handleSave(index)}
                        disabled={!currentGoalText.trim() || !canEditOrToggle}
                        className={`w-full sm:w-auto px-5 py-2.5 text-white font-medium rounded-lg transition duration-150 ${
                          (!currentGoalText.trim() || !canEditOrToggle) ? 'bg-indigo-800/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                      >
                        {goal ? 'Update Goal' : 'Save Goal'}
                      </button>

                      {/* Unique Completion Checkbox/Button */}
                      {goal && (
                        <button
                          onClick={() => toggleGoal(goal.id, goal.isDone)}
                          disabled={!canEditOrToggle}
                          className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg font-bold transition duration-150 ${
                            !canEditOrToggle
                              ? 'bg-gray-900 text-gray-600 cursor-not-allowed'
                              : goal.isDone
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}
                        >
                          {goal.isDone ? '✅ ACHIEVED' : '⏳ MARK AS DONE'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDailyGoalForm = () => {
    // REMOVED: useEffect to reset filter date
    return renderGoalAccordions('daily', tempDailyGoalTexts, setTempDailyGoalTexts);
  };

  const renderWeeklyGoalForm = () => renderGoalAccordions('weekly', tempWeeklyGoalTexts, setTempWeeklyGoalTexts);


  // Tracker rendering function with mobile footer fix (pb-20)
  const renderTracker = () => (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* REMOVED: DATE FILTER UI */}

      {/* Daily Score Tracker (Always Reflects Today's Goals) */}
      <div className="p-5 sm:p-6 bg-gray-800 shadow-xl rounded-lg border-t-4 border-indigo-500">
        <h4 className="text-lg sm:text-xl font-bold text-indigo-400 mb-3">
          Daily Completion Score (Today)
        </h4>
        <p className="text-4xl sm:text-5xl font-extrabold text-white">
          {dailyStreakScore} / 3
        </p>
        <div className="mt-2 text-gray-400 text-sm">
          *Score based on today's goal completion.
        </div>
      </div>

      {/* Weekly Streak Tracker (Current Week) */}
      <div className="p-5 sm:p-6 bg-gray-800 shadow-xl rounded-lg border-t-4 border-teal-500">
        <h4 className="text-lg sm:text-xl font-bold text-teal-400 mb-3">
          Weekly Completion Score (Current Week: {currentWeekId})
        </h4>
        <p className="text-4xl sm:text-5xl font-extrabold text-white">
          {weeklyStreakScore} / 3
        </p>
        <div className="mt-2 text-gray-400 text-sm">
          *Complete all 3 goals to achieve your weekly focus.
        </div>
      </div>
    </div>
  );


  // ------------------------------------
  // --- MAIN RENDER LOGIC ---
  // ------------------------------------

  const tabContent = {
    'Daily Goal': renderDailyGoalForm(),
    'Weekly Goal': renderWeeklyGoalForm(),
    'Tracker': renderTracker(),
  };

  const tabs = ['Daily Goal', 'Weekly Goal', 'Tracker'];

  // Show a loading state while authentication is pending
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <p className="text-xl text-indigo-400 font-semibold">Loading authentication and data...</p>
      </div>
    );
  }

  // Check if the user is logged in after loading
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <p className="text-xl text-red-400 font-semibold">Please log in to track your goals.</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 p-4 sm:p-8">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
          tweenDuration={3000}
          colors={['#4F46E5', '#10B981', '#FCD34D', '#FFFFFF']}
        />
      )}

      <div className="max-w-4xl mx-auto">

        {/* TIME/DATE HEADER - Current Date Display (Kept for visual header) */}
        <div className="mb-2 overflow-hidden whitespace-nowrap border-y border-gray-700/50 py-1">
          <p className="text-base font-medium text-indigo-400 inline-block pr-10 animate-slow-marquee">
            <span className="font-semibold text-white ml-2">{currentDateTime}</span>
            <span className="font-semibold text-white ml-2">{currentDateTime}</span>
            <span className="font-semibold text-white ml-2">{currentDateTime}</span>
            <span className="font-semibold text-white ml-2">{currentDateTime}</span>
          </p>
        </div>

        {/* H1 TITLE */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-6">
          Focus Goal Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-8 sticky top-0 bg-gray-900 z-10 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                setOpenedGoalIndex(null);
                playClickSound();
              }}
              className={`flex-1 sm:flex-none py-3 px-3 sm:px-6 text-sm sm:text-lg font-medium transition-colors duration-200 focus:outline-none ${
                selectedTab === tab
                  ? 'border-b-4 border-indigo-500 text-indigo-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Box: bg-gray-800 */}
        <div className="bg-gray-800 shadow-2xl rounded-xl p-4 sm:p-8">
          {tabContent[selectedTab]}
        </div>
      </div>
    </div>
  );
}