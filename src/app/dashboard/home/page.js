"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tornado } from "lucide-react";

const AnimatedGrid = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
    <svg
      viewBox="0 0 200 200"
      className="w-[100vw] max-w-4xl h-auto text-cyan-500/10 animate-spin-slow-medium"
      style={{ transformOrigin: "center" }}
    >
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

export default function PricingPage() {
  const router = useRouter();
  // State and functions are kept as requested
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const basePrice = 50;
  const discountedPrice = 0;
  const displayPrice = discountApplied ? discountedPrice : basePrice;

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
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not connect to payment provider.");
      setLoading(false);
    }
  };

  const handleCouponChange = (value) => {
    setCouponCode(value);
    if (value.trim().toUpperCase() === "DRKELVIN100") {
      setDiscountApplied(true);
    } else {
      setDiscountApplied(false);
    }
  };

  const handleManageProfile = () => {
    router.push("/dashboard/profile");
  };

  return (
    <div className="bg-[#0a122a] text-white min-h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Reduced vertical padding here from py-24 to py-12 for a slightly higher position */}
      <div className="relative w-full h-full py-12 sm:py-20 overflow-hidden flex flex-col items-center justify-center">
        <AnimatedGrid />
        
        {/* Main Content: Centered Welcome Text and Button */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center animate-hero-title-fade">
          
          {/* Removed the <p> tag containing "SIMPLE, ONE-TIME PAYMENT" and the Tornado icon */}
          
          {/* Only the welcome text remains as the main title, removed the mt-2 (margin-top) to move it up */}
          <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
            Welcome to MindHelpa Dashboard
          </h1>
          
          {/* Button to Manage Profile */}
          <button
            onClick={handleManageProfile}
            className="font-sans mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-xl text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/50"
          >
            Manage Profile
          </button>
        </div>
      </div>

      {/* Keeping the empty style block for the removed feature/pricing section's padding to satisfy the "keep everything else" requirement implicitly */}
      <div className="pb-24 sm:pb-32"></div>
      
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