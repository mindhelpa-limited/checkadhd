'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Users,
  User,
  ChevronDown,
  Loader2,
  Star,
  ShieldCheck,
  Zap,
  Target,
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/home/Footer';
import { auth } from '@/lib/firebase';

// ===============================================
// II. DATA STRUCTURE – Matches backend PRODUCT_LOOKUPS
// ===============================================
const COACHING_CONTENT = {
  title: 'Psychiatrist-Led Coaching',
  body: (
    <div className="bg-gray-800/60 p-5 sm:p-8 rounded-xl border border-blue-700/50 shadow-inner shadow-black/50">
      <ul className="space-y-6 text-left">
        <li className="flex items-start border-l-4 border-blue-500 pl-4">
          <ShieldCheck size={24} className="text-green-400 mr-3 mt-1 shrink-0" />
          <div>
            <strong className="text-lg text-blue-200 font-extrabold block mb-1">
              Confidential & Customised Care
            </strong>
            <p className="text-gray-300 text-base mt-1">
              Coaching from Psychiatrists with experience in managing complex
              mental health issues, including:
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
            <strong className="text-lg text-blue-200 font-extrabold block mb-1">
              Build Resilience and Renew Purpose
            </strong>
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
            <strong className="text-lg text-blue-200 font-extrabold block mb-1">
              Structured, High-Impact Weekly Goals
            </strong>
            <p className="text-gray-300 text-base mt-1">
              Sessions are goal-oriented to maximize your progress and
              stability:
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

// INDIVIDUAL PLANS
const INDIVIDUAL_PRICING = [
  {
    tier: 'Monthly',
    sessions: '4 sessions',
    duration: '1 month',
    price: '£1,000',
    product: 'coaching_individual_monthly',
  },
  {
    tier: 'Quarterly',
    sessions: '12 sessions',
    duration: '3 months',
    price: '£2,900',
    savings: 'Save £100',
    product: 'coaching_individual_quarterly',
    recommended: true,
  },
  {
    tier: '6-Months',
    sessions: '24 sessions',
    duration: '6 months',
    price: '£5,650',
    savings: 'Save £350',
    product: 'coaching_individual_6month',
  },
  {
    tier: 'Yearly',
    sessions: '48 sessions',
    duration: '1 year',
    price: '£10,000',
    savings: 'Save £2,000',
    product: 'coaching_individual_yearly',
  },
];

// SMALL GROUP (1–5 people)
const SMALL_GROUP_PRICING = [
  {
    tier: 'Monthly',
    sessions: '4 weekly sessions',
    persons: '1-5 persons',
    price: '£2,000',
    product: 'coaching_smallgroup_monthly',
  },
  {
    tier: 'Quarterly',
    sessions: '12 weekly sessions',
    persons: '1-5 persons',
    price: '£5,800',
    savings: 'Save £200',
    product: 'coaching_smallgroup_quarterly',
    recommended: true,
  },
  {
    tier: '6-Months',
    sessions: '24 weekly sessions',
    persons: '1-5 persons',
    price: '£10,300',
    savings: 'Save £1,700',
    product: 'coaching_smallgroup_6month',
  },
];

// LARGE GROUP (5–10 people)
const LARGE_GROUP_PRICING = [
  {
    tier: 'Monthly',
    sessions: '4 weekly sessions',
    persons: '5-10 persons',
    price: '£4,000',
    product: 'coaching_largegroup_monthly',
  },
  {
    tier: 'Quarterly',
    sessions: '12 weekly sessions',
    persons: '5-10 persons',
    price: '£11,000',
    savings: 'Save £2,000',
    product: 'coaching_largegroup_quarterly',
    recommended: true,
  },
  {
    tier: '6-Months',
    sessions: '24 weekly sessions',
    persons: '5-10 persons',
    price: '£21,000',
    savings: 'Save £3,000',
    product: 'coaching_largegroup_6month',
  },
  {
    tier: 'Yearly',
    sessions: '48 weekly sessions',
    persons: '5-10 persons',
    price: '£40,000',
    savings: 'Save £8,000',
    product: 'coaching_largegroup_yearly',
  },
];

// ===============================================
// III. TOGGLE & PRICING CARD COMPONENTS
// ===============================================
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

const PricingCard = ({
  tier,
  sessions,
  price,
  persons,
  savings,
  product,
  handleCheckout,
  loadingPlan,
  recommended = false,
}) => {
  const isLoading = loadingPlan === product;
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
          <Star size={16} className="mr-2 fill-yellow-300 text-yellow-300" /> Best
          Value
        </div>
      )}

      <div className="text-center pt-2">
        <h3 className="text-xl md:text-2xl font-bold text-blue-400">{tier}</h3>
        {persons && <p className="text-sm text-gray-400 mb-1">{persons}</p>}
        <p className="text-4xl md:text-5xl font-extrabold text-white my-3 md:my-4">
          {price}
        </p>
        {savings && (
          <p className="text-xs md:text-sm font-medium text-green-400 bg-green-900/50 py-1 px-3 rounded-full inline-block mb-4 border border-green-500/50">
            {savings}
          </p>
        )}
      </div>

      <div className="mt-auto">
        <div className="w-full text-blue-300 py-2 flex justify-center items-center text-sm font-semibold transition-colors">
          {'What is included?'}
          <ChevronDown size={18} className="ml-2 transition-transform duration-300" />
        </div>

        <div className="mt-2 overflow-hidden">
          <ul className="space-y-2 text-left mb-6 text-gray-300">
            <li className="flex items-start">
              <CheckCircle
                size={18}
                className="text-green-400 mr-2 mt-1 shrink-0"
              />
              <span className="font-semibold text-white mr-1 text-sm">
                {sessions}
              </span>
            </li>
            {features.map((f, i) => (
              <li key={i} className="flex items-start">
                <CheckCircle
                  size={18}
                  className="text-blue-400 mr-2 mt-1 shrink-0"
                />
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.button
          onClick={() => handleCheckout(product)}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-3 md:py-4 font-extrabold rounded-xl text-white bg-blue-600 shadow-xl shadow-blue-900/50 hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex justify-center items-center"
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
// IV. FREE SESSION BANNER
// ===============================================
const FreeSessionBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="bg-green-600/20 border border-green-500/50 p-4 md:p-6 rounded-xl text-center max-w-2xl mx-auto shadow-2xl backdrop-blur-sm mt-8 mb-10"
  >
    <div className="flex items-center justify-center space-x-3">
      <CheckCircle size={24} className="text-green-400 shrink-0" />
      <p className="text-base md:text-lg font-bold text-green-200">
        Start for Free!
      </p>
    </div>
    <p className="text-sm md:text-base text-gray-300 mt-2">
      <strong className="text-white">Your first session is complimentary.</strong>{' '}
      Billing for the full plan begins{' '}
      <strong className="text-white">only after your initial session is complete.</strong>
    </p>
    <p className="text-xs text-green-300 mt-1">
      Enroll today to secure your plan—you won't be charged until the first
      session is delivered.
    </p>
  </motion.div>
);

// ===============================================
// V. MAIN COMPONENT
// ===============================================
export default function CoachingPricingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('individual');
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState('');
  const [couponCode, setCouponCode] = useState(''); // ✅ new manual coupon state

  const isIndividualTab = activeTab === 'individual';
  const pricingData = isIndividualTab ? INDIVIDUAL_PRICING : SMALL_GROUP_PRICING;
  const showLargeGroup = activeTab === 'group';

  const handleCheckout = async (productKey) => {
    setLoadingPlan(productKey);
    setError('');

    try {
      const user = auth.currentUser;
      const successRedirect = user ? '/dashboard/coachee' : '/signup-coachee';

      let idToken = null;
      if (user) {
        idToken = await user.getIdToken();
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          product: productKey,
          couponCode: couponCode.trim(), // ✅ use user-entered coupon
          successRedirect,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create checkout session.');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen pb-20 text-white font-sans bg-gradient-to-b from-[#06113b] to-black">
      <Header />
      <div className="hidden md:block h-[90px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center pt-24 md:pt-20 mb-10 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent leading-tight">
            Psychiatrist-Led<br className="md:hidden" /> Coaching
          </h1>
          <div className="max-w-4xl mx-auto">{COACHING_CONTENT.body}</div>
          {error && <p className="text-red-400 mt-4 font-medium">{error}</p>}
          <FreeSessionBanner />
        </header>

        <GroupToggle active={activeTab} setActive={setActiveTab} />

        {/* === Coupon Code Input === */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <input
            type="text"
            placeholder="Enter coupon code (optional)"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-gray-400 text-sm mt-2 text-center">
          Leave blank if you don’t have a coupon.
        </p>

        {/* === Pricing Grid === */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-12">
          {pricingData.map((plan) => (
            <PricingCard
              key={plan.product}
              {...plan}
              handleCheckout={handleCheckout}
              loadingPlan={loadingPlan}
            />
          ))}
        </motion.div>

        {showLargeGroup && (
          <div className="lg:col-span-4 mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-blue-300">
              Large Groups (5-10 persons)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
      <Footer />
    </div>
  );
}
