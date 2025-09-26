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
    Tornado, // New Icon for the Hero Element
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

// ----------------- New Animated Hero Component -----------------

/**
 * Animated Grid Component
 * Renders a large, slowly rotating grid pattern for the hero background.
 */
const AnimatedGrid = () => (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        {/* The SVG for the rotating grid effect */}
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
            {/* Center Circle for focus */}
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

        {/* Custom CSS for the spin-slow-medium animation is added at the bottom */}
    </div>
);


export default function PricingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [discountApplied, setDiscountApplied] = useState(false);

    const basePrice = 50;
    const discountedPrice = 0; // if coupon = 100% off

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

        // 🔑 Frontend preview logic
        if (value.trim().toUpperCase() === "DRKELVIN100") {
            setDiscountApplied(true);
        } else {
            setDiscountApplied(false);
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
        <div className="bg-[#0a122a] text-white min-h-screen overflow-hidden">
            {/* HERO SECTION - Enhanced with Animation */}
            <div className="relative py-24 sm:py-32 overflow-hidden">
                {/* ➡️ New Animated Background Component */}
                <AnimatedGrid />
                {/* ⬅️ End Animated Background Component */}

                <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center animate-hero-title-fade">
                    <p className="font-serif text-base font-semibold leading-7 text-blue-400 uppercase tracking-widest flex justify-center items-center">
                        <Tornado size={20} className="mr-2 text-cyan-400"/>
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

            {/* --- */}

            {/* Pricing & Features */}
            <div className="pb-24 sm:pb-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Pricing Card */}
                    <div className="bg-[#101b3d] p-8 rounded-2xl shadow-2xl border border-blue-400/20 order-2 lg:order-1 transition-all duration-500 hover:border-blue-400/50">
                        <h2 className="font-sans text-3xl font-semibold text-white">
                            Premium Access
                        </h2>

                        <p className="mt-4 text-6xl font-extrabold text-white flex items-baseline">
                            £{displayPrice}
                            {displayPrice < basePrice && <span className="text-xl line-through ml-4 text-red-400">£{basePrice}</span>}
                            <span className="font-sans text-xl font-medium text-gray-400 ml-2">
                                {" "}
                                one-time
                            </span>
                        </p>

                        {discountApplied && (
                            <p className="text-green-400 mt-2 text-lg font-medium">
                                🎉 Coupon applied! You get **free access**.
                            </p>
                        )}

                        <p className="font-sans mt-4 text-gray-300">
                            Pay once. Unlock everything. Keep access forever.
                        </p>

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
                            className="font-sans mt-6 w-full bg-blue-600 text-white font-bold py-4 rounded-xl text-xl shadow-blue-500/50 shadow-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-400 disabled:shadow-none"
                        >
                            {loading
                                ? "Redirecting..."
                                : `Unlock Premium Now — £${displayPrice}`}
                        </button>
                        {error && (
                            <p className="font-sans text-red-400 text-center mt-4">{error}</p>
                        )}
                    </div>

                    {/* Features */}
                    <div className="order-1 lg:order-2">
                        <h3 className="font-serif text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4">
                            Your Premium Access Includes:
                        </h3>
                        <div className="space-y-10">
                            {features.map((feature, index) => (
                                <FeatureListItem key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- */}

            <Footer />

            {/* Animations (Global Styles) - ADDED 'spin-slow-medium' KEYFRAME ➡️ */}
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
                /* Slower spin for the large hero element */
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
            {/* ⬅️ END ADDITION */}
        </div>
    );
}