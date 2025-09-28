"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

// 📚 FIREBASE IMPORTS (Assuming correctly configured in your lib)
import { 
  db, 
  auth 
} from "@/lib/firebase"; 
import {
  collection,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// --- ⚙️ CORE LOGIC HELPERS ---

/**
 * Checks if a given Date object falls on a weekend (Sunday=0, Saturday=6).
 * @param {Date} date - The date to check.
 * @returns {boolean} True if it is a weekend, false otherwise.
 */
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

/**
 * Converts 24-hour integer to a user-friendly AM/PM string.
 * @param {number} hour - The hour (0-23).
 * @returns {string} The formatted time string (e.g., "7 pm", "12 am").
 */
const formatHour = (hour) => {
  if (hour === 0) return "12 am";
  if (hour === 12) return "12 pm";
  if (hour < 12) return `${hour} am`;
  return `${hour - 12} pm`;
};

/**
 * Generates available time slots based on the day type.
 * Weekday (Mon-Fri): 7 PM to 11 PM (19:00 to 23:00)
 * Weekend (Sat-Sun): 9 AM to 11 PM (09:00 to 23:00)
 * @param {Date} date - The date object used to determine the time range.
 * @returns {Array<{value: string, label: string}>} An array of time slot objects.
 */
const generateTimeSlots = (date) => {
  const slots = [];
  let startHour, endHour;

  if (isWeekend(date)) {
    // Weekend slots: 9 AM (9) to 11 PM (23)
    startHour = 9;
    endHour = 23;
  } else {
    // Weekday slots: 7 PM (19) to 11 PM (23)
    startHour = 19;
    endHour = 23;
  }

  for (let h = startHour; h <= endHour; h++) {
    const hour24 = h.toString().padStart(2, '0');
    slots.push({
      value: `${hour24}:00`, // The 24-hour value for the database (e.g., "19:00")
      label: formatHour(h)    // The user-friendly AM/PM label (e.g., "7 pm")
    }); 
  }
  return slots;
};

/**
 * Gets today's date in 'YYYY-MM-DD' format, suitable for HTML date input's min attribute.
 * @returns {string} Today's date string.
 */
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- 🌟 REACT COMPONENT: CoacheeDashboard ---

export default function CoacheeDashboard() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("availability");
  const [user, setUser] = useState(null);
  const [dateStr, setDateStr] = useState(""); 
  const [time, setTime] = useState("");
  const [timeSlots, setTimeSlots] = useState([]); 
  const [mySession, setMySession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Computed value (remains constant)
  const minDate = getTodayDateString(); 

  // --- DATA FETCHING LOGIC ---

  /**
   * Fetches the user's currently booked session from Firestore.
   * @param {string} uid - The user's unique ID.
   */
  const fetchMySession = useCallback(async (uid) => {
    try {
      const sessionRef = doc(db, "sessions", uid);
      const sessionSnap = await getDoc(sessionRef);
      setMySession(sessionSnap.exists() ? sessionSnap.data() : null);
    } catch (e) {
      console.error("Error fetching session:", e);
      setError("Failed to load your session data.");
    }
  }, []); 

  // Effect 1: Authentication Listener & Initial Data Load
  useEffect(() => {
    let timeoutId;
    let isActive = true; 

    const unsub = onAuthStateChanged(auth, async (u) => {
      clearTimeout(timeoutId); 
      if (!isActive) return;

      setUser(u);
      
      if (u) {
        await fetchMySession(u.uid);
      }
      
      setLoading(false);
    });

    // Added FALLBACK: Set loading to false after a delay (5s timeout)
    timeoutId = setTimeout(() => {
      if (isActive && loading) {
        console.warn("Authentication or data fetch timed out. Rendering UI anyway.");
        setError("Connection timeout. Data may be incomplete.");
        setLoading(false);
      }
    }, 5000); 

    return () => {
      isActive = false; 
      unsub();
      clearTimeout(timeoutId); 
    };
  }, [fetchMySession]); 

  // Effect 2: Time Slot Generation (Date change logic)
  useEffect(() => {
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      // Append 'T00:00:00' to ensure correct date parsing in local time
      const dateObj = new Date(dateStr + "T00:00:00"); 
      
      if (!isNaN(dateObj.getTime())) {
        setTimeSlots(generateTimeSlots(dateObj));
      } else {
        setTimeSlots([]);
        console.error("Invalid date object created from:", dateStr);
      }
    } else {
      setTimeSlots([]);
    }
    // Reset time selection when date changes 
    setTime(""); 
  }, [dateStr]);

  // --- SESSION BOOKING LOGIC ---

  const lockSession = async () => {
    if (!user) {
      alert("You must be logged in to book a session.");
      return;
    }
    if (!dateStr || !time) {
      alert("Please pick a date and time");
      return;
    }
    if (!window.confirm("Once booked, you can't change this session. Proceed?")) {
      return;
    }

    const slotId = `${dateStr}_${time}`;

    try {
      // 1. Atomicity Check: Verify the slot is not already taken
      const sessionsRef = collection(db, "sessions");
      const q = query(sessionsRef, where("slotId", "==", slotId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        alert("Sorry, this time is already booked by someone else. Please select another slot.");
        return;
      }

      // 2. Book the session (Document ID = user.uid for uniqueness)
      await setDoc(doc(sessionsRef, user.uid), {
        uid: user.uid,
        email: user.email,
        date: dateStr, 
        time,
        slotId, 
        createdAt: new Date().toISOString(),
      });

      // 3. Update local state and UI
      await fetchMySession(user.uid); 
      setActiveTab("mySession");
      alert("Session successfully booked! 🎉");

    } catch (e) {
      console.error("Error booking session:", e);
      alert("An error occurred while trying to book your session.");
    }
  };

  // --- MEMOIZED HELPERS FOR JSX RENDERING ---

  // Create a Date object from the current date state, memoized for efficiency
  const selectedDateObject = useMemo(() => {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
    // Append 'T00:00:00' for correct local time parsing
    const d = new Date(dateStr + "T00:00:00");
    return isNaN(d.getTime()) ? null : d;
  }, [dateStr]);

  // Determine the time range display based on the selected date
  const getTimeRangeDisplay = (dateObj) => 
    isWeekend(dateObj) ? '9:00 AM to 11:00 PM' : '7:00 PM to 11:00 PM';

  // Helper for Day of the Week
  const getDayOfWeek = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // Use the same parsing method as elsewhere: append 'T00:00:00'
    const dateObj = new Date(dateString + 'T00:00:00'); 
    return days[dateObj.getDay()];
  };
  
  // --- EARLY EXIT CONDITIONS (LOADING, ERROR, UNATHENTICATED) ---

  if (loading) {
    // Mobile-friendly loading screen
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center p-8 bg-white shadow-xl rounded-xl w-full max-w-sm">
          <svg className="animate-spin h-6 w-6 text-blue-500 mx-auto mb-3" viewBox="0 0 24 24">
            {/* Simple spinner SVG */}
          </svg>
          <p className="text-gray-700 font-medium">Loading Dashboard Data...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 text-center text-red-600 bg-red-50 border border-red-200 rounded-lg shadow-md mt-8">
        <p className="font-bold text-xl mb-2">🛑 System Error</p>
        <p>Details: {error}. Please try refreshing the page or ensure you are logged in.</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 text-center text-red-700 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md mt-8">
        <p className="font-bold text-xl mb-2">🔒 Access Denied</p>
        <p>You must be logged in to view your personalized dashboard.</p>
      </div>
    );
  }

  // --- MAIN DASHBOARD RENDER ---
  return (
    // 🔑 MAIN CHANGE: Use 'p-4' for mobile and 'sm:p-8' for desktop.
    // Use 'max-w-lg' for a slightly tighter fit on desktop, keeping it well-contained.
    <div className="w-full max-w-lg mx-auto p-4 sm:p-8 bg-white shadow-2xl rounded-xl border border-gray-100 mt-0 sm:mt-8 mb-8">
      
      {/* Soft Error Notification */}
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Heads Up!</p>
          <p>{error}</p>
        </div>
      )}

      {/* Tab Navigation - Ensure horizontal scroll/stacking works if needed, but flex handles this well */}
      <div className="flex space-x-4 sm:space-x-6 border-b border-gray-200 mb-6 sm:mb-8 text-base sm:text-lg font-semibold">
        <button
          className={`pb-3 transition duration-150 ease-in-out ${
            activeTab === "availability" 
              ? "border-b-4 border-indigo-600 text-indigo-600" 
              : "text-gray-500 hover:text-indigo-500"
          }`}
          onClick={() => setActiveTab("availability")}
        >
          📅 Book Availability
        </button>
        <button
          className={`pb-3 transition duration-150 ease-in-out ${
            activeTab === "mySession" 
              ? "border-b-4 border-indigo-600 text-indigo-600" 
              : "text-gray-500 hover:text-indigo-500"
          }`}
          onClick={() => setActiveTab("mySession")}
        >
          ✅ My Session
        </button>
      </div>

      {/* --- TAB CONTENT: AVAILABILITY --- */}
      {activeTab === "availability" && (
        <div className="animate-fade-in">
          {mySession ? (
            // Session Already Booked Message
            <div className="p-4 sm:p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-xl text-green-700 font-bold">
                🎉 Session Booked!
              </p>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                You've successfully reserved a session. View details in the "My Session" tab.
              </p>
            </div>
          ) : (
            // Session Booking Form
            <div className="space-y-6">
              
              {/* Step 1: Date Picker */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 shadow-lg">
                <label className="block mb-2 font-extrabold text-lg sm:text-xl text-indigo-700">
                  <span className="text-xl sm:text-2xl mr-2">1.</span> Select a Date
                </label>
                <input
                  type="date"
                  min={minDate} 
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  // Input size optimized for mobile
                  className="border border-indigo-300 p-3 rounded-lg w-full text-base sm:text-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
              </div>

              {selectedDateObject && (
                <>
                  {/* Step 2: Day Type and Range Display */}
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md">
                    <label className="block mb-2 font-extrabold text-lg sm:text-xl text-gray-800">
                      <span className="text-xl sm:text-2xl mr-2">2.</span> Check Availability
                    </label>
                    <p className="text-sm sm:text-md text-gray-700">
                      This is a <strong className="text-indigo-600">{isWeekend(selectedDateObject) ? 'Weekend' : 'Weekday'}</strong>.
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 flex items-center">
                      <span className="inline-block h-2 w-2 mr-2 bg-green-500 rounded-full"></span>
                      Available Times: <strong className="text-green-700 ml-1">{getTimeRangeDisplay(selectedDateObject)}</strong>
                    </p>
                  </div>

                  {/* Step 3: Time Slot Dropdown */}
                  {timeSlots.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md">
                      <label className="block mb-2 font-extrabold text-lg sm:text-xl text-gray-800">
                        <span className="text-xl sm:text-2xl mr-2">3.</span> Choose Time Slot
                      </label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        // Input size optimized for mobile
                        className="border border-gray-300 p-3 rounded-lg w-full text-base sm:text-lg appearance-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                      >
                        <option value="">-- Select an available time --</option>
                        {timeSlots.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label} 
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Action Button */}
              <button
                onClick={lockSession}
                disabled={!dateStr || !time}
                // Button size optimized for mobile
                className="w-full bg-green-500 hover:bg-green-600 text-white text-lg sm:text-xl px-4 py-3 rounded-xl shadow-lg transition duration-200 ease-in-out disabled:bg-gray-400 disabled:shadow-none font-bold tracking-wide mt-6 sm:mt-8"
              >
                🔐 Lock In Your Session Time
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- TAB CONTENT: MY SESSION (UPDATED) --- */}
      {activeTab === "mySession" && (
        <div className="animate-fade-in">
          {mySession ? (
            <div className="p-4 sm:p-6 border border-indigo-300 rounded-xl bg-indigo-50 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-800 mb-4 flex items-center">
                <span className="mr-2">✨</span> Your Reserved Session
              </h3>
              
              <div className="space-y-3 text-base sm:text-lg">
                <p className="flex justify-between border-b pb-2">
                  <strong className="text-gray-600">Date:</strong> 
                  <span className="font-semibold text-gray-800">{mySession.date}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <strong className="text-gray-600">Time:</strong> 
                  <span className="font-semibold text-gray-800">
                    {formatHour(parseInt(mySession.time.split(':')[0]))} ({mySession.time})
                  </span>
                </p>
                
                {/* NEW ROW: Your Schedule */}
                <p className="flex justify-between pt-2">
                  <strong className="text-gray-600">Your Schedule:</strong> 
                  <span className="font-extrabold text-green-700 text-right">
                    Every {getDayOfWeek(mySession.date)} by {formatHour(parseInt(mySession.time.split(':')[0]))} 
                  </span>
                </p>
                {/* END NEW ROW */}
              </div>

              <p className="mt-6 text-xs sm:text-sm text-indigo-700 pt-4 border-t border-indigo-200">
                <span className="font-bold">IMPORTANT:</span> This session is locked. For any changes, please email support at
                <a
                  href="mailto:coachee@mindhelpa.com"
                  className="text-blue-600 hover:text-blue-800 underline ml-1 font-medium"
                >
                  coachee@mindhelpa.com
                </a>.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-base">
              <p className="text-gray-700">
                You haven't booked a session yet. Head over to the **Book Availability** tab to schedule your time!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}