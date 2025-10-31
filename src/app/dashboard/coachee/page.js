"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Lock, LogIn, ShieldCheck, Star, CalendarDays } from "lucide-react";

// === Embedded Calendly Booking Component ===
function BookingForm() {
  const CALENDLY_URL =
    "https://calendly.com/dr_alaneme/mindhelpa-psychiatrist-led-coaching";

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <div
      className="bg-gray-50 flex flex-col items-center p-4 sm:p-8 font-sans"
      id="calendly-section"
    >
      {/* Header Card */}
      <div className="w-full max-w-4xl bg-white p-6 sm:p-6 rounded-xl shadow-lg mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">
          Book Your Appointment
        </h1>
        <p className="text-gray-600 text-lg">
          Select a date and time that works best for you directly in the
          calendar below.
        </p>
      </div>

      {/* Booking Widget Container */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        <div
          className="calendly-inline-widget"
          data-url={CALENDLY_URL}
          style={{
            minWidth: "320px",
            height: "700px",
          }}
        ></div>
      </div>

      {/* Footer / Instructions */}
      <div className="w-full max-w-4xl mt-6 p-4 text-center text-sm text-gray-500 hidden md:block">
        All bookings are automatically confirmed and added to your calendar.
        You will receive an email confirmation shortly after.
      </div>
    </div>
  );
}

// === Main Coachee Page ===
export default function CoacheePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef(null);

  // === Auth + Firestore Subscription Check ===
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            setSubscriptionStatus(data.activeSubscription || null);
          } else {
            setSubscriptionStatus(null);
          }
        } catch (err) {
          console.error("Error checking subscription:", err);
          setSubscriptionStatus(null);
        }
      } else {
        setSubscriptionStatus(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // === Scroll to Calendar ===
  const scrollToCalendar = () => {
    setTimeout(() => {
      document
        .getElementById("calendly-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // === Loading Spinner ===
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-3">Loading...</div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // === Not Logged In ===
  if (!user) {
    return (
      <AccessModal
        title="Please Log In"
        message="You need to log in to access psychiatrist-led coaching."
        buttonLabel="Login"
        onClick={() => router.push("/login")}
      />
    );
  }

  // === Logged In but Not Subscribed ===
  if (user && !subscriptionStatus) {
    return (
      <AccessModal
        title="Subscription Required"
        message="Access to psychiatrist-led coaching requires an active subscription."
        buttonLabel="Subscribe Now"
        onClick={() => router.push("/book-a-coach")}
      />
    );
  }

  // === Subscribed User ===
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-6 font-sans">
      {/* === Dashboard Card === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl bg-white rounded-2xl shadow-2xl p-8 text-center"
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-3">
          Welcome to Your Coaching Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          You are subscribed to psychiatrist-led coaching. Schedule your
          sessions below.
        </p>
        <motion.button
          onClick={scrollToCalendar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 mx-auto"
        >
          <CalendarDays size={20} />
          Book a Coaching Session
        </motion.button>
      </motion.div>

      {/* === Calendly Booking Form === */}
      <div ref={calendarRef} className="w-full mt-12">
        <BookingForm />
      </div>
    </div>
  );
}

/**
 * Reusable Modal Component
 */
function AccessModal({ title, message, buttonLabel, onClick }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center"
        >
          <div className="flex justify-center mb-4">
            {buttonLabel === "Login" ? (
              <Lock size={60} className="text-blue-600" />
            ) : (
              <Star size={60} className="text-yellow-500" />
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg hover:from-blue-700 hover:to-blue-900 flex items-center justify-center gap-2"
          >
            {buttonLabel === "Login" ? (
              <LogIn size={20} />
            ) : (
              <ShieldCheck size={20} />
            )}
            {buttonLabel}
          </motion.button>

          <p className="text-xs text-gray-400 mt-4">
            Psychiatrist-led coaching is available only for subscribed members.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
