// src/app/dashboard/adhd-test/report/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Report from '../Report'; // Import your original Report component

// New FullScreenLoader component for data fetching state
const FullScreenLoader = ({ message }) => (
    <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-50 text-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4">{message}</p>
    </div>
);

export default function ReportPage() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.replace("/login");
                return;
            }

            try {
                const userDocRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.tier !== "premium") {
                        router.replace("/pricing");
                        return;
                    }
                    if (!data.lastTest || !data.answers) {
                        router.replace("/dashboard");
                        return;
                    }
                    setUserData(data);
                } else {
                    console.error("❌ No user document found in Firestore.");
                    router.replace("/pricing");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return <FullScreenLoader message="Loading your report..." />;
    }

    if (!userData || !userData.answers) {
        return <FullScreenLoader message="Error: Report data not found." />;
    }

    // Pass the fetched data down to the Report component
    return <Report userInfo={userData} answers={userData.answers} />;
}