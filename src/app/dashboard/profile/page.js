'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  Loader2,
  LogOut,
  CreditCard,
  UserCircle2,
} from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // ✅ Fetch user info
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
          if (data.name) setName(data.name);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Save changes
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

  // ✅ Manage Subscription
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
      <div className="h-screen flex items-center justify-center text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex justify-center py-10 px-5">
      <div className="w-full max-w-md bg-gray-800 rounded-3xl shadow-xl border border-gray-700 p-8 flex flex-col space-y-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">Your Profile</h1>

        {/* Profile Info */}
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-teal-400 font-semibold text-lg">
            <UserCircle2 size={20} /> Profile Information
          </h2>

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

          {message && (
            <p className="text-center text-gray-300 text-sm mt-2">{message}</p>
          )}
        </section>

        {/* Subscription Section */}
        <section className="space-y-4 pt-8 border-t border-gray-700">
          <h2 className="flex items-center gap-2 text-blue-400 font-semibold text-lg">
            <CreditCard size={20} /> Subscription
          </h2>

          <p className="text-sm text-gray-400 leading-relaxed">
            Manage or cancel your active subscriptions anytime.
          </p>

          <button
            onClick={handleManageSubscription}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            <CreditCard size={18} /> Manage Subscription
          </button>
        </section>

        {/* Logout Section */}
        <section className="pt-6 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            <LogOut size={18} /> Log Out
          </button>
        </section>
      </div>
    </div>
  );
}
