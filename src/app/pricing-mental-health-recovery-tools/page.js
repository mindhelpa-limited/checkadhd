"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase"; 
import Footer from "../../components/home/Footer";
import {
    Music2,
    Target,
    Heart,
    Brain,
    CheckCircle2,
    BarChart3,
    Bell,
    Waves,
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

// ----------------- Animated Hero Component -----------------
const AnimatedWavePattern = () => (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        <svg
            viewBox="0 0 200 100"
            className="w-[100vw] max-w-4xl h-auto text-green-500/10 animate-wave-float"
            style={{ transformOrigin: "center" }}
        >
            <path
                d="M0 50 C 50 20, 150 80, 200 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                className="stroke-blue-400/20"
            />
            <path
                d="M0 60 C 50 30, 150 90, 200 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="stroke-cyan-400/20"
                style={{ transform: "translateY(-10px)" }}
            />
            <path
                d="M0 40 C 50 10, 150 70, 200 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                className="stroke-green-400/20"
                style={{ transform: "translateY(10px)" }}
            />
        </svg>
    </div>
);

// ----------------- Main Page Component -----------------
export default function RecoveryPricingPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [couponCode, setCouponCode] = useState("");
    
    const monthlyPrice = 20;
    const displayPrice = monthlyPrice;
    const displaySuffix = "/ month";
    const buttonSuffix = "mo";

    const handleSubscription = async () => {
        setLoading(true);
        setError("");
        try {
            const user = auth.currentUser;
            // ✅ Updated redirect paths
            const successRedirect = user 
                ? "/dashboard/goal-tracker" 
                : "/signup-recovery-tools";

            const product = "recovery_monthly";

            const response = await fetch("/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    couponCode: couponCode.trim().toUpperCase(),
                    product,
                    successRedirect,
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
        { icon: <Music2 size={24} />, title: "Music & Healing Sounds", description: "Therapy music, meditation, affirmations, calm sounds, and motivational videos." },
        { icon: <Target size={24} />, title: "Daily Goal Tracker", description: "Set 3 daily and 3 weekly goals with AI reminders and prompts." },
        { icon: <Heart size={24} />, title: "Mindfulness & Breathing", description: "Meditations, breathing practices, and calming exercises." },
        { icon: <Brain size={24} />, title: "Visualization & Journaling", description: "Boost focus, clarity, and resilience with guided journaling." },
        { icon: <CheckCircle2 size={24} />, title: "Positive Affirmations", description: "Daily affirmations to strengthen self-belief and confidence." },
        { icon: <BarChart3 size={24} />, title: "Gamified Streaks", description: "Captain (3 days), Major (7 days), Colonel (1 month), General (3 months), Brigadier (6 months), Field Marshall (1 year)." },
        { icon: <Bell size={24} />, title: "Smart Reminders", description: "AI-powered nudges throughout the day to keep you on track." },
    ];

    return (
        <div className="bg-[#0a122a] text-white min-h-screen overflow-hidden">
            {/* HERO SECTION */}
            <div className="relative py-24 sm:py-32 overflow-hidden">
                <AnimatedWavePattern />
                <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center animate-hero-title-fade">
                    <p className="font-serif text-base font-semibold leading-7 text-green-400 uppercase tracking-widest flex justify-center items-center">
                        <Waves size={20} className="mr-2 text-cyan-400" />
                        SIMPLE, ALL-INCLUSIVE PRICING
                    </p>
                    <h1 className="font-serif mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
                        Your Daily Mental Health Recovery Toolkit
                    </h1>
                    <p className="font-sans mt-6 text-xl leading-8 text-gray-300 max-w-2xl mx-auto">
                        Gain daily access to <strong>music therapy, affirmations, recovery tools</strong>, and <strong>gamified goal tracking</strong>. Stay consistent, stay motivated.
                    </p>
                </div>
            </div>

            {/* Pricing & Features */}
            <div className="pb-24 sm:pb-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Pricing Card */}
                    <div className="bg-[#101b3d] p-8 rounded-2xl shadow-2xl border border-green-400/20 order-2 lg:order-1 transition-all duration-500 hover:border-green-400/50">
                        <h2 className="font-serif text-3xl font-bold text-white">
                            The Recovery Plan
                        </h2>

                        <div className="mt-6">
                            <p className="font-sans px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white shadow-md inline-block">
                                Monthly Subscription
                            </p>
                        </div>
                        
                        <p className="mt-6 text-6xl font-extrabold text-white">
                            £{displayPrice}
                            <span className="font-sans text-xl font-medium text-gray-400">
                                {" "}
                                {displaySuffix}
                            </span>
                        </p>

                        <p className="font-sans mt-4 text-gray-300 text-lg">
                            One subscription. Every tool you need to build focus, consistency,
                            and resilience.
                        </p>

                        {/* Coupon Input */}
                        <div className="mt-8">
                            <input
                                type="text"
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="font-sans w-full p-4 border-2 border-gray-600 rounded-xl text-white bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <button
                            onClick={handleSubscription}
                            disabled={loading}
                            className="font-sans mt-6 w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl shadow-blue-500/50 shadow-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400 disabled:shadow-none"
                        >
                            {loading
                                ? "Redirecting..."
                                : `Start Subscription — £${displayPrice}/${buttonSuffix}`}
                        </button>
                        {error && (
                            <p className="font-sans text-red-400 text-center mt-4">{error}</p>
                        )}
                    </div>

                    {/* Features */}
                    <div className="order-1 lg:order-2">
                        <h3 className="font-serif text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
                            Your Recovery Toolkit Includes:
                        </h3>
                        <div className="space-y-10">
                            {features.map((feature, index) => (
                                <FeatureListItem key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

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
                .animate-wave-float {
                    animation: wave-float 20s ease-in-out infinite alternate;
                }
                @keyframes wave-float {
                    0% {
                        transform: translateY(0) scale(1);
                    }
                    50% {
                        transform: translateY(-5%) scale(1.05);
                    }
                    100% {
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </div>
    );
}
