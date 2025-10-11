'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  Loader2,
  LogOut,
  CreditCard,
  Package,
  X,
  Clock,
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userTiers, setUserTiers] = useState([]);
  const [showPurchased, setShowPurchased] = useState(false);

  // ✅ Fetch user data and migrate old fields automatically
  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || '');
        setEmail(currentUser.email || '');

        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();

          // 🛠 Auto-migrate if old tier exists but new tiers doesn't
          if (!data.tiers && data.tier) {
            const newTiers = [
              {
                product: data.tier,
                type: 'onetime',
                date: new Date().toISOString(),
              },
            ];
            await updateDoc(userRef, {
              tiers: newTiers,
              updatedAt: new Date().toISOString(),
            });
            console.log(`🛠 Migrated old tier to new tiers for ${data.email}`);
            setUserTiers(newTiers);
          } else if (data.tiers && Array.isArray(data.tiers)) {
            setUserTiers(data.tiers);
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // ✅ Save name/email updates
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(user, { displayName: name });
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { name, email });
      setMessage('✅ Profile updated successfully');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Stripe customer portal
  const handleManageSubscription = async () => {
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      window.location.href = data.url;
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Logout
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown Date';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700 text-white space-y-8 relative">
        <h1 className="text-3xl font-bold text-center">Your Profile</h1>

        {/* Purchased Items Button */}
        {userTiers.length > 0 && (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => setShowPurchased(true)}
              className="bg-teal-600 hover:bg-teal-700 transition-all py-2 px-5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md"
            >
              <Package size={16} /> View Purchased Items
            </button>
          </div>
        )}

        {/* User Info */}
        <div className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-400"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-teal-500 hover:bg-teal-600 transition-all py-3 rounded-lg font-semibold flex items-center justify-center shadow-md disabled:opacity-70"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          {message && (
            <p className="text-center text-sm text-gray-300">{message}</p>
          )}
        </div>

        {/* Subscription Section */}
        <div className="pt-6 border-t border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium text-gray-300">
              <CreditCard size={18} /> Subscription
            </span>
            <button
              onClick={handleManageSubscription}
              className="bg-blue-600 hover:bg-blue-700 transition-all py-2 px-4 rounded-lg font-semibold text-sm flex items-center shadow-md"
            >
              Manage Subscription
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 transition-all py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>

        {/* Purchased Items Modal */}
        {showPurchased && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-700 relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setShowPurchased(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package size={18} /> Purchased Items
              </h2>
              {userTiers.length > 0 ? (
                <ul className="space-y-3">
                  {userTiers.map((item, i) => {
                    const productName =
                      typeof item === 'string' ? item : item.product;
                    const type =
                      typeof item === 'string'
                        ? 'onetime'
                        : item.type || 'onetime';
                    const date =
                      typeof item === 'string' ? null : item.date || null;

                    const isSub = type === 'subscription';
                    return (
                      <li
                        key={i}
                        className="bg-gray-700/60 border border-gray-600 rounded-lg px-4 py-3 text-sm text-gray-200 flex items-center justify-between"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {productName.charAt(0).toUpperCase() +
                              productName.slice(1)}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} /> {formatDate(date)}
                          </span>
                        </div>
                        <span
                          className={`${
                            isSub ? 'text-teal-400' : 'text-yellow-400'
                          } text-xs font-medium`}
                        >
                          {isSub ? 'Subscription' : 'One-time'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">
                  No purchased items found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
