'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GoalTrackerFirebase from '../../../components/GoalTrackerFirebase';
import { auth } from '../../../lib/firebase';

export default function GoalTrackerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Hide the footer only on this page
  useEffect(() => {
    const footer = document.querySelector('.footerBar, .fixed.bottom-0, .mobile-footer');
    if (footer) {
      footer.style.display = 'none';
    }

    // ✅ Restore footer when leaving page
    return () => {
      if (footer) {
        footer.style.display = '';
      }
    };
  }, []);

  // ✅ Check authentication (same as before)
  useEffect(() => {
    if (auth && !auth.currentUser) {
      // router.push('/login'); // optional redirect
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading goals...</div>;
  }

  return (
    // ✅ Keep scrollable and full height layout
    <div className="h-full overflow-y-auto bg-gray-900 text-gray-50">
      <GoalTrackerFirebase />
    </div>
  );
}
