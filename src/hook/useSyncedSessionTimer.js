'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { claimOrReuseSession, subscribeToSession, endSessionNow } from '@/lib/sessionTimer';

/**
 * Hook that ensures a single 30-min session per user and keeps a synced timer.
 * All tabs/devices for the same uid see the same remaining time.
 */
export function useSyncedSessionTimer({ uid, gameName, durationMs = 30 * 60 * 1000 }) {
  const [status, setStatus] = useState('loading'); // loading | active | ended
  const [remainingSec, setRemainingSec] = useState(0);

  // Claim/reuse the session at mount, then live-subscribe
  useEffect(() => {
    if (!uid || !gameName) return;

    let unsub = null;
    (async () => {
      try {
        await claimOrReuseSession({ uid, gameName, durationMs });
        unsub = subscribeToSession({
          uid,
          onChange: (state) => {
            setStatus(state.status);
            setRemainingSec(state.remainingSec);
          },
        });
      } catch (e) {
        console.error('claimOrReuseSession error:', e);
        setStatus('ended');
        setRemainingSec(0);
      }
    })();

    return () => unsub && unsub();
  }, [uid, gameName, durationMs]);

  // Local 1s tick so the UI counts smoothly between snapshots
  useEffect(() => {
    if (status !== 'active') return;
    const id = setInterval(() => {
      setRemainingSec((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  const actions = useMemo(
    () => ({
      endNow: async () => endSessionNow(uid),
    }),
    [uid]
  );

  return { status, remainingSec, ...actions };
}
