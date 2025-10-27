'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, User, ChevronDown, Loader2, Star, ShieldCheck, Zap, Target } from 'lucide-react';

// --- FIREBASE/AUTHENTICATION SETUP ---
// NOTE: Replaced Next.js/Local imports with self-contained logic
let auth;
let db;
let initialized = false;

const initializeFirebase = async (setUserId, setIsAuthReady) => {
  try {
    const { initializeApp } = await import('firebase/app');
    const { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } = await import('firebase/auth');
    const { getFirestore } = await import('firebase/firestore');

    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

    if (!Object.keys(firebaseConfig).length) {
      console.error("Firebase config is missing.");
      setIsAuthReady(true);
      return;
    }

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);

    // Authentication logic
    const handleAuth = async () => {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken).catch(e => {
                console.error("Error signing in with custom token:", e);
                signInAnonymously(auth);
            });
        } else {
            await signInAnonymously(auth);
        }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(crypto.randomUUID()); // Use a random ID for anonymous/unauthenticated users
      }
      setIsAuthReady(true);
    });

    if (!auth.currentUser) {
        await handleAuth();
    } else {
        setIsAuthReady(true);
    }

    initialized = true;
  } catch (e) {
    console.error("Failed to initialize Firebase:", e);
    setIsAuthReady(true);
  }
};


// --- STATIC DATA AND CONTENT (No change) ---

const COACHING_CONTENT = {
  title: 'Psychiatrist-Led Coaching',
  body: (
    <div className="bg-gray-800/60 p-5 sm:p-8 rounded-xl border border-blue-700/50 shadow-inner shadow-black/50">
      <ul className="space-y-6 text-left">
        <li className="flex items-start border-l-4 border-blue-500 pl-4">
          <ShieldCheck size={24} className="text-green-400 mr-3 mt-1 shrink-0" />
          <div>
            <strong className="text-lg text-blue-200 font-extrabold block mb-1">Confidential & Customised Care</strong>
            <p className="text-gray-300 text-base mt-1">
              Coaching from Psychiatrists with experience in managing complex mental health issues, including:
            </p>
            <ul className="list-disc list-inside ml-5 mt-2 space-y-1 text-xs text-gray-400">
              <li>Anxiety and Depression</li>
              <li>Personality Disorders</li>
              <li>Phobias and Substance Misuse</li>
            </ul>
          </div>
        </li>
        <li className="flex items-start border-l-4 border-blue-500 pl-4">
          <Zap size={24} className="text-yellow-400 mr-3 mt-1 shrink-0" />
          <div>
            <strong className="text-lg text-blue-200 font-extrabold block mb-1">Build Resilience and Renew Purpose</strong>
            <p className="text-gray-300 text-base mt-1">
              Our core focus is on practical skills and recovery:
            </p>
            <ul className="list-disc list-inside ml-5 mt-2 space-y-1 text-xs text-gray-400">
              <li>Enhance resilience and develop coping skills.</li>
              <li>Acquire actionable tools to find renewed purpose.</li>
              <li>Establish a clear path to recovery.</li>
            </ul>
          </div>
        </li>
        <li className="flex items-start border-l-4 border-blue-500 pl-4">
          <Target size={24} className="text-red-400 mr-3 mt-1 shrink-0" />
          <div>
            <strong className="text-lg text-blue-200 font-extrabold block mb-1">Structured, High-Impact Weekly Goals</strong>
            <p className="text-gray-300 text-base mt-1">
              Sessions are goal-oriented to maximize your progress and stability:
            </p>
            <ul className="list-disc list-inside ml-5 mt-2 space-y-1 text-xs text-gray-400">
              <li>Help you accomplish specific tasks week-by-week.</li>
              <li>Actively minimise risks of relapse or burnout.</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  ),
};

const INDIVIDUAL_PRICING = [
  { tier: 'Monthly', sessions: '4 sessions', duration: '1 month', price: '£1,000', product: 'coaching_individual_monthly' },
  { tier: 'Quarterly', sessions: '12 sessions', duration: '3 months', price: '£2,900', savings: 'Save £100', product: 'coaching_individual_quarterly', recommended: true },
  { tier: '6-Months', sessions: '24 sessions', duration: '6 months', price: '£5,650', savings: 'Save £350', product: 'coaching_individual_6month' },
  { tier: 'Yearly', sessions: '48 sessions', duration: '1 year', price: '£10,000', savings: 'Save £2,000', product: 'coaching_individual_yearly' },
];

const SMALL_GROUP_PRICING = [
  { tier: 'Monthly', sessions: '4 weekly sessions', persons: '1-5 persons', price: '£2,000', product: 'coaching_smallgroup_monthly' },
  { tier: 'Quarterly', sessions: '12 weekly sessions', persons: '1-5 persons', price: '£5,800', savings: 'Save £200', product: 'coaching_smallgroup_quarterly', recommended: true },
  { tier: '6-Months', sessions: '24 weekly sessions', persons: '1-5 persons', price: '£10,300', savings: 'Save £1,700', product: 'coaching_smallgroup_6month' },
];

const LARGE_GROUP_PRICING = [
  { tier: 'Monthly', sessions: '4 weekly sessions', persons: '5-10 persons', price: '£4,000', product: 'coaching_largegroup_monthly' },
  { tier: 'Quarterly', sessions: '12 weekly sessions', persons: '5-10 persons', price: '£11,000', savings: 'Save £2,000', product: 'coaching_largegroup_quarterly', recommended: true },
  { tier: '6-Months', sessions: '24 weekly sessions', persons: '5-10 persons', price: '£21,000', savings: 'Save £3,000', product: 'coaching_largegroup_6month' },
  { tier: 'Yearly', sessions: '48 weekly sessions', persons: '5-10 persons', price: '£40,000', savings: 'Save £8,000', product: 'coaching_largegroup_yearly' },
];

// --- SUB-COMPONENTS ---

/**
 * Component for toggling between Individual and Group pricing tabs.
 */
const GroupToggle = ({ active, setActive }) => (
  <div className="flex bg-gray-700/50 p-1 rounded-full w-full max-w-sm mx-auto shadow-2xl backdrop-blur-sm relative border border-gray-600/50">
    <button
      onClick={() => setActive('individual')}
      className={`flex-1 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 relative z-10 ${
        active === 'individual' ? 'text-white' : 'text-gray-300'
      }`}
    >
      <User size={16} className="inline mr-1 md:mr-2" /> Individual
    </button>
    <button
      onClick={() => setActive('group')}
      className={`flex-1 py-2 md:py-3 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 relative z-10 ${
        active === 'group' ? 'text-white' : 'text-gray-300'
      }`}
    >
      <Users size={16} className="inline mr-1 md:mr-2" /> Group
    </button>
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full shadow-lg"
      style={{
        left: active === 'individual' ? '4px' : 'calc(50% + 4px)',
        background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
      }}
    />
  </div>
);

/**
 * Component for displaying a single pricing plan card.
 */
const PricingCard = ({ tier, sessions, price, persons, savings, product, handleCheckout, loadingPlan, recommended = false, isAuthReady }) => {
  const isLoading = loadingPlan === product;
  // Disable checkout button if Firebase auth isn't ready yet
  const isDisabled = !isAuthReady || isLoading;

  const features = [
    'Weekly goal-oriented sessions',
    'Focus on building resilience and coping skills',
    'Personalised approach for life stressors',
    'Access to premium resources (coaching)',
  ];

  const cardClasses = recommended
    ? 'border-green-600/70 shadow-green-900/40 transform scale-[1.03] md:scale-105'
    : 'border-blue-700/50 hover:shadow-blue-900/50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col p-6 bg-gray-900/70 border-2 rounded-2xl shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${cardClasses}`}
    >
      {recommended && (
        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-green-600 px-4 py-1 rounded-full text-sm font-bold text-white shadow-xl flex items-center">
            <Star size={16} className="mr-2 fill-yellow-300 text-yellow-300" /> Best Value
        </div>
      )}

      <div className="text-center pt-2">
        <h3 className="text-xl md:text-2xl font-bold text-blue-400">{tier}</h3>
        {persons && <p className="text-sm text-gray-400 mb-1">{persons}</p>}
        <p className="text-4xl md:text-5xl font-extrabold text-white my-3 md:my-4">{price}</p>
        {savings && (
          <p className="text-xs md:text-sm font-medium text-green-400 bg-green-900/50 py-1 px-3 rounded-full inline-block mb-4 border border-green-500/50">
            {savings}
          </p>
        )}
      </div>

      <div className="mt-auto">
        <div className="w-full text-blue-300 py-2 flex justify-center items-center text-sm font-semibold transition-colors">
          {'What is included?'}
          <ChevronDown size={18} className={`ml-2 transition-transform duration-300`} />
        </div>

        <div className="mt-2 overflow-hidden">
          <ul className="space-y-2 text-left mb-6 text-gray-300">
            <li className="flex items-start">
              <CheckCircle size={18} className="text-green-400 mr-2 mt-1 shrink-0" />
              <span className="font-semibold text-white mr-1 text-sm">{sessions}</span>
            </li>
            {features.map((f, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle size={18} className="text-blue-400 mr-2 mt-1 shrink-0" />
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.button
          onClick={() => handleCheckout(product)}
          disabled={isDisabled}
          whileHover={{ scale: isDisabled ? 1 : 1.05 }}
          whileTap={{ scale: isDisabled ? 1 : 0.98 }}
          className="w-full mt-4 py-3 md:py-4 font-extrabold rounded-xl text-white bg-blue-600 shadow-xl shadow-blue-900/50 hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:shadow-none flex justify-center items-center"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" /> Redirecting...
            </>
          ) : !isAuthReady ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" /> Loading Auth...
            </>
          ) : (
            'Checkout'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---

export default function CoachingPricingPage() {
  // Removed useRouter since next/navigation cannot be resolved
  const [activeTab, setActiveTab] = useState('individual');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Initialize Firebase and set up auth listener
  useEffect(() => {
    if (!initialized) {
        initializeFirebase(setUserId, setIsAuthReady);
    }
  }, []);

  const isIndividualTab = activeTab === 'individual';
  const pricingData = isIndividualTab ? INDIVIDUAL_PRICING : SMALL_GROUP_PRICING;
  const showLargeGroup = activeTab === 'group';

  const handleCheckout = useCallback(async (productKey) => {
    if (!isAuthReady || !auth) {
        setError("Authentication not ready. Please wait a moment.");
        return;
    }

    setLoadingPlan(productKey);
    setError("");

    try {
      const user = auth.currentUser;
      // Note: Since router is removed, successRedirect is just a message/placeholder
      // In a real Next.js environment, this would be handled server-side.
      // Here, we use a static redirect (window.location.href) which will leave the Canvas environment.
      const successRedirect = user ? "/dashboard/coachee" : "/signup-coachee";

      let idToken = null;
      // Only attempt to get ID token if user object exists and is not anonymous (or is needed for API call)
      if (user) {
        idToken = await user.getIdToken();
      }

      // Simulation of API call to create checkout session
      // Since we cannot run an actual server API, this is simulated.
      // In a live environment, this POST would go to a backend service like /api/create-checkout-session
      console.log("Simulating checkout session creation for product:", productKey);

      // SIMULATING A SUCCESSFUL STRIPE CHECKOUT REDIRECT
      const simulatedUrl = `https://checkout.stripe.com/pay/${productKey}?code=${couponCode.trim().toUpperCase()}`;

      // Simulating a network delay for the API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Use window.location.href for external redirect (Stripe checkout)
      window.location.href = simulatedUrl;

    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "An unknown error occurred during checkout.");
      setLoadingPlan(null);
    }
  }, [isAuthReady, couponCode]);

  return (
    <div className="min-h-screen pb-20 font-sans bg-gradient-to-b from-[#06113b] to-black text-white">
      {/* Header component (Removed actual Header import to fix path error) */}
      <div className="bg-gray-900 shadow-lg p-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-blue-400">Coaching Platform</h1>
            <p className='text-sm text-gray-400'>User ID: {userId || 'Loading...'}</p>
        </div>
      </div>

      {/* Spacer for fixed header on desktop */}
      <div className="hidden md:block h-6" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center pt-12 md:pt-20 mb-10 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent leading-tight">
            Psychiatrist-Led<br className="md:hidden"/> Coaching
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Find clarity, build resilience, and establish a clear path to recovery with expert guidance.
          </p>

          <div className="max-w-4xl mx-auto">
            {COACHING_CONTENT.body}
          </div>
          {error && <p className="text-red-400 mt-6 font-semibold bg-red-900/20 p-3 rounded-lg border border-red-700/50 max-w-md mx-auto">{error}</p>}
        </header>

        {/* Group/Individual Toggle */}
        <GroupToggle active={activeTab} setActive={setActiveTab} />

        {/* Coupon Input */}
        <div className="max-w-md mx-auto mt-8">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full p-4 border-2 border-gray-600 rounded-xl text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Pricing Grid */}
        <motion.div
          key={activeTab} // Key forces re-render/animation on tab switch
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12"
        >
          {pricingData.map((plan) => (
            <PricingCard
              key={plan.product}
              {...plan}
              handleCheckout={handleCheckout}
              loadingPlan={loadingPlan}
              isAuthReady={isAuthReady}
            />
          ))}
        </motion.div>

        {/* Large Group Pricing Section (Conditionally rendered) */}
        {showLargeGroup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-300">Large Groups (5-10 persons)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {LARGE_GROUP_PRICING.map((plan) => (
                <PricingCard
                  key={plan.product}
                  {...plan}
                  handleCheckout={handleCheckout}
                  loadingPlan={loadingPlan}
                  isAuthReady={isAuthReady}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer component (Removed actual Footer import to fix path error) */}
      <div className='mt-20 border-t border-gray-700 p-8 text-center text-gray-500'>
        <p>© 2024 Coaching Platform. All rights reserved.</p>
      </div>
    </div>
  );
}
