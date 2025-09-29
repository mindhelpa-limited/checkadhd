'use client';

// ===============================================
// I. IMPORTS
// ===============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle, Users, User, ChevronDown, Loader2, Zap } from 'lucide-react';

// LOCAL IMPORTS
import Footer from "../../components/home/Footer";
import { auth } from "@/lib/firebase";

// ===============================================
// II. DATA STRUCTURE – Uses EXACT user content
// ===============================================

const COACHING_CONTENT = {
  title: 'Psychiatrist-Led Coaching',
  body: "Get personalised one-on-one coaching from Psychiatrists with extensive experience in managing persons with life stressors and mental disorders such as Anxiety, Depression, Personality Disorders, Phobias and Substance Misuse. Focus of coaching is on building resilience, coping skills and acquiring tools that can reinvigorate purpose and help you back on the path of recovery. Weekly sessions are goal-oriented and will help you accomplish tasks, minimising risks of relapse or burnout.",
};

// INDIVIDUAL PLANS
const INDIVIDUAL_PRICING = [
  { tier: 'Monthly', sessions: '4 sessions', duration: '1 month', price: '£1,000', product: 'coaching_individual_monthly' },
  { tier: 'Quarterly', sessions: '12 sessions', duration: '3 months', price: '£2,900', savings: 'Save £100', product: 'coaching_individual_quarterly' },
  { tier: '6-Months', sessions: '24 sessions', duration: '6 months', price: '£5,650', savings: 'Save £350', product: 'coaching_individual_6month' },
  { tier: 'Yearly', sessions: '48 sessions', duration: '1 year', price: '£10,000', savings: 'Save £2,000', product: 'coaching_individual_yearly' },
];

// SMALL GROUP (1–5 people)
const SMALL_GROUP_PRICING = [
  { tier: 'Monthly', sessions: '4 weekly sessions', persons: '1-5 persons', price: '£2,000', product: 'coaching_smallgroup_monthly' },
  { tier: 'Quarterly', sessions: '12 weekly sessions', persons: '1-5 persons', price: '£5,800', savings: 'Save £200', product: 'coaching_smallgroup_quarterly' },
  { tier: '6-Months', sessions: '24 weekly sessions', persons: '1-5 persons', price: '£10,300', savings: 'Save £1,700', product: 'coaching_smallgroup_6month' },
  { tier: 'Yearly', sessions: '48 weekly sessions', persons: '1-5 persons', price: '£20,000', savings: 'Save £4,000', product: 'coaching_smallgroup_yearly' },
];

// LARGE GROUP (5–10 people)
const LARGE_GROUP_PRICING = [
  { tier: 'Monthly', sessions: '4 weekly sessions', persons: '5-10 persons', price: '£4,000', product: 'coaching_largegroup_monthly' },
  { tier: 'Quarterly', sessions: '12 weekly sessions', persons: '5-10 persons', price: '£11,000', savings: 'Save £2,000', product: 'coaching_largegroup_quarterly' },
  { tier: '6-Months', sessions: '24 weekly sessions', persons: '5-10 persons', price: '£21,000', savings: 'Save £3,000', product: 'coaching_largegroup_6month' },
  { tier: 'Yearly', sessions: '48 weekly sessions', persons: '5-10 persons', price: '£40,000', savings: 'Save £8,000', product: 'coaching_largegroup_yearly' },
];

// ===============================================
// III. HELPER COMPONENTS (Background/UI elements)
// ===============================================

/**
 * Renders the toggle button for switching between Individual and Group Coaching.
 */
const GroupToggle = ({ active, setActive }) => (
  <div className="flex bg-gray-700/50 p-1 rounded-full w-full max-w-sm mx-auto shadow-2xl backdrop-blur-sm relative border border-blue-700/50">
    <button
      onClick={() => setActive('individual')}
      className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 ${
        active === 'individual' ? 'text-white' : 'text-gray-300'
      }`}
    >
      <User size={18} className="inline mr-2" /> Individual Coaching
    </button>
    <button
      onClick={() => setActive('group')}
      className={`flex-1 py-3 rounded-full text-sm font-semibold transition-all duration-300 relative z-10 ${
        active === 'group' ? 'text-white' : 'text-gray-300'
      }`}
    >
      <Users size={18} className="inline mr-2" /> Group Coaching
    </button>
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-blue-600 rounded-full shadow-lg"
      style={{
        left: active === 'individual' ? '4px' : 'calc(50% + 4px)',
        background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
      }}
    />
  </div>
);

/**
 * Renders a single pricing card with tier details and a permanently visible feature list.
 */
const PricingCard = ({ tier, sessions, price, persons, savings, product, handleCheckout, loadingPlan }) => {
  // Removed all state/toggle logic for features
  const isLoading = loadingPlan === product;

  const features = [
    'Weekly goal-oriented sessions',
    'Focus on building resilience and coping skills',
    'Personalised approach for life stressors',
    'Access to premium resources (coaching)',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col p-6 bg-[#101b3d]/80 border border-blue-400/20 rounded-2xl shadow-2xl backdrop-blur-md hover:shadow-blue-900/50 transition-all duration-300 transform hover:scale-[1.02]"
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold text-blue-400">{tier}</h3>
        {persons && <p className="text-sm text-gray-400 mb-1">{persons}</p>}
        <p className="text-4xl font-extrabold text-white my-3">{price}</p>
        {savings && (
          <p className="text-sm font-medium text-green-400 bg-green-900/30 py-1 px-3 rounded-full inline-block mb-3">
            {savings}
          </p>
        )}
      </div>

      {/* Feature List (Always visible, non-collapsible) */}
      <div className="mt-auto">

        <div
          className="w-full text-blue-300 py-2 flex justify-center items-center text-sm font-semibold transition-colors border-t border-gray-700/50 mt-4"
        >
          {'What is included?'}
          <ChevronDown
            size={18}
            className={`ml-2 transition-transform duration-300`}
          />
        </div>

        <div className="mt-4 overflow-hidden">
          <ul className="space-y-2 text-left mb-6 text-gray-300">
            <li className="flex items-start">
              <CheckCircle size={18} className="text-green-400 mr-2 mt-1 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white mr-1">{sessions}</span>
                <span className="text-sm text-gray-400">{persons ? ` for ${persons}` : ''}</span>
              </div>
            </li>
            {features.map((f, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle size={18} className="text-blue-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.button
          onClick={() => handleCheckout(product)}
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 font-extrabold rounded-xl text-white bg-blue-600 shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:bg-blue-400 flex justify-center items-center"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin mr-2" /> Redirecting...
            </>
          ) : (
            'Checkout'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ===============================================
// IV. HERO BACKGROUND COMPONENT (Evolving Sphere)
// ===============================================

const EvolvingSphere = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
    {/* Background radial gradient for depth */}
    <div className="absolute inset-0 bg-radial-gradient-hero opacity-50"></div>

    {/* The Evolving Sphere Container - Centered and large */}
    <div className="relative w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] flex items-center justify-center sphere-blur">
      {/* Outer Pulsing Ring - Slow, broad movement */}
      <div className="absolute w-full h-full border-4 border-blue-500/10 rounded-full animate-pulse-slow"></div>

      {/* Middle Fading Ring - Symbolizing clarity/thought waves */}
      <div className="absolute w-[80%] h-[80%] border-2 border-cyan-400/20 rounded-full animate-ping-medium"></div>

      {/* Central, subtle rotation */}
      <div className="absolute w-[60%] h-[60%] border border-blue-600/30 rounded-full animate-spin-slow-medium"></div>
    </div>
  </div>
);

// ===============================================
// V. MAIN COMPONENT
// ===============================================

export default function CoachingPricingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('individual');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const isIndividualTab = activeTab === 'individual';
  const pricingData = isIndividualTab ? INDIVIDUAL_PRICING : SMALL_GROUP_PRICING;
  const showLargeGroup = activeTab === 'group';

  /**
   * Handles the checkout process by calling the API to create a checkout session.
   * @param {string} productKey - The key of the selected product plan.
   */
  const handleCheckout = async (productKey) => {
    setLoadingPlan(productKey);
    setError("");

    try {
      // Check if user is logged in
      const user = auth.currentUser;
      // Determine the redirect URL based on user login status
      const successRedirect = user ? "/dashboard/coachee" : "/signup-coachee";

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productKey,
          couponCode: couponCode.trim().toUpperCase(),
          successRedirect,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create checkout session.");
      }

      const { url } = await response.json();
      // Redirect to the external checkout URL
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoadingPlan(null); // Stop loading animation on error
    }
  };

  return (
    <div className="min-h-screen text-white font-sans bg-[#0a122a] overflow-hidden">

      {/* UPDATED HERO SECTION */}
      <div className="relative py-24 sm:py-32 overflow-hidden border-b border-blue-900/50">
        <EvolvingSphere /> {/* Using the new component */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center animate-hero-title-fade">

          {/* EXACTLY your content used here: Title */}
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
            {COACHING_CONTENT.title}
          </h1>

          {/* EXACTLY your content used here: Body */}
          <p className="mt-6 text-xl leading-8 text-gray-300 max-w-3xl mx-auto">
            {COACHING_CONTENT.body}
          </p>
        </div>
      </div>

      <div className="pt-16 pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Group/Individual Toggle */}
          <div className="mb-12">
            <GroupToggle active={activeTab} setActive={setActiveTab} />
          </div>

          {/* Coupon input */}
          <div className="max-w-lg mx-auto mb-16">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full p-4 border border-blue-700 rounded-xl text-white bg-[#0a122a] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-lg"
            />
            {error && <p className="text-red-400 text-center mt-4 font-medium">{error}</p>}
          </div>

          {/* Pricing cards */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingData.map((plan) => (
              <PricingCard
                key={plan.product}
                {...plan}
                handleCheckout={handleCheckout}
                loadingPlan={loadingPlan}
              />
            ))}
          </motion.div>

          {/* Large group section (Conditionally rendered) */}
          {showLargeGroup && (
            <div className="lg:col-span-4 mt-20 pt-8 border-t border-blue-900/50">
              <h2 className="text-3xl font-bold text-center mb-8 text-blue-300">Large Groups (5-10 persons)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {LARGE_GROUP_PRICING.map((plan) => (
                  <PricingCard
                    key={plan.product}
                    {...plan}
                    handleCheckout={handleCheckout}
                    loadingPlan={loadingPlan}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Custom styles for animations, updated to include Evolving Sphere logic */}
      <style jsx global>{`
        @keyframes hero-title-fade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-hero-title-fade {
          animation: hero-title-fade 1.5s ease-out forwards;
        }
        @keyframes spin-slow-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow-medium {
          animation: spin-slow-medium 70s linear infinite; /* Slower spin */
          transform-origin: center;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
        .animate-ping-medium {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
          opacity: 0;
        }
        .bg-radial-gradient-hero {
          background: radial-gradient(circle at 50% 0%, #06113b 0%, #0a122a 50%);
        }
        .sphere-blur {
            filter: blur(1px); /* Adds a subtle, ethereal feel to the concentric circles */
        }
      `}</style>
    </div>
  );
}