"use client";
import { useRouter } from "next/navigation";
import Footer from "../../components/home/Footer";
import { useState } from "react";
import { Check, BrainCircuit, BookOpen, HeartPulse, Target, BarChart3 } from "lucide-react";
// import Footer from "@/components/home/Footer"; // 👈 DELETED THIS LINE

// --- Feature Item Component for the detailed list ---
const FeatureListItem = ({ icon, title, description }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100 text-blue-600">
            {icon}
        </div>
        <div className="ml-4">
            <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
            <p className="mt-1 text-gray-600">{description}</p>
        </div>
    </div>
);


// --- Main Pricing Page Component ---
export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const handleSubscription = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode: couponCode }),
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
    { icon: <Check size={24}/>, title: "Complete ADHD Assessment", description: "Unlock the full 75-question, clinically-informed test." },
    { icon: <BrainCircuit size={24}/>, title: "AI-Powered Meditations", description: "Daily guided audio sessions to improve focus." },
    { icon: <BookOpen size={24}/>, title: "Interactive Readings & Quizzes", description: "Learn new coping strategies every day." },
    { icon: <HeartPulse size={24}/>, title: "Daily Care Plan", description: "Track exercise and cognitive health goals." },
    { icon: <Target size={24}/>, title: "Focus Exercises", description: "Engage in unique, 7-minute concentration tasks." },
    { icon: <BarChart3 size={24}/>, title: "Gamified Progress Tracking", description: "Visualize your success and build your streak." },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* --- Hero Section --- */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-base font-semibold leading-7 text-blue-600">SIMPLE, ALL-INCLUSIVE PRICING</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            One Plan, Unlimited Potential
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get full access to every feature with our simple premium subscription. No hidden fees, no complicated tiers. Just one plan to unlock your journey to clarity.
          </p>
        </div>
      </div>

      {/* --- Pricing & Image Section --- */}
      <div className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Image */}
          <div>
            <img 
              src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2940&auto=format&fit=crop" 
              alt="A person at a clean desk, feeling in control and focused."
              className="rounded-2xl shadow-xl w-full h-full object-cover"
            />
          </div>

          {/* Right Side: Pricing Card */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900">Premium Recovery Plan</h2>
            <p className="mt-4 text-5xl font-extrabold text-gray-900">
              £15
              <span className="text-xl font-medium text-gray-500"> / month</span>
            </p>
            <p className="mt-4 text-gray-600">
              Everything you need to build focus, consistency, and a calmer mind.
            </p>
            
            <div className="mt-8">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              onClick={handleSubscription}
              disabled={loading}
              className="mt-4 w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg shadow-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? "Redirecting..." : "Subscribe Now"}
            </button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            <div className="mt-10 pt-8 border-t">
                <h3 className="text-lg font-semibold text-gray-800">Your Daily Toolkit Includes:</h3>
                <div className="mt-6 space-y-6">
                    {features.map((feature, index) => (
                        <FeatureListItem key={index} {...feature} />
                    ))}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Footer /> */} {/* 👈 DELETED THIS LINE */}
    </div>
  );
}