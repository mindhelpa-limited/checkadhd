"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// --- Components and Utilities ---
import Footer from "../../components/home/Footer";
// --- Icons ---
import {
  Check,
  BrainCircuit,
  BookOpen,
  FileText,
  BarChart3,
  Flame,
  Star,
  Infinity,
  Tornado,
} from "lucide-react";

// ====================================================================
// --- Utility Components ---
// ====================================================================

/**
 * A reusable list item for displaying a feature with an icon, title, and description.
 */
const FeatureListItem = ({ icon, title, description }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white">
      {icon}
    </div>
    <div className="ml-4">
      <h4 className="font-sans text-lg font-semibold text-white">{title}</h4>
      <p className="font-sans mt-1 text-gray-300">{description}</p>
    </div>
  </div>
);

/**
 * A decorative animated SVG grid for the background.
 */
const AnimatedGrid = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
    <svg
      viewBox="0 0 200 200"
      className="w-[100vw] max-w-4xl h-auto text-cyan-500/10 animate-spin-slow-medium"
      style={{ transformOrigin: "center" }}
    >
      {/* Horizontal Lines */}
      {[...Array(11)].map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={20 * i}
          x2="200"
          y2={20 * i}
          stroke="currentColor"
          strokeWidth="0.2"
        />
      ))}
      {/* Vertical Lines */}
      {[...Array(11)].map((_, i) => (
        <line
          key={`v-${i}`}
          x1={20 * i}
          y1="0"
          x2={20 * i}
          y2="200"
          stroke="currentColor"
          strokeWidth="0.2"
        />
      ))}
      {/* Central Circle */}
      <circle
        cx="100"
        cy="100"
        r="60"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="stroke-blue-400/20"
      />
    </svg>
  </div>
);

// ====================================================================
// --- Main Component ---
// ====================================================================

/**
 * The main Pricing Page component.
 */
export default function PricingPage() {
  const router = useRouter();
  
  // --- State Hooks ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  // --- Price Logic ---
  const basePrice = 50;
  const discountedPrice = 0; // Price when coupon is applied
  const displayPrice = discountApplied ? discountedPrice : basePrice;

  // --- Event Handlers ---

  /**
   * Handles the checkout process by calling the API to create a Stripe session.
   */
  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: couponCode.trim().toUpperCase(),
          product: "premium",
          mode: "payment",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session.");
      }

      const { url } = await response.json();
      // Redirect the user to the Stripe checkout page
      window.location.href = url; 
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not connect to payment provider.");
      setLoading(false);
    }
  };

  /**
   * Updates the coupon code and checks for a specific discount code.
   * @param {string} value The current value of the input field.
   */
  const handleCouponChange = (value) => {
    setCouponCode(value);
    // Hardcoded check for a specific free access coupon
    if (value.trim().toUpperCase() === "DRKELVIN100") {
      setDiscountApplied(true);
    } else {
      setDiscountApplied(false);
    }
  };

  // --- Features Data ---
  const features = [
    { 
      icon: <Check size={24} />, 
      title: "Comprehensive ADHD Assessment", 
      description: "Unlock the complete 75-question, evidence-based ADHD test." 
    },
    { 
      icon: <FileText size={24} />, 
      title: "Downloadable PDF Report", 
      description: "Get a professional PDF summary of your test results." 
    },
    { 
      icon: <Star size={24} />, 
      title: "Priority Access to Updates", 
      description: "Get first access to all new ADHD tools and features." 
    },
    { 
      icon: <Infinity size={24} />, 
      title: "Unlimited Access", 
      description: "Revisit your test results and tools anytime without limits." 
    },
    // The commented-out features from the original code are omitted here for brevity
  ];

  // --- Rendered JSX ---
  return (
    <div className="bg-[#0a122a] text-white min-h-screen overflow-hidden">
      
      {/* Hero Section with Animated Background */}
      <div className="relative py-24 sm:py-32 overflow-hidden">
        <AnimatedGrid />
        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center animate-hero-title-fade">
          <p className="font-serif text-base font-semibold leading-7 text-blue-400 uppercase tracking-widest flex justify-center items-center">
            <Tornado size={20} className="mr-2 text-cyan-400" />
            SIMPLE, ONE-TIME PAYMENT
          </p>
          <h1 className="font-serif mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
            Unlock Your Premium ADHD Recovery Plan
          </h1>
          <p className="font-sans mt-6 text-xl leading-8 text-gray-300">
            Get lifetime premium access for a single payment. No subscriptions, just clarity and tools you need.
          </p>
        </div>
      </div>

      {/* Pricing and Features Section */}
      <div className="pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Pricing Card (Order 2 on mobile, 1 on desktop) */}
          <div className="bg-[#101b3d] p-8 rounded-2xl shadow-2xl border border-blue-400/20 order-2 lg:order-1">
            <h2 className="font-sans text-3xl font-semibold text-white">Premium Access</h2>
            <p className="mt-4 text-6xl font-extrabold text-white flex items-baseline">
              £{displayPrice}
              {displayPrice < basePrice && <span className="text-xl line-through ml-4 text-red-400">£{basePrice}</span>}
              <span className="font-sans text-xl font-medium text-gray-400 ml-2"> one-time</span>
            </p>

            {discountApplied && <p className="text-green-400 mt-2 text-lg font-medium">🎉 Coupon applied! You get free access.</p>}

            <div className="mt-8">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => handleCouponChange(e.target.value)}
                className="font-sans w-full p-4 border-2 border-gray-600 rounded-xl text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="font-sans mt-6 w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl hover:bg-blue-700 transition-colors"
            >
              {loading ? "Redirecting..." : `Unlock Premium Now — £${displayPrice}`}
            </button>
            {error && <p className="font-sans text-red-400 text-center mt-4">{error}</p>}
          </div>

          {/* Features List (Order 1 on mobile, 2 on desktop) */}
          <div className="order-1 lg:order-2">
            <h3 className="font-serif text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">Your Premium Access Includes:</h3>
            <div className="space-y-10">
              {features.map((feature, index) => (
                <FeatureListItem key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer />

      {/* Global CSS (for animations) */}
      <style jsx global>{`
        .animate-hero-title-fade {
          animation: hero-title-fade 1.5s ease-out forwards;
        }
        @keyframes hero-title-fade {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-spin-slow-medium {
          animation: spin-slow-medium 50s linear infinite;
          transform-origin: center;
        }
        @keyframes spin-slow-medium {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}