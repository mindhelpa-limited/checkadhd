// src/app/results/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { fetchResultById } from "../../../lib/resultsSaver";
import Report from "../../dashboard/adhd-test/Report";

export default function ResultPermalink() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [authReady, setAuthReady] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wait for Firebase auth to resolve (required by your Firestore rules)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Fetch once we have both: id and auth ready
  useEffect(() => {
    let active = true;
    (async () => {
      if (!id || !authReady) return;
      setLoading(true);
      try {
        const r = await fetchResultById(id);
        if (active) setItem(r || null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id, authReady]);

  if (!id) {
    return <main className="max-w-5xl mx-auto p-6">Invalid result link.</main>;
  }

  if (loading) {
    return <main className="max-w-5xl mx-auto p-6">Loading…</main>;
  }

  if (!item) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        Not found or you don’t have access.
        <div className="text-sm text-gray-500 mt-2">
          Make sure you’re signed in with the same account that created this result.
        </div>
      </main>
    );
  }

  // Build props for Report.jsx
  const userInfo = {
    name: item.userName || "",
    sex: item.sex || "",
    dob: item.dob || "",
  };

  // Pass Firestore Timestamp directly; Report checks `.seconds`
  const assessmentTimestamp = item.assessmentTimestamp || null;
  const answers = Array.isArray(item.answers) ? item.answers : [];

  return (
    <main className="max-w-5xl mx-auto p-6">
      <Report
        userInfo={userInfo}
        answers={answers}
        assessmentTimestamp={assessmentTimestamp}
      />
    </main>
  );
}
