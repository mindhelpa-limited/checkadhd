// src/lib/sessionTimer.js
import {
  getFirestore,
  doc,
  runTransaction,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  setDoc,
} from 'firebase/firestore';

/**
 * Create or re-use a single active 30-min session for the user.
 * If a session exists and hasn't expired, we reuse it (so time doesn't reset).
 */
export async function claimOrReuseSession({ uid, gameName, durationMs = 30 * 60 * 1000 }) {
  const db = getFirestore();
  const ref = doc(db, 'users', uid, 'activeSession'); // one active doc per user

  const nowMs = Date.now();

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);

    // helper to write inside transaction
    const write = (data) =>
      tx.set(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });

    if (snap.exists()) {
      const data = snap.data();
      const endMs = data.sessionEnd?.toMillis?.() ?? 0;

      // If still active, just reuse it (no reset)
      if (nowMs < endMs) {
        // Optional: if it's a different game, block or just keep the original
        return;
      }
    }

    // No active session -> start a new 30-minute window
    const start = nowMs;
    const end = start + durationMs;

    return write({
      activeGame: gameName,
      sessionStart: Timestamp.fromMillis(start),
      sessionEnd: Timestamp.fromMillis(end),
      status: 'active',
    });
  });

  return ref; // so caller can subscribe
}

/**
 * Subscribe to the active session and get remaining seconds.
 * All tabs/devices see the same countdown because it’s based on sessionEnd.
 */
export function subscribeToSession({ uid, onChange }) {
  const db = getFirestore();
  const ref = doc(db, 'users', uid, 'activeSession');

  const unsub = onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      onChange({ exists: false, status: 'ended', remainingSec: 0, data: null });
      return;
    }
    const data = snap.data();
    const nowMs = Date.now();
    const endMs = data.sessionEnd?.toMillis?.() ?? 0;
    const remainingMs = Math.max(0, endMs - nowMs);

    onChange({
      exists: true,
      status: data.status ?? 'active',
      remainingSec: Math.floor(remainingMs / 1000),
      data,
    });
  });

  return unsub;
}

/** End the session immediately (optional helper). */
export async function endSessionNow(uid) {
  const db = getFirestore();
  const ref = doc(db, 'users', uid, 'activeSession');
  await setDoc(
    ref,
    { status: 'ended', sessionEnd: Timestamp.fromMillis(Date.now()), updatedAt: serverTimestamp() },
    { merge: true }
  );
}
