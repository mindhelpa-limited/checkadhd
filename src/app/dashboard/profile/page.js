'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from 'framer-motion';
import {
    UserCircleIcon,
    EnvelopeIcon,
    KeyIcon,
    CreditCardIcon,
    CheckCircleIcon,
    XCircleIcon,
    Cog6ToothIcon
} from "@heroicons/react/24/outline";

// --- Loader Component ---
const FullScreenLoader = ({ message }) => (
    <div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-200 font-medium">{message}</p>
    </div>
);

// --- Main Profile Page Component ---
export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [isManagingSubscription, setIsManagingSubscription] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push("/login");
                return;
            }
            setUser(currentUser);
            
            const userDocRef = doc(db, "users", currentUser.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData(data);
                setDisplayName(data.displayName || currentUser.displayName || "");
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!user) return;
        setMessage("");

        try {
            await updateProfile(user, { displayName: displayName });
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, { displayName: displayName }, { merge: true });
            setMessage("✅ Profile updated successfully!");
            setUserData(prev => ({...prev, displayName}));
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("❌ Failed to update profile. Please try again.");
        }
    };
    
    const handleManageSubscription = async () => {
        setIsManagingSubscription(true);
        setMessage("");
        try {
            const response = await fetch('/api/manage-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Could not open billing portal.");
            }

            const { url } = await response.json();
            window.location.href = url; // Redirect to the Stripe Customer Portal
        } catch (error) {
            setMessage(`❌ ${error.message}`);
            setIsManagingSubscription(false);
        }
    };

    if (loading) {
        return <FullScreenLoader message="Loading Your Profile..." />;
    }

    return (
        <div className="relative min-h-screen p-6 md:p-10 text-gray-200 bg-[#0A0A0A] overflow-hidden font-sans">
            {/* Pulsing background effect from the dashboard */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob" />
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob-delay" />
            </div>

            <div className="relative max-w-4xl mx-auto z-10 py-8">
                <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-2 flex items-center">
                    <Cog6ToothIcon className="h-10 w-10 text-purple-400 mr-4" />
                    Your Profile
                </h1>
                <p className="text-gray-400 text-lg mb-8">
                    Manage your account details and subscription.
                </p>

                {/* Account Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{
                        scale: 1.01,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.2)",
                    }}
                    className="group relative overflow-hidden p-6 md:p-8 rounded-3xl shadow-2xl border border-[#2c2c2c] transition-all duration-300 transform mb-8"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                    <div className="absolute inset-0.5 rounded-[calc(1.5rem+0.5px)] bg-black opacity-60 backdrop-blur-md"></div>
                    <div className="relative z-10">
                        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-200">
                            Account Details
                        </h2>
                        
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-center p-4 rounded-lg mb-4 text-sm font-semibold 
                                    ${message.startsWith('✅') ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'}`}
                            >
                                {message.startsWith('✅') ? <CheckCircleIcon className="h-5 w-5 mr-2" /> : <XCircleIcon className="h-5 w-5 mr-2" />}
                                <p>{message.substring(3).trim()}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div>
                                <label htmlFor="displayName" className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                                <div className="relative">
                                    <UserCircleIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <input 
                                        id="displayName"
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full p-4 pl-24 bg-[#1A1A1A] border border-[#2c2c2c] rounded-2xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <div className="relative">
                                    <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                                    <input 
                                        id="email"
                                        type="email"
                                        value={userData?.email || ""}
                                        readOnly
                                        className="w-full p-4 pl-24 bg-[#1A1A1A] border border-[#2c2c2c] rounded-2xl text-gray-500 cursor-not-allowed transition-all"
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                                >
                                    Save Changes
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Subscription Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{
                        scale: 1.01,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 130, 246, 0.2)",
                    }}
                    className="group relative overflow-hidden p-6 md:p-8 rounded-3xl shadow-2xl border border-[#2c2c2c] transition-all duration-300 transform"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-cyan-900 opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                    <div className="absolute inset-0.5 rounded-[calc(1.5rem+0.5px)] bg-black opacity-60 backdrop-blur-md"></div>
                    <div className="relative z-10">
                        <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center text-gray-200">
                            <CreditCardIcon className="h-6 w-6 mr-2 text-green-400" />
                            Subscription
                        </h2>
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                            <div>
                                <p className="text-gray-400">Your current plan:</p>
                                <p className="text-2xl font-extrabold text-green-400 capitalize">
                                    {userData?.tier || 'Free'}
                                </p>
                            </div>
                            <motion.button 
                                onClick={handleManageSubscription}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={isManagingSubscription || userData?.tier !== 'premium'}
                                className="w-full md:w-auto py-3 px-6 rounded-2xl shadow-lg font-semibold transition-all
                                    bg-gradient-to-r from-teal-500 to-green-600 text-white
                                    hover:shadow-xl hover:-translate-y-1
                                    disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none"
                            >
                                {isManagingSubscription ? 'Redirecting...' : 'Manage Subscription'}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
            
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap');
                
                body {
                    font-family: 'Inter', sans-serif;
                }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes blob-delay {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(-30px, 50px) scale(1.1); }
                    66% { transform: translate(20px, -20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 15s infinite ease-in-out; }
                .animate-blob-delay { animation: blob-delay 15s infinite ease-in-out; }
            `}</style>
        </div>
    );
}
