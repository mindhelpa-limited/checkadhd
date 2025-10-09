"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getApps } from "firebase/app";

export default function TestPage() {
  const [user, setUser] = useState(null);
  const [booking, setBooking] = useState(null);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  const pushErr = (msg) => setErrors((prev) => [...prev, msg]);

  const fetchBookingForUser = async (u) => {
    setLoading(true);
    setErrors([]);
    setBooking(null);
    setSource(null);

    try {
      // Try 1: userId == uid
      const q1 = query(collection(db, "bookings"), where("userId", "==", u.uid));
      const s1 = await getDocs(q1);
      if (!s1.empty) {
        setBooking({ id: s1.docs[0].id, ...s1.docs[0].data() });
        setSource("query: userId == uid");
        setLoading(false);
        return;
      }
    } catch (e) {
      pushErr(`Query by userId failed: ${e?.message || e}`);
    }

    try {
      // Try 2: email == user.email
      if (u.email) {
        const q2 = query(
          collection(db, "bookings"),
          where("email", "==", u.email)
        );
        const s2 = await getDocs(q2);
        if (!s2.empty) {
          setBooking({ id: s2.docs[0].id, ...s2.docs[0].data() });
          setSource("query: email == user.email");
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      pushErr(`Query by email failed: ${e?.message || e}`);
    }

    try {
      // Try 3: direct doc id == uid
      const dref = doc(db, "bookings", u.uid);
      const dsnap = await getDoc(dref);
      if (dsnap.exists()) {
        setBooking({ id: dsnap.id, ...dsnap.data() });
        setSource("doc: bookings/{uid}");
        setLoading(false);
        return;
      }
    } catch (e) {
      pushErr(`Doc by UID failed: ${e?.message || e}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await fetchBookingForUser(u);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const projectInfo = (() => {
    try {
      const app = getApps()[0];
      return {
        appPresent: !!app,
        projectId: app?.options?.projectId || "unknown",
      };
    } catch {
      return { appPresent: false, projectId: "unknown" };
    }
  })();

  if (loading) return <div className="p-6">⏳ Loading…</div>;
  if (!user) return <div className="p-6 text-red-600">🔒 Please log in.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {/* Debug Info */}
      <div className="p-4 rounded border bg-gray-50">
        <div className="font-bold mb-1">Debug</div>
        <div>Firebase app present: {String(projectInfo.appPresent)}</div>
        <div>Project ID: {projectInfo.projectId}</div>
        <div>User UID: {user.uid}</div>
        <div>User Email: {user.email || "N/A"}</div>
        {errors.length > 0 && (
          <div className="mt-2 text-sm text-red-600">
            {errors.map((e, i) => (
              <div key={i}>• {e}</div>
            ))}
          </div>
        )}
        <button
          onClick={() => fetchBookingForUser(user)}
          className="mt-3 px-3 py-2 rounded bg-indigo-600 text-white"
        >
          Refresh
        </button>
      </div>

      {/* Booking Info */}
      {!booking ? (
        <div className="p-4 rounded border">
          ⚠️ No booking found for this user.  
          <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
            <li>Collection is <code>bookings</code></li>
            <li>
              Field must be <code>userId == {user.uid}</code> OR{" "}
              <code>email == {user.email}</code>
            </li>
            <li>Or the doc id equals the user UID</li>
          </ul>
        </div>
      ) : (
        <div className="p-6 rounded-xl shadow-lg border bg-white">
          <h2 className="text-xl font-bold mb-1">🔍 Booking</h2>
          <p className="text-sm text-gray-500 mb-4">source: {source}</p>
          <div className="space-y-1">
            <p><strong>ID:</strong> {booking.id}</p>
            <p><strong>Plan:</strong> {booking.plan || "N/A"}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-0.5 rounded ${
                  (booking.status || "").toLowerCase() === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {booking.status || "N/A"}
              </span>
            </p>
            <p><strong>Sessions:</strong> {booking.sessions ?? "N/A"}</p>
            {booking.timeframe && (
              <p><strong>Timeframe:</strong> {booking.timeframe}</p>
            )}
            {booking.slotDay && booking.slotTime && (
              <p>
                <strong>Locked Slot:</strong>{" "}
                Every Day {booking.slotDay} @ {booking.slotTime}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
