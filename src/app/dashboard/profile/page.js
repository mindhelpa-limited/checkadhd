"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// --- Icon Components ---
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const MailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);

// --- Loader Component ---
const FullScreenLoader = ({ message }) => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    <p className="ml-4 text-gray-700">{message}</p>
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
    <div className="pb-24 md:pb-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Profile</h1>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Account Details</h2>
            
            {message && <p className={`text-center mb-4 p-3 rounded-lg ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>{message}</p>}

            <form onSubmit={handleUpdateProfile}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                        <div className="relative">
                            <UserIcon />
                            <input 
                                id="displayName"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <MailIcon />
                            <input 
                                id="email"
                                type="email"
                                value={userData?.email || ""}
                                readOnly
                                className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Subscription</h2>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-600">Your current plan:</p>
                    <p className="text-lg font-bold text-green-600 capitalize">{userData?.tier || 'Free'}</p>
                </div>
                <button 
                    onClick={handleManageSubscription}
                    disabled={isManagingSubscription || userData?.tier !== 'premium'}
                    className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isManagingSubscription ? 'Redirecting...' : 'Manage Subscription'}
                </button>
            </div>
        </div>
    </div>
  );
}
