'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Users, User, ChevronDown, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
// NOTE: You must import your authentication context here to check auth.currentUser
// For example:
// import { useAuth } from '@/context/AuthContext'; 

// ===============================================
// I. DATA STRUCTURE (UPDATED WITH stripePriceId)
// *** IMPORTANT: REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL Stripe Price IDs ***
// NOTE: The current placeholder IDs are assumed to be correct based on the prompt.
// ===============================================

const COACHING_CONTENT = {
    title: 'Psychiatrist-Led Coaching',
    body: "Get personalised one-on-one coaching from Psychiatrists with extensive experience in managing persons with life stressors and mental disorders such as Anxiety, Depression, Personality Disorders, Phobias and Substance Misuse. Focus of coaching is on building resilience, coping skills and acquiring tools that can reinvigorate purpose and help you back on the path of recovery. Weekly sessions are goal-oriented and will help you accomplish tasks, minimising risks of relapse or burnout.",
};

// NOTE: Ensure your actual Stripe Price IDs correspond to the amount and currency shown.
// Price IDs MUST be for products set up for a one-time charge if using mode: "payment"
const INDIVIDUAL_PRICING = [
    { tier: 'Monthly', sessions: '4 sessions', duration: '1 month', price: '£1,000', planId: 'individual-monthly', stripePriceId: 'price_ind_month_1000' },
    { tier: 'Quarterly', sessions: '12 sessions', duration: '3 months', price: '£2,900', savings: 'Save £100', planId: 'individual-quarterly', stripePriceId: 'price_ind_qtr_2900' },
    { tier: '6-Months', sessions: '24 sessions', duration: '6 months', price: '£5,650', savings: 'Save £350', planId: 'individual-6month', stripePriceId: 'price_ind_6m_5650' },
    { tier: 'Yearly', sessions: '48 sessions', duration: '1 year', price: '£10,000', savings: 'Save £2,000', planId: 'individual-yearly', stripePriceId: 'price_ind_year_10000' },
];

const SMALL_GROUP_PRICING = [
    { tier: 'Monthly', sessions: '4 weekly sessions', persons: '1-5 persons', price: '£2,000', planId: 'smallgroup-monthly', stripePriceId: 'price_sg_month_2000' },
    { tier: 'Quarterly', sessions: '12 weekly sessions', persons: '1-5 persons', price: '£5,800', savings: 'Save £200', planId: 'smallgroup-quarterly', stripePriceId: 'price_sg_qtr_5800' },
    { tier: '6-Months', sessions: '24 weekly sessions', persons: '1-5 persons', price: '£10,300', savings: 'Save £1,700', planId: 'smallgroup-6month', stripePriceId: 'price_sg_6m_10300' },
    { tier: 'Yearly', sessions: '48 weekly sessions', persons: '1-5 persons', price: '£20,000', savings: 'Save £4,000', planId: 'smallgroup-yearly', stripePriceId: 'price_sg_year_20000' },
];

const LARGE_GROUP_PRICING = [
    { tier: 'Monthly', sessions: '4 weekly sessions', persons: '5-10 persons', price: '£4,000', planId: 'largegroup-monthly', stripePriceId: 'price_lg_month_4000' },
    { tier: 'Quarterly', sessions: '12 weekly sessions', persons: '5-10 persons', price: '£11,000', savings: 'Save £2,000', planId: 'largegroup-quarterly', stripePriceId: 'price_lg_qtr_11000' },
    { tier: '6-Months', sessions: '24 weekly sessions', persons: '5-10 persons', price: '£21,000', savings: 'Save £3,000', planId: 'largegroup-6month', stripePriceId: 'price_lg_6m_21000' },
    { tier: 'Yearly', sessions: '48 weekly sessions', persons: '5-10 persons', price: '£40,000', savings: 'Save £8,000', planId: 'largegroup-yearly', stripePriceId: 'price_lg_year_40000' },
];

// Combine all plans into one searchable array for easy lookup
const ALL_PRICING_PLANS = [
    ...INDIVIDUAL_PRICING,
    ...SMALL_GROUP_PRICING,
    ...LARGE_GROUP_PRICING,
];


// ===============================================
// II. SHARED COMPONENTS (No changes needed)
// ===============================================

/**
 * Modern Toggle Switch for Individual/Group
 */
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

/**
 * Single Pricing Card Component
 */
const PricingCard = ({ tier, sessions, price, persons, planId, savings, handleCheckout, loadingPlan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isLoading = loadingPlan === planId;

  // Simplified bullet points based on the main content
  const features = [
    'Weekly goal-oriented sessions',
    'Focus on building resilience and coping skills',
    'Personalised approach for life stressors',
    `Access to premium resources (coaching)`,
  ];

  const onCardCheckout = (e) => {
    e.preventDefault();
    handleCheckout(planId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col p-6 bg-gray-900/70 border border-blue-700/50 rounded-2xl shadow-2xl backdrop-blur-md hover:shadow-blue-900/50 transition-all duration-300 transform hover:scale-[1.02]"
      style={{ boxShadow: '0 0 40px rgba(0, 50, 255, 0.15)' }}
    >
      <div className="text-center">
        <h3 className="text-2xl font-bold text-blue-400">{tier}</h3>
        {persons && <p className="text-sm text-gray-400 mb-1">{persons}</p>}
        <p className="text-4xl font-extrabold text-white my-3 tracking-tight">{price}</p>
        {savings && (
          <p className="text-sm font-medium text-green-400 bg-green-900/30 py-1 px-3 rounded-full inline-block mb-3">
            {savings}
          </p>
        )}
      </div>

      <div className="mt-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-blue-300 hover:text-blue-200 py-2 flex justify-center items-center text-sm font-semibold transition-colors"
        >
          {isOpen ? 'Hide Details' : 'What is included?'}
          <ChevronDown
            size={18}
            className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
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
                  <CheckCircle size={18} className="text-green-400 mr-2 mt-1 flex-shrink-0" />
                  <span className="font-semibold text-white mr-1">{sessions}</span>
                  <span>{tier.includes('ly') ? 'over the period.' : 'over the span.'}</span>
                </li>
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle size={18} className="text-blue-400 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={onCardCheckout}
          disabled={isLoading}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 font-extrabold rounded-xl text-white bg-blue-600 transition-all duration-300 shadow-lg flex items-center justify-center disabled:bg-blue-400"
          style={{ background: 'linear-gradient(90deg, #3B82F6, #1D4ED8)' }}
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
// III. MAIN COMPONENT (One-Time Fee Logic)
// ===============================================

export default function PricingPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('individual');
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [error, setError] = useState("");

    // PLACEHOLDER: Replace this with your actual authentication hook/context
    // This object needs a 'currentUser' property which is truthy if logged in.
    const auth = { currentUser: true }; // <<< TEMPORARY: Assume logged in for testing. Replace with useAuth() or similar.

    const pricingData = activeTab === 'individual' ? INDIVIDUAL_PRICING : (activeTab === 'group' ? SMALL_GROUP_PRICING : []);
    const groupData = activeTab === 'group';

    /**
     * Finds the plan details and handles the Stripe Checkout process.
     * Passes the CORRECT Stripe Price ID, product: "coaching", and the conditional successRedirect.
     * @param {string} planId - The unique ID of the selected plan.
     */
    const handleCheckout = async (planId) => {
        setLoadingPlan(planId);
        setError("");

        // 1. Find the full plan object to get the secure Stripe Price ID
        const selectedPlan = ALL_PRICING_PLANS.find(plan => plan.planId === planId);
        
        if (!selectedPlan || !selectedPlan.stripePriceId) {
            setError("Error: Selected plan not found or Stripe ID is missing. Check your price mapping.");
            setLoadingPlan(null);
            return;
        }

        // 2. Determine the correct success redirect URL based on user login status
        const successRedirect = auth.currentUser 
            ? "/dashboard/coaching" 
            : "/signup";
            
        try {
            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planId: planId,
                    // 👈 1. REAL Price ID from Stripe
                    stripePriceId: selectedPlan.stripePriceId, 
                    // 👈 2. Tells webhook this is coaching
                    product: "coaching", 
                    // 👈 CRITICAL CHANGE: Set mode to "payment" for a one-time fee
                    mode: "payment",
                    // 👈 3. Conditional redirect based on user login status
                    successRedirect: successRedirect,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create checkout session.");
            }

            const { url } = await response.json();
            // Redirect to Stripe checkout
            window.location.href = url;
        } catch (err) {
            console.error(err);
            setError(err.message || "Could not connect to payment provider.");
            setLoadingPlan(null);
        }
    };

    return (
        <div
            className="min-h-screen pt-20 pb-20 text-white font-sans"
            style={{
                // Beautiful Blue Gradient Background
                background: 'radial-gradient(at 50% 10%, #06113b, #000000 70%)',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="text-center mb-16">
                    <h1 className="text-6xl font-black text-white mb-4 tracking-tight">
                        <span
                            style={{
                                background: 'linear-gradient(45deg, #93c5fd, #3b82f6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Psychiatrist-Led Coaching
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                        {COACHING_CONTENT.title}
                    </p>
                    <p className="text-lg text-gray-400 max-w-4xl mx-auto border-l-4 border-blue-500/70 pl-4 py-2">
                        {COACHING_CONTENT.body}
                    </p>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="text-red-400 bg-red-900/30 p-3 rounded mt-6 mx-auto max-w-md border border-red-700"
                        >
                            Payment Error: {error}
                        </motion.div>
                    )}
                </header>

                <GroupToggle active={activeTab} setActive={setActiveTab} />

                {/* Pricing Cards Grid */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
                >
                    {/* Individual & Small Group Pricing */}
                    {pricingData.map((plan, index) => (
                        <PricingCard 
                            key={plan.planId} 
                            {...plan} 
                            handleCheckout={handleCheckout}
                            loadingPlan={loadingPlan}
                        />
                    ))}

                    {/* Large Group Pricing (Only visible when Group Coaching is toggled) */}
                    {groupData && (
                        <div className="lg:col-span-4 mt-12">
                            <h2 className="text-3xl font-bold text-center mb-8">Large Groups (5-10 persons)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {LARGE_GROUP_PRICING.map((plan, index) => (
                                    <PricingCard 
                                        key={plan.planId} 
                                        {...plan} 
                                        handleCheckout={handleCheckout} 
                                        loadingPlan={loadingPlan}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}