'use client';

import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { startOfDay, endOfDay } from 'date-fns';

import { auth, db } from '../../../lib/firebase'; // <-- matches your tree
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';

// Local fallback key (same one we used elsewhere)
const LS_KEY = 'adhd_results_history_v1';

// Helpers
const toTime = (d) => (d instanceof Date ? d.getTime() : new Date(d).getTime?.() ?? NaN);

export default function ADHDHistoryPage() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [rows, setRows] = useState([]);     // raw results (Firestore or local)
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('firestore'); // 'firestore' | 'local' | 'none'
  const [signedIn, setSignedIn] = useState(false);

  // Watch auth state
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setSignedIn(!!u));
    return () => unsub();
  }, []);

  // Subscribe to Firestore (if signed in) or load localStorage (if not)
  useEffect(() => {
    let unsub = null;
    setLoading(true);

    if (signedIn && auth.currentUser?.uid) {
      const uid = auth.currentUser.uid;
      const col = collection(db, 'users', uid, 'results');

      // Load a reasonable window and filter client-side by day
      const q = query(col, orderBy('takenAt', 'desc'), limit(200));
      unsub = onSnapshot(
        q,
        (snap) => {
          const list = snap.docs.map((d) => {
            const data = d.data();
            const ta =
              data?.takenAt?.toDate?.() ??
              (data?.takenAt ? new Date(data.takenAt) : null);
            return {
              id: d.id,
              takenAt: ta,
              scorePercentage: data?.scorePercentage ?? null,
              level: data?.level ?? '',
              riskLevelText: data?.riskLevelText ?? '',
            };
          });
          setRows(list);
          setSource('firestore');
          setLoading(false);
        },
        (err) => {
          console.error('onSnapshot error:', err);
          setRows([]);
          setSource('none');
          setLoading(false);
        }
      );

      return () => unsub && unsub();
    }

    // Local fallback (not signed in)
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
      const arr = raw ? JSON.parse(raw) : [];
      const list = arr
        .map((r) => ({
          id: r.id,
          takenAt: r.takenAt ? new Date(r.takenAt) : null,
          scorePercentage: r.scorePercentage ?? null,
          level: r.level ?? '',
          riskLevelText: r.riskLevelText ?? '',
        }))
        .sort((a, b) => (toTime(b.takenAt) || 0) - (toTime(a.takenAt) || 0));
      setRows(list);
      setSource('local');
    } catch (e) {
      console.error('Local history read failed:', e);
      setRows([]);
      setSource('none');
    } finally {
      setLoading(false);
    }
  }, [signedIn]);

  // Client-side filter by selected day (or show all if null)
  const filtered = useMemo(() => {
    if (!selectedDay) return rows;
    const s = startOfDay(selectedDay).getTime();
    const e = endOfDay(selectedDay).getTime();
    return rows.filter((r) => {
      const t = toTime(r.takenAt);
      return Number.isFinite(t) && t >= s && t <= e;
    });
  }, [rows, selectedDay]);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your ADHD Test History</h1>
        <span className="text-xs text-gray-500">
          {source === 'firestore' ? 'Synced' : source === 'local' ? 'This device only' : '—'}
        </span>
      </header>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-400">Filter by day</label>
        <DatePicker
          selected={selectedDay}
          onChange={(date) => setSelectedDay(date)}
          dateFormat="yyyy-MM-dd"
          className="border rounded px-3 py-2 bg-transparent text-white"
          maxDate={new Date()}
          placeholderText="Select a date"
          calendarClassName="bg-gray-900 text-white border border-gray-700 rounded-lg p-2"
          // Popper styling fix for dark backgrounds
          popperProps={{ strategy: 'fixed' }}
        />
        <button
          className="text-sm underline"
          onClick={() => setSelectedDay(new Date())}
        >
          Today
        </button>
        <button
          className="text-sm underline"
          onClick={() => {
            const d = new Date();
            d.setDate(d.getDate() - 1);
            setSelectedDay(d);
          }}
        >
          Yesterday
        </button>
        <button
          className="text-sm underline"
          onClick={() => setSelectedDay(null)}
          title="Show all results (no day filter)"
        >
          Show all
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400">
          {signedIn ? (
            <>
              No reports for the selected day.
              <div className="text-xs mt-1">
                Tip: tap <em>Show all</em> to confirm results exist, or ensure each save includes a <code>takenAt</code> timestamp.
              </div>
            </>
          ) : (
            <>
              No reports found on this device for the selected day.
              <div className="text-xs mt-1">Sign in to sync results across devices.</div>
            </>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => {
            const dt = r.takenAt ? new Date(r.takenAt) : null;
            const timeStr = dt
              ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '—';
            return (
              <li
                key={r.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {r.scorePercentage ?? '—'}% • {r.level || '—'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Taken at {timeStr} • {r.riskLevelText || '—'}
                  </div>
                </div>
                <a className="text-sm underline" href={`/results/${r.id}`}>
                  Open
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
