"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  BrainCircuit,
  ShieldCheck,
  DollarSign,
  Lightbulb,
} from "lucide-react";
import Footer from "../../components/home/Footer";

// ----------------- Animated Hero -----------------
const AnimatedBrainCircuit = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
    <svg
      viewBox="0 0 200 200"
      className="w-[100vw] max-w-4xl h-auto text-blue-500/10 animate-spin-slow-reverse opacity-50"
      style={{ transformOrigin: "center" }}
    >
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <path
        d="M30 70 C50 30, 150 30, 170 70 S150 170, 100 170 S30 150, 30 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.3"
        className="stroke-cyan-300/30 animate-pulse-slow"
      />
      <path
        d="M50 50 L150 150 M150 50 L50 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.2"
        className="stroke-blue-400/30"
      />
      <circle cx="100" cy="100" r="5" fill="currentColor" className="text-cyan-400 animate-ping-slow" />
    </svg>
  </div>
);

// ----------------- Feature Item -----------------
const FeatureListItem = ({ icon, text }) => {
  const parts = text.split(":");

  return (
    <li className="flex items-start">
      <span className="flex-shrink-0 text-cyan-400 mt-1 mr-4">{icon}</span>
      <p className="text-gray-300 leading-relaxed text-lg">
        {parts.length > 1 ? (
          <>
            <strong className="text-white">{parts[0]}</strong>: {parts.slice(1).join(":")}
          </>
        ) : (
          <strong className="text-white">{text}</strong>
        )}
      </p>
    </li>
  );
};

// ----------------- Page -----------------
export default function ADHDClinicalAssessmentPricing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const basePrice = 750;
  const discountedPrice = 0;
  const displayPrice = discountApplied ? discountedPrice : basePrice;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: couponCode.trim().toUpperCase(),
          product: "adhd_assessment", // 👈 lookup key
          mode: "payment",
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Checkout failed");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  // FIX APPLIED HERE: Removed the type annotation ': string'
  const handleCouponChange = (value) => { 
    setCouponCode(value);
    setDiscountApplied(value.trim().toUpperCase() === "DRKELVIN100");
  };

  const features = [
    { text: "Consultant Psychiatrist-Led Diagnosis", icon: <BrainCircuit size={20} /> },
    { text: "2-Hour Dedicated Virtual Consultation (via secure telehealth)", icon: <Clock size={20} /> },
    { text: "Comprehensive DSM-5 Evaluation", icon: <CheckCircle size={20} /> },
    { text: "Formal, Medically Recognized Detailed Clinical Report", icon: <ShieldCheck size={20} /> },
    { text: "Differential Diagnosis Screening & Rule-Outs", icon: <CheckCircle size={20} /> },
    { text: "Personalised Next Steps & Expert-Guided Recommendations", icon: <BrainCircuit size={20} /> },
    { text: "Fast Access: Avoid NHS Waiting Times", icon: <Clock size={20} /> },
  ];

  return (
    <div className="bg-[#0a122a] text-white min-h-screen overflow-hidden">
      {/* HERO */}
      <div className="relative py-24 sm:py-32 overflow-hidden">
        <AnimatedBrainCircuit />
        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center animate-hero-title-fade">
          <p className="font-serif text-base font-semibold leading-7 text-cyan-400 uppercase tracking-widest flex justify-center items-center">
            <Lightbulb size={20} className="mr-2 text-blue-400" />
            DEFINITIVE DIAGNOSIS
          </p>
          <h1 className="font-serif mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
            The Gold Standard:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              ADHD Clinical Assessment
            </span>
          </h1>
          <p className="font-sans mt-6 text-xl leading-8 text-gray-300">
            Get definitive clarity with a <strong>comprehensive, psychiatrist-led diagnostic evaluation</strong>, built on robust DSM-5 standards.
          </p>
        </div>
      </div>

      {/* CARD */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="max-w-2xl mx-auto bg-[#101b3d] rounded-3xl shadow-2xl border border-blue-400/20 overflow-hidden transform transition duration-500 hover:scale-[1.01] hover:shadow-blue-500/30">
          <div className="p-10 text-center bg-blue-600/10 border-b border-blue-400/30">
            <p className="text-sm uppercase tracking-widest font-semibold text-blue-300">
              Total Investment (One-Time Fee)
            </p>
            <h2 className="text-6xl font-extrabold text-white mt-2 flex items-center justify-center">
              <DollarSign className="w-8 h-8 mr-2 text-cyan-400" />
              £{displayPrice}
            </h2>
            {discountApplied && (
              <p className="text-green-400 mt-2 text-lg font-medium">
                🎉 Coupon applied! You get free access.
              </p>
            )}
            <p className="text-sm text-gray-400 mt-2">
              Full Clinical & Medico-Legal Standard Report Included
            </p>
          </div>

          <div className="p-10">
            <h3 className="text-3xl font-serif font-bold text-white mb-8">What Your Assessment Covers:</h3>
            <ul className="space-y-6">
              {features.map((f, i) => (
                <FeatureListItem key={i} text={f.text} icon={f.icon} />
              ))}
            </ul>

            {/* Coupon Input */}
            <div className="mt-8">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => handleCouponChange(e.target.value)}
                className="font-sans w-full p-4 border-2 border-gray-600 rounded-xl text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-10 w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-gray-900 text-xl font-bold py-5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/50 disabled:bg-gray-600"
            >
              {loading ? "Redirecting..." : `Secure Your Assessment Slot — £${displayPrice}`}
            </button>
            <p className="mt-4 text-center text-xs text-gray-500">
              Powered by Stripe for secure payment processing.
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {/* ANIMATIONS */}
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
        .animate-spin-slow-reverse {
          animation: spin-reverse 70s linear infinite;
          transform-origin: center;
        }
        @keyframes spin-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        .animate-pulse-slow {
          animation: pulse-opacity 8s infinite ease-in-out;
        }
        .animate-ping-slow {
          animation: ping-custom 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes pulse-opacity {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes ping-custom {
          0% {
            transform: scale(0.2);
            opacity: 0.8;
          }
          80%, 100% {
            transform: scale(2.0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}