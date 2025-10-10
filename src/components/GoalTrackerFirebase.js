'use client';
// IMPORTANT: This directive MUST be the very first line for the component
// to run in the browser and enable access to localStorage, Date, etc.

import React, { useState, useEffect, useMemo } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use-window-size';

// --- FIREBASE IMPORTS ---
import { db, auth } from '../lib/firebase'; // Assuming '../lib/firebase' is correct path
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

// --- DATE HELPER FUNCTIONS ---

const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const getStartOfDay = (dateString = null) => {
  const d = dateString ? new Date(dateString) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// --- PERSISTENCE HELPER FUNCTIONS (Modified for Zito Expiry) ---

const LOCAL_STORAGE_KEY_DAILY = 'dailyGoalInputDrafts';
// NEW: For Zito Daily Goal
const LOCAL_STORAGE_KEY_ZITO = 'zitoDailyGoalInputDrafts';
const DAILY_EXPIRY_HOURS = 24;
// MODIFIED: Zito expiry set to 168 hours (7 days)
const ZITO_EXPIRY_HOURS = 168;


const getDrafts = (key) => {
  if (typeof window === 'undefined') {
    return ['', '', ''];
  }

  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      const now = new Date().getTime();

      // Check for expiry
      if (now < data.expiry) {
        return data.drafts;
      } else {
        // Expired, clear and return empty
        localStorage.removeItem(key);
      }

    } catch (error) {
      console.error("Error parsing goal drafts from localStorage:", error);
      localStorage.removeItem(key);
    }
  }
  return ['', '', ''];
};

const getDailyDrafts = () => getDrafts(LOCAL_STORAGE_KEY_DAILY);
// NEW: Get Zito Drafts
const getZitoDrafts = () => getDrafts(LOCAL_STORAGE_KEY_ZITO);


const saveDrafts = (key, drafts) => {
  if (typeof window !== 'undefined') {
    let data = { drafts };
    const now = new Date().getTime();
    let expiryHours = 0;

    // Determine expiry based on key
    if (key === LOCAL_STORAGE_KEY_DAILY) {
      expiryHours = DAILY_EXPIRY_HOURS; // 24 hours
    } else if (key === LOCAL_STORAGE_KEY_ZITO) {
      expiryHours = ZITO_EXPIRY_HOURS; // 168 hours (7 days)
    }

    if (expiryHours > 0) {
      data.expiry = now + (expiryHours * 60 * 60 * 1000);
    }

    localStorage.setItem(key, JSON.stringify(data));
  }
};

const saveDailyDrafts = (drafts) => saveDrafts(LOCAL_STORAGE_KEY_DAILY, drafts);
// NEW: Save Zito Drafts
const saveZitoDrafts = (drafts) => saveDrafts(LOCAL_STORAGE_KEY_ZITO, drafts);


// --- MAIN COMPONENT ---

export default function GoalTrackerFirebase() {
  // --- STATE DECLARATIONS ---
  // UI State
  // 1. CHANGED: Initial tab name
  const [selectedTab, setSelectedTab] = useState('Daily Goal');
  const [openedGoalIndex, setOpenedGoalIndex] = useState(null);
  const [zitoOpenedGoalIndex, setZitoOpenedGoalIndex] = useState(null); // NEW: Zito Index State
  const [trackerFilterDate, setTrackerFilterDate] = useState(formatDate(new Date()));
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Data/Firebase State
  const [dailyGoals, setDailyGoals] = useState([]);
  const [zitoDailyGoals, setZitoDailyGoals] = useState([]); // NEW: Zito Goals State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Local Storage Draft State
  // Initialize drafts
  const [tempDailyGoalTexts, setTempDailyGoalTexts] = useState(getDailyDrafts);
  const [tempZitoGoalTexts, setTempZitoGoalTexts] = useState(getZitoDrafts); // NEW: Zito Draft State

  // Hooks & Derived Values
  const { width, height } = useWindowSize();
  const userId = user?.uid;

  const startOfToday = getStartOfDay();
  const startOfFilteredDay = getStartOfDay(trackerFilterDate);
  const endOfFilteredDay = new Date(startOfFilteredDay);
  endOfFilteredDay.setDate(endOfFilteredDay.getDate() + 1);

  // --- MEMOIZED CALCULATIONS ---
  const completedDailyCount = useMemo(() => dailyGoals.filter(goal => goal.isDone).length, [dailyGoals]);
  const completedZitoDailyCount = useMemo(() => zitoDailyGoals.filter(goal => goal.isDone).length, [zitoDailyGoals]); // NEW: Zito
  const dailyStreakScore = completedDailyCount + completedZitoDailyCount; // Combined score
  const goalPlaceholders = [0, 1, 2];


  // --- SIDE EFFECTS (useEffect) ---

  // TIME/DATE HEADER EFFECT
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const dateString = now.toLocaleDateString('en-US', options);
      setCurrentDateTime(dateString);
    };

    updateTime();
    const timerId = setInterval(updateTime, 60000);

    return () => clearInterval(timerId);
  }, []);

  // FIREBASE AUTH LISTENER
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // FIREBASE DATA SUBSCRIPTION (READ/LISTEN - Daily & Zito Daily)
  useEffect(() => {
    if (!user) {
      setDailyGoals([]);
      setZitoDailyGoals([]); // Clear Zito goals on sign out
      return;
    }

    const goalsCollection = collection(db, 'goals');
    const currentUserId = user.uid;

    // 1. Daily Goals Listener (type: 'daily')
    const dailyGoalsQuery = query(
      goalsCollection,
      where('userId', '==', currentUserId),
      where('type', '==', 'daily'),
      where('targetDate', '>=', startOfFilteredDay),
      where('targetDate', '<', endOfFilteredDay),
      orderBy('targetDate', 'desc')
    );
    const unsubscribeDaily = onSnapshot(dailyGoalsQuery, (snapshot) => {
      setDailyGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 3));
    });

    // 2. Zito Daily Goals Listener (NEW: type: 'zitodaily')
    const zitoDailyGoalsQuery = query(
      goalsCollection,
      where('userId', '==', currentUserId),
      where('type', '==', 'zitodaily'), // NEW goal type
      where('targetDate', '>=', startOfFilteredDay),
      where('targetDate', '<', endOfFilteredDay),
      orderBy('targetDate', 'desc')
    );
    const unsubscribeZitoDaily = onSnapshot(zitoDailyGoalsQuery, (snapshot) => {
      setZitoDailyGoals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 3));
    });


    return () => {
      unsubscribeDaily();
      unsubscribeZitoDaily(); // Unsubscribe Zito
    };
  }, [user, startOfFilteredDay]);

  // Reset filter date when switching to the main tabs (embedded here from renderGoalAccordions for better effect visibility)
  useEffect(() => {
    // 1. CHANGED: Updated tab name check
    if (selectedTab === 'Daily Goal' || selectedTab === 'Weekly Goal') {
      setTrackerFilterDate(formatDate(new Date()));
    }
  }, [selectedTab]);


  // --- FIREBASE WRITE/UPDATE FUNCTIONS (Actions) ---

  const toggleGoal = async (goalId, currentStatus) => {
    if (!userId) return;
    const goalRef = doc(db, 'goals', goalId);

    try {
      await updateDoc(goalRef, {
        isDone: !currentStatus,
        updatedAt: serverTimestamp()
      });

      if (!currentStatus) {
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
    // Now handles 'daily' and 'zitodaily' types
    if (type !== 'daily' && type !== 'zitodaily') return;

    const goalsList = type === 'daily' ? dailyGoals : zitoDailyGoals;

    if (!userId || !title.trim() || goalsList.length > 3) {
      return;
    }

    const existingGoal = goalsList[index];
    if (existingGoal) {
      await updateGoalTitle(existingGoal.id, title);
    } else {
      const newGoalData = {
        userId: userId,
        title: title.trim(),
        type: type,
        isDone: false,
        createdAt: serverTimestamp(),
        targetDate: startOfToday,
      };
      await addDoc(collection(db, 'goals'), newGoalData);
    }

    // Determine which state/storage to update
    const setTempGoalTexts = type === 'daily' ? setTempDailyGoalTexts : setTempZitoGoalTexts;
    const saveDraftsFunction = type === 'daily' ? saveDailyDrafts : saveZitoDrafts;
    const setOpenedIndex = type === 'daily' ? setOpenedGoalIndex : setZitoOpenedGoalIndex;

    setOpenedIndex(null);

    // Update state and clear localStorage draft after successful Firebase save
    setTempGoalTexts(prevTexts => {
      const newTexts = [...prevTexts];
      newTexts[index] = '';
      saveDraftsFunction(newTexts);
      return newTexts;
    });
  };


  // --- REUSABLE ACCORDION GOAL FORM RENDERER ---
  const renderGoalAccordions = (type, goals, tempGoalTexts, setTempGoalTexts, openedGoalIndex, setOpenedGoalIndex, isTrackerView = false) => {

    const saveDraftsFunction = type === 'daily' ? saveDailyDrafts : saveZitoDrafts;

    const handleGoalClick = (index) => {
      setOpenedGoalIndex(openedGoalIndex === index ? null : index);

      // If a goal is already saved, pull the saved title into the draft state for editing
      if (goals[index]?.title) {
        setTempGoalTexts(prevTexts => {
          const newTexts = [...prevTexts];
          // Use the saved title as the draft if the draft is currently empty.
          if (newTexts[index] === '') {
            newTexts[index] = goals[index].title;
          }
          saveDraftsFunction(newTexts);
          return newTexts;
        });
      }
    };

    const handleTextChange = (e, index) => {
      setTempGoalTexts(prevTexts => {
        const newTexts = [...prevTexts];
        newTexts[index] = e.target.value;

        saveDraftsFunction(newTexts);
        return newTexts;
      });
    };

    const handleSave = (index) => {
      addNewGoal(type, tempGoalTexts[index], index);
    };

    const isToday = formatDate(startOfFilteredDay) === formatDate(startOfToday);
    // Prevent editing/toggling if auth is loading or if it's a past period
    const canEditOrToggle = (!authLoading && userId) && isToday;

    return (
      <div className="space-y-3 sm:space-y-4">
        {/* READ-ONLY WARNING */}
        {!isToday && (selectedTab === 'Daily Goal' || selectedTab === 'Weekly Goal') && (
          <div className="p-4 bg-yellow-900/50 text-yellow-300 rounded-lg text-sm font-medium">
            Goals for **{new Date(startOfFilteredDay).toLocaleDateString()}** are read-only.
          </div>
        )}

        {/* Not-logged-in warning */}
        {!userId && !authLoading && (
          <div className="p-4 bg-red-900/50 text-red-300 rounded-lg text-sm font-medium">
            Please log in to set or track your goals.
          </div>
        )}

        {goalPlaceholders.map((index) => {
          const goal = goals[index];
          const isOpened = openedGoalIndex === index;
          const completionStatus = goal ? (goal.isDone ? 'Completed' : 'Active') : 'Not Set';

          // Goal text prioritization logic
          const currentGoalText = selectedTab === 'Tracker' ? (goal?.title || '') : (tempGoalTexts[index] || goal?.title || '');
          // Editing is only allowed in the main 'Daily Goal' tab (and Zito) and if it's for today
          const isGoalEditable = canEditOrToggle && (selectedTab !== 'Tracker');

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
                  } ${!isGoalEditable && selectedTab !== 'Tracker' ? 'opacity-75 cursor-default' : ''}`}
                onClick={() => isGoalEditable || selectedTab === 'Tracker' ? handleGoalClick(index) : null}
              >
                <div className="flex items-center min-w-0">
                  <span className={`text-base sm:text-lg font-semibold ${goal?.isDone ? 'text-green-400' : 'text-indigo-400'}`}>
                    {type.toUpperCase().replace('DAILY', '').replace('ZITO', '')} GOAL {index + 1}
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
                    <label htmlFor={`goal-${type}-${index}-title`} className="block text-sm font-medium text-gray-400">
                      {type === 'daily' ? 'Daily Goal Title:' : 'Weekly Goal Title:'}
                    </label>
                    <textarea
                      id={`goal-${type}-${index}-title`}
                      rows="2"
                      value={currentGoalText}
                      onChange={(e) => handleTextChange(e, index)}
                      placeholder="What exactly do you need to achieve?"
                      className="w-full p-3 border border-gray-600 bg-gray-900 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-base"
                      disabled={!isGoalEditable} // Only editable in main tabs for current period
                    />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                      {/* Save Button */}
                      <button
                        onClick={() => handleSave(index)}
                        // The button can save if we have current text AND is editable
                        disabled={!currentGoalText.trim() || !isGoalEditable}
                        className={`w-full sm:w-auto px-5 py-2.5 text-white font-medium rounded-lg transition duration-150 ${
                          (!currentGoalText.trim() || !isGoalEditable) ? 'bg-indigo-800/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                          }`}
                      >
                        {goal ? 'Update Goal' : 'Save Goal'}
                      </button>

                      {/* Unique Completion Checkbox/Button */}
                      {goal && (
                        <button
                          onClick={() => toggleGoal(goal.id, goal.isDone)}
                          disabled={!isGoalEditable} // Only togglable in main tabs for current period
                          className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg font-bold transition duration-150 ${
                            !isGoalEditable
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
                    {!isGoalEditable && selectedTab !== 'Tracker' && (
                      <p className="text-sm text-red-400 italic">This is a past period goal and cannot be edited or marked.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // --- TAB RENDERER FUNCTIONS ---

  const renderDailyGoalForm = () => {
    return renderGoalAccordions(
      'daily',
      dailyGoals,
      tempDailyGoalTexts,
      setTempDailyGoalTexts,
      openedGoalIndex,
      setOpenedGoalIndex,
      false
    );
  };

  // NEW: Render Zito Daily Goal Form
  const renderZitoDailyGoalForm = () => {
    return renderGoalAccordions(
      'zitodaily',
      zitoDailyGoals,
      tempZitoGoalTexts,
      setTempZitoGoalTexts,
      zitoOpenedGoalIndex,
      setZitoOpenedGoalIndex,
      false
    );
  };


  const renderTracker = () => (
    <div className="space-y-6 sm:space-y-8">
      {/* DAILY DATE FILTER UI */}
      <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
        <h3 className="text-xl font-semibold text-gray-200 mb-3">
          Historical Daily Goal Tracker
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <label htmlFor="daily-date-filter" className="text-sm font-medium text-gray-300 whitespace-nowrap">
            View Daily Goals for:
          </label>
          <input
            id="daily-date-filter"
            type="date"
            value={trackerFilterDate}
            onChange={(e) => setTrackerFilterDate(e.target.value)}
            className="w-full max-w-xs p-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark-mode-date-picker"
          />
        </div>

        <div className="mt-6 space-y-6">
          <h4 className="text-lg font-semibold text-indigo-300">Standard Daily Goals</h4>
          {/* RENDER STANDARD DAILY GOALS IN TRACKER VIEW */}
          {renderGoalAccordions('daily', dailyGoals, tempDailyGoalTexts, setTempDailyGoalTexts, openedGoalIndex, setOpenedGoalIndex, true)}

          <h4 className="text-lg font-semibold text-indigo-300">Weekly Goals</h4>
          {/* RENDER ZITO DAILY GOALS IN TRACKER VIEW */}
          {renderGoalAccordions('zitodaily', zitoDailyGoals, tempZitoGoalTexts, setTempZitoGoalTexts, zitoOpenedGoalIndex, setZitoOpenedGoalIndex, true)}
        </div>
      </div>

      {/* Daily Score Tracker (Reflects Filter Date) */}
      <div className="p-5 sm:p-6 bg-gray-800 shadow-xl rounded-lg border-t-4 border-indigo-500">
        <h4 className="text-lg sm:text-xl font-bold text-indigo-400 mb-3">
          Combined Daily Completion Score
        </h4>
        <p className="text-base text-gray-400 mb-1">
          Goals for: {new Date(trackerFilterDate).toLocaleDateString()}
        </p>
        <p className="text-4xl sm:text-5xl font-extrabold text-white">
          {dailyStreakScore} / 6
        </p>
        <div className="mt-2 text-gray-400 text-sm">
          *Score based on the date selected above, combining both Daily Goal sets (3 + 3 goals).
        </div>
      </div>
    </div>
  );


  // --- MAIN RENDER LOGIC ---

  // 4. CHANGED: Item in tabs array
  const tabs = ['Daily Goal', 'Weekly Goal', 'Tracker'];

  // 3. CHANGED: Key in tabContent object
  const tabContent = {
    'Daily Goal': renderDailyGoalForm(),
    'Weekly Goal': renderZitoDailyGoalForm(),
    'Tracker': renderTracker(),
  };

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

        {/* TIME/DATE HEADER */}
        <p className="text-lg font-medium text-indigo-400 mb-2">
          Hi, today is:
          <span className="font-semibold text-white ml-2">
            {currentDateTime}
          </span>
        </p>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-6">
          ✨ Focus Goal Dashboard
        </h1>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-8 sticky top-0 bg-gray-900 z-10 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSelectedTab(tab);
                // Reset index for the newly selected tab
                if (tab === 'Daily Goal') {
                  setOpenedGoalIndex(null);
                  setZitoOpenedGoalIndex(null);
                  // 5. CHANGED: Updated tab name check
                } else if (tab === 'Weekly Goal') {
                  setOpenedGoalIndex(null);
                  setZitoOpenedGoalIndex(null);
                } else {
                  setOpenedGoalIndex(null);
                  setZitoOpenedGoalIndex(null);
                }

                // Reset date filter to today when going back to Daily Goal tab
                // 6. CHANGED: Updated tab name check
                if (tab === 'Daily Goal' || tab === 'Weekly Goal') {
                  setTrackerFilterDate(formatDate(new Date()));
                }
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