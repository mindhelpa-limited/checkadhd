"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

export default function MySessionsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [stripeReceipt, setStripeReceipt] = useState(null); // read-only receipt from Stripe
  const [loadingReceipt, setLoadingReceipt] = useState(!!sessionId);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [activeTab, setActiveTab] = useState("bookings"); // bookings | profile

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoadingUser(false);
    });
    return () => unsub();
  }, []);

  // Fetch receipt directly from Stripe if session_id present (read-only)
  useEffect(() => {
    const go = async () => {
      if (!sessionId) {
        setLoadingReceipt(false);
        return;
      }
      try {
        const res = await fetch(`/api/stripe/retrieve-session?session_id=${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch session");
        const data = await res.json();
        setStripeReceipt(data);
      } catch (e) {
        console.error("retrieve-session error:", e);
      } finally {
        setLoadingReceipt(false);
      }
    };
    go();
  }, [sessionId]);

  // Load bookings from Firestore (saved by your webhook) under users/{uid}/bookings
  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoadingBookings(false);
        return;
      }
      try {
        const snap = await getDocs(collection(db, "users", user.uid, "bookings"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setBookings(list);
      } catch (e) {
        console.error("load bookings error:", e);
      } finally {
        setLoadingBookings(false);
      }
    };
    load();
  }, [user]);

  const stillLoading = loadingUser || loadingReceipt || loadingBookings;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {/* Tabs footer (mobile) handled below; desktop is simple */}
        {activeTab === "bookings" && (
          <>
            <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

            {stillLoading && <p className="text-gray-500">Loading…</p>}

            {/* Stripe Receipt (read-only, immediate feedback after payment) */}
            {!loadingReceipt && stripeReceipt && (
              <div className="mb-6 rounded-xl border bg-white p-5 shadow">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Payment Receipt
                </h2>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Plan:</span>{" "}
                    {stripeReceipt.planName || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {stripeReceipt.category || "Coaching"}
                  </p>
                  <p>
                    <span className="font-medium">Coach:</span>{" "}
                    {stripeReceipt.coachName || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Sessions:</span>{" "}
                    {stripeReceipt.sessions || "—"}
                  </p>
                  <p>
                    <span className="font-medium">Slots:</span>{" "}
                    {Array.isArray(stripeReceipt.slots)
                      ? stripeReceipt.slots.map((s) => `${s.day} ${s.time}`).join(", ")
                      : "—"}
                  </p>
                  <p>
                    <span className="font-medium">Amount Paid:</span>{" "}
                    {(stripeReceipt.currency || "gbp").toUpperCase()}{" "}
                    {stripeReceipt.price}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Charged on:{" "}
                    {stripeReceipt.createdAt
                      ? new Date(stripeReceipt.createdAt).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
            )}

            {/* Firestore bookings (source of truth; saved by webhook) */}
            {!stillLoading && (
              <>
                {bookings.length === 0 ? (
                  <p className="text-gray-500">
                    {stripeReceipt
                      ? "Your payment was successful. Your booking will appear here shortly."
                      : "No bookings yet."}
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {bookings.map((b) => {
                      const slots = Array.isArray(b.slots)
                        ? b.slots
                        : (() => {
                            try {
                              return JSON.parse(b.slots || "[]");
                            } catch {
                              return [];
                            }
                          })();
                      return (
                        <li key={b.id} className="p-5 rounded-lg shadow bg-white border">
                          <p className="font-semibold text-gray-900 text-lg">
                            {b.planName || "Booking"} — {b.category || "Coaching"}
                          </p>
                          <p className="text-sm text-gray-700">
                            Coach: <strong>{b.coachName || "—"}</strong>
                          </p>
                          <p className="text-sm text-gray-700">Sessions: {b.sessions || "—"}</p>
                          <p className="text-sm text-gray-700">
                            Slots: {slots.length ? slots.map((s) => `${s.day} ${s.time}`).join(", ") : "—"}
                          </p>
                          <p className="text-sm text-gray-700">
                            Amount Paid: {(b.currency || "gbp").toUpperCase()} {b.price}
                          </p>
                          <p className="text-xs text-gray-500">
                            Booked on:{" "}
                            {b.createdAt
                              ? new Date(
                                  typeof b.createdAt === "number"
                                    ? b.createdAt
                                    : b.createdAt.seconds
                                    ? b.createdAt.seconds * 1000
                                    : b.createdAt
                                ).toLocaleString()
                              : "—"}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </>
        )}

        {activeTab === "profile" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            {user ? (
              <div className="bg-white p-4 rounded-xl shadow">
                <p className="text-lg font-semibold">Welcome, {user.email}</p>
                <p className="text-gray-600">Profile settings coming soon.</p>
              </div>
            ) : (
              <p className="text-gray-500">Not logged in.</p>
            )}
          </div>
        )}
      </div>

      {/* Footer Nav (mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow flex">
        <button
          className={`flex-1 py-3 font-semibold ${
            activeTab === "bookings" ? "text-indigo-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("bookings")}
        >
          My Bookings
        </button>
        <button
          className={`flex-1 py-3 font-semibold ${
            activeTab === "profile" ? "text-indigo-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
      </div>
    </div>
  );
}
