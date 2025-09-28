'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from "../../components/home/Footer";
import { CheckCircle, Users, User, ChevronDown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ===============================================
// I. DATA STRUCTURE – Matches backend PRODUCT_LOOKUPS
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
// II. TOGGLE & PRICING CARD COMPONENTS
// ===============================================

const GroupToggle = ({ active, setActive }) => (
  <div className="flex bg-gray-700/50 p-1 rounded-full w-full max-w-sm mx-auto shadow-xl backdrop-blur-sm relative">
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

const PricingCard = ({ tier, sessions, price, persons, savings, product, handleCheckout, loadingPlan }) => {
  const [isOpen, setIsOpen] = useState(false);
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
      className="relative flex flex-col p-6 bg-gray-900/70 border border-blue-700/50 rounded-2xl shadow-2xl backdrop-blur-md hover:shadow-blue-900/50 transition-all duration-300 transform hover:scale-[1.02]"
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

      {/* Expandable features */}
      <div className="mt-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-blue-300 hover:text-blue-200 py-2 flex justify-center items-center text-sm font-semibold transition-colors"
        >
          {isOpen ? 'Hide Details' : 'What is included?'}
          <ChevronDown
            size={18}
            className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden"
            >
              <ul className="space-y-2 text-left mb-6 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle size={18} className="text-green-400 mr-2 mt-1" />
                  <span className="font-semibold text-white mr-1">{sessions}</span>
                </li>
                {features.map((f, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle size={18} className="text-blue-400 mr-2 mt-1" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => handleCheckout(product)}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 font-extrabold rounded-xl text-white bg-blue-600 shadow-lg disabled:bg-blue-400"
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
// III. MAIN COMPONENT
// ===============================================

export default function CoachingPricingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('individual');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const pricingData = activeTab === 'individual' ? INDIVIDUAL_PRICING : SMALL_GROUP_PRICING;
  const showLargeGroup = activeTab === 'group';

  const handleCheckout = async (productKey) => {
    setLoadingPlan(productKey);
    setError("");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productKey, // ✅ Must match backend PRODUCT_LOOKUPS
          couponCode: couponCode.trim().toUpperCase(),
          successRedirect: "/dashboard/coaching",
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create checkout session.");
      }

      const { url } = await response.json();
      window.location.href = url; // redirect
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 text-white font-sans bg-gradient-to-b from-[#06113b] to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent">
            Psychiatrist-Led Coaching
          </h1>
          <p className="text-lg text-gray-400 max-w-4xl mx-auto">{COACHING_CONTENT.body}</p>
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </header>

        <GroupToggle active={activeTab} setActive={setActiveTab} />

        {/* Coupon input */}
        <div className="max-w-md mx-auto mt-8">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="w-full p-4 border-2 border-gray-600 rounded-xl text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Pricing cards */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {pricingData.map((plan) => (
            <PricingCard key={plan.product} {...plan} handleCheckout={handleCheckout} loadingPlan={loadingPlan} />
          ))}
        </motion.div>

        {/* Large group */}
        {showLargeGroup && (
          <div className="lg:col-span-4 mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">Large Groups (5-10 persons)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {LARGE_GROUP_PRICING.map((plan) => (
                <PricingCard key={plan.product} {...plan} handleCheckout={handleCheckout} loadingPlan={loadingPlan} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
