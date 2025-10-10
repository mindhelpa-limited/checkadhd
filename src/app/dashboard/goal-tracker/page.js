// File Path: /src/app/dashboard/goal-tracker/page.js

// 1. Mark as client component if you use state, effects, or hooks like useRouter
//    (If the component you import, GoalTrackerFirebase, is client-side, 
//     this wrapper component must also be marked 'use client' if it imports client-side code).
'use client'; 

import React, { useEffect, useState } from 'react';

// FIX for error in image_dc0555.png: Use 'next/navigation' for the App Router
import { useRouter } from 'next/navigation'; 

// FIX for error in image_dd5fa2.png: Adjust the relative path.
// The structure is /src/app/dashboard/goal-tracker/page.js
// To reach /src/components/GoalTrackerFirebase, you must go up three levels:
// goal-tracker/ -> dashboard/ -> app/ -> src/components/
import GoalTrackerFirebase from '../../../components/GoalTrackerFirebase'; 

// Import Firebase Auth/DB references if needed here (adjust path as necessary)
// Assuming your Firebase setup is at /src/lib/firebase
// FIX: Corrected path for lib/firebase access from page.js
import { auth } from '../../../lib/firebase'; 


export default function GoalTrackerPage() {
    // You can use the router hook here since this component is marked 'use client'
    const router = useRouter(); 
    
    // Example state/effects for this wrapper component
    const [isLoading, setIsLoading] = useState(true);

    // Basic logic to check user status (requires the 'auth' import above)
    useEffect(() => {
        // You might replace this with an onAuthStateChanged listener 
        // in a real application or manage auth higher up.
        if (auth && !auth.currentUser) {
             // Example: Redirect unauthenticated users
             // router.push('/login'); 
        }
        setIsLoading(false);
    }, [router]);
    
    if (isLoading) {
        return <div className="p-8 text-center text-gray-400">Loading goals...</div>;
    }

    return (
        // FIX: Added h-full (height full) and overflow-y-auto 
        // to enable scrolling for all content on small screens.
        <div className="h-full overflow-y-auto">
            <GoalTrackerFirebase />
        </div>
    );
}
