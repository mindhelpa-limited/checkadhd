"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/home/Footer";
import {
  Check,
  BrainCircuit,
  BookOpen,
  FileText,
  BarChart3,
  Flame,
  Star,
  Infinity,
} from "lucide-react";

// --- Feature Item Component ---
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

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const displayPrice = 50;

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: couponCode.trim().toUpperCase(),
          product: "premium", // 👈 define product as premium
          mode: "payment", // 👈 one-time payment (not subscription)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session.");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not connect to payment provider.");
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Check size={24} />,
      title: "Comprehensive ADHD Assessment",
      description: "Unlock the complete 75-question, evidence-based ADHD test.",
    },
    {
      icon: <BrainCircuit size={24} />,
      title: "Personalized Recovery Dashboard",
      description: "Track insights and recommended next steps tailored to you.",
    },
    {
      icon: <BookOpen size={24} />,
      title: "ADHD Educational Resources",
      description: "Access interactive readings and coping strategies.",
    },
    {
      icon: <FileText size={24} />,
      title: "Downloadable PDF Report",
      description: "Get a professional PDF summary of your test results.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Progress Tracking",
      description: "Visual charts to measure your growth and improvements.",
    },
    {
      icon: <Flame size={24} />,
      title: "Motivation Streaks",
      description: "Stay consistent with streaks and daily motivation tools.",
    },
    {
      icon: <Star size={24} />,
      title: "Priority Access to Updates",
      description: "Get first access to all new ADHD tools and features.",
    },
    {
      icon: <Infinity size={24} />,
      title: "Unlimited Access",
      description: "Revisit your test results and tools anytime without limits.",
    },
  ];

  return (
    <div className="bg-[#0a122a] text-white min-h-screen">
      {/* Hero */}
      <div className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="font-sans text-base font-semibold leading-7 text-blue-400 uppercase tracking-wider">
            SIMPLE, ONE-TIME PAYMENT
          </p>
          <h1 className="font-sans mt-2 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Premium ADHD Recovery Plan
          </h1>
          <p className="font-sans mt-6 text-lg leading-8 text-gray-300">
            Get lifetime premium access for a single payment. No subscriptions.
          </p>
        </div>
      </div>

      {/* Pricing & Features */}
      <div className="pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Pricing Card */}
          <div className="bg-[#101b3d] p-8 rounded-2xl shadow-lg border border-white/10 order-2 lg:order-1">
            <h2 className="font-sans text-3xl font-semibold text-white">
              Premium Access
            </h2>

            <p className="mt-4 text-5xl font-extrabold text-white">
              £{displayPrice}
              <span className="font-sans text-xl font-medium text-gray-400">
                {" "}
                one-time
              </span>
            </p>

            <p className="font-sans mt-4 text-gray-300">
              Pay once. Unlock everything. Keep access forever.
            </p>

            <div className="mt-8">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="font-sans w-full p-3 border border-gray-600 rounded-lg text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="font-sans mt-4 w-full bg-blue-600 text-white font-semibold py-4 rounded-lg text-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? "Redirecting..." : `Unlock Premium — £${displayPrice}`}
            </button>
            {error && (
              <p className="font-sans text-red-400 text-center mt-4">{error}</p>
            )}
          </div>

          {/* Features */}
          <div className="order-1 lg:order-2">
            <h3 className="font-sans text-lg font-semibold text-white mb-6">
              Your Premium Access Includes:
            </h3>
            <div className="space-y-8">
              {features.map((feature, index) => (
                <FeatureListItem key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
