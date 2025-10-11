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
  UserCircle2,
  Calendar,
  DollarSign,
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userTiers, setUserTiers] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');

  // ✅ Fetch user + migrate old data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || '');
        setEmail(currentUser.email || '');

        const userRef = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();

          // 🛠 Migrate old tier → tiers
          if (!data.tiers && data.tier) {
            const newTiers = [
              { product: data.tier, type: 'onetime', date: new Date().toISOString(), price: '£50' },
            ];
            await updateDoc(userRef, { tiers: newTiers, updatedAt: new Date().toISOString() });
            setUserTiers(newTiers);
          } else if (data.tiers) setUserTiers(data.tiers);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(user, { displayName: name });
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { name, email });
      setMessage('✅ Profile updated successfully');
    } catch {
      setMessage('❌ Error updating profile');
    } finally {
      setSaving(false);
    }
  };

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

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 text-center border-b border-gray-700">
          <h1 className="text-2xl font-bold">Your Profile</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 text-sm font-medium">
          {[
            { key: 'profile', label: 'Profile', icon: <UserCircle2 size={16} /> },
            { key: 'subscription', label: 'Subscription', icon: <CreditCard size={16} /> },
            { key: 'purchases', label: 'Purchases', icon: <Package size={16} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all ${
                activeTab === tab.key
                  ? 'bg-gray-700 text-teal-400 border-b-2 border-teal-500'
                  : 'hover:bg-gray-700/40 text-gray-400'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 min-h-[400px] overflow-y-auto">

          {/* --- PROFILE TAB --- */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
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
                {saving ? <Loader2 className="animate-spin mr-2" /> : null}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              {message && <p className="text-center text-gray-300 text-sm">{message}</p>}
            </div>
          )}

          {/* --- SUBSCRIPTION TAB --- */}
          {activeTab === 'subscription' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Manage or cancel your active subscriptions anytime.
              </p>
              <button
                onClick={handleManageSubscription}
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <CreditCard size={18} /> Manage Subscription
              </button>
            </div>
          )}

          {/* --- PURCHASES TAB --- */}
          {activeTab === 'purchases' && (
            <div className="space-y-4">
              {userTiers.length > 0 ? (
                <ul className="space-y-3">
                  {userTiers.map((item, i) => (
                    <li
                      key={i}
                      className="bg-gray-700/60 border border-gray-600 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-teal-400 capitalize">
                          {item.product || 'Unknown Product'}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Calendar size={12} /> {formatDate(item.date)} &nbsp;•&nbsp;
                          <DollarSign size={12} /> {item.price || '—'}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          item.type === 'subscription' ? 'text-teal-400' : 'text-yellow-400'
                        }`}
                      >
                        {item.type === 'subscription' ? 'Subscription' : 'One-time'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm text-center">No purchased items found.</p>
              )}
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
