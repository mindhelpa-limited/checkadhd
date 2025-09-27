"use client";

import { useRouter } from "next/navigation";
import { 
    CheckCircle, 
    Clock, 
    BrainCircuit, 
    ShieldCheck, 
    DollarSign,
    Lightbulb, // New icon for the Hero
} from "lucide-react";
// The import for your Footer component
import Footer from "../../components/home/Footer"; // Adjust path if necessary

// ----------------- New Animated Hero Component -----------------

/**
 * Animated Brain Circuit Component
 * Renders a large, slowly pulsing/rotating abstract circuit pattern for the hero background.
 */
const AnimatedBrainCircuit = () => (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        {/* The SVG for the rotating circuit effect */}
        <svg
            viewBox="0 0 200 200"
            className="w-[100vw] max-w-4xl h-auto text-blue-500/10 animate-spin-slow-reverse opacity-50"
            style={{ transformOrigin: "center" }}
        >
            {/* Main Brain-like Circle */}
            <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
            />
            {/* Inner Circuit paths (abstract wiring) */}
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
            {/* Center Node */}
            <circle
                cx="100"
                cy="100"
                r="5"
                fill="currentColor"
                className="text-cyan-400 animate-ping-slow"
            />
        </svg>

        {/* Custom CSS for the animations is added at the bottom */}
    </div>
);


// --- Feature Item Component ---
const FeatureListItem = ({ icon, text }) => (
    <li className="flex items-start">
        <span className="flex-shrink-0 text-cyan-400 mt-1 mr-4">
            {icon}
        </span>
        <p className="text-gray-300 leading-relaxed text-lg">
            {/* Check if the text contains a colon to bold the primary point */}
            {text.includes(':') ? (
                <>
                    <strong className="text-white">{text.split(':')[0]}</strong>
                    {`: ${text.split(':')[1]}`}
                </>
            ) : (
                <strong className="text-white">{text}</strong>
            )}
        </p>
    </li>
);

/**
 * Component for the ADHD Clinical Assessment Pricing Page.
 */
export default function ADHDClinicalAssessmentPricing() {
    const router = useRouter();

    const assessmentPrice = 750;

    // Features for the assessment card
    const features = [
        { text: "Consultant Psychiatrist-Led Diagnosis", icon: <BrainCircuit size={20} /> },
        { text: "2-Hour Dedicated Virtual Consultation (via secure telehealth)", icon: <Clock size={20} /> },
        { text: "Comprehensive DSM-5 Evaluation", icon: <CheckCircle size={20} /> },
        { text: "Formal, Medically Recognized Detailed Clinical Report", icon: <ShieldCheck size={20} /> },
        { text: "Differential Diagnosis Screening & Rule-Outs", icon: <CheckCircle size={20} /> },
        { text: "Personalised Next Steps & Expert-Guided Recommendations", icon: <BrainCircuit size={20} /> },
        { text: "Fast Access: Avoid NHS Waiting Times", icon: <Clock size={20} /> },
    ];

    const handleStripeCheckout = () => {
        // Placeholder for actual Stripe integration redirect
        console.log("Redirecting to Stripe Checkout for ADHD Clinical Assessment...");
        alert("Redirecting to Stripe for secure payment of £750...");
        // router.push('YOUR_STRIPE_CHECKOUT_LINK'); 
    };

    return (
        <div className="bg-[#0a122a] text-white min-h-screen overflow-hidden">
            
            {/* HERO SECTION - Enhanced with Animation */}
            <div className="relative py-24 sm:py-32 overflow-hidden">
                
                {/* ➡️ New Animated Background Component */}
                <AnimatedBrainCircuit />
                {/* ⬅️ End Animated Background Component */}
                
                <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center animate-hero-title-fade">
                    <p className="font-serif text-base font-semibold leading-7 text-cyan-400 uppercase tracking-widest flex justify-center items-center">
                        <Lightbulb size={20} className="mr-2 text-blue-400"/>
                        DEFINITIVE DIAGNOSIS
                    </p>
                    <h1 className="font-serif mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
                        The Gold Standard: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">ADHD Clinical Assessment</span>
                    </h1>
                    <p className="font-sans mt-6 text-xl leading-8 text-gray-300">
                        Get definitive clarity with a **comprehensive, psychiatrist-led diagnostic evaluation**, built on robust **"DSM-5" standards**.
                    </p>
                </div>
            </div>

            {/* --- */}

            {/* PRICING CARD SECTION (Premium Card Style) */}
            <div className="max-w-7xl mx-auto px-4 pb-24">
                <div className="max-w-2xl mx-auto bg-[#101b3d] rounded-3xl shadow-2xl border border-blue-400/20 overflow-hidden transform transition duration-500 hover:scale-[1.01] hover:shadow-blue-500/30">
                    
                    {/* Header with Price */}
                    <div className="p-10 text-center bg-blue-600/10 border-b border-blue-400/30">
                        <p className="text-sm uppercase tracking-widest font-semibold text-blue-300">Total Investment (One-Time Fee)</p>
                        <h2 className="text-6xl font-extrabold text-white mt-2 flex items-center justify-center">
                            <DollarSign className="w-8 h-8 mr-2 text-cyan-400"/>
                            £{assessmentPrice}
                        </h2>
                        <p className="text-sm text-gray-400 mt-2">Full Clinical & Medico-Legal Standard Report Included</p>
                    </div>

                    {/* Core Content */}
                    <div className="p-10">
                        <h3 className="text-3xl font-serif font-bold text-white mb-8">What Your Assessment Covers:</h3>
                        <ul className="space-y-6">
                            {features.map((feature, index) => (
                                <FeatureListItem key={index} text={feature.text} icon={feature.icon} />
                            ))}
                        </ul>

                        {/* Justification */}
                        <div className="mt-12 pt-8 border-t border-white/10">
                            <p className="text-xl font-semibold text-blue-400 mb-3">Why This Investment?</p>
                            <p className="text-gray-400 text-base leading-relaxed">
                                This fee covers the significant time and **specialist expertise of a Consultant Psychiatrist**, the required clinical tools, and the professional administrative costs of producing a **formal, detailed diagnostic report** that holds weight with healthcare providers and institutions. It's the definitive step towards clarity and treatment.
                            </p>
                        </div>
                        
                        {/* Stripe CTA Button */}
                        <button
                            onClick={handleStripeCheckout}
                            className="mt-10 w-full glow-on-hover bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-gray-900 text-xl font-bold py-5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/50"
                        >
                            Secure Your Assessment Slot →
                        </button>
                        <p className="mt-4 text-center text-xs text-gray-500">
                            Powered by Stripe for secure payment processing.
                        </p>
                    </div>

                </div>
            </div>
            
            {/* --- */}
            
            {/* ⬇️ This is the correct placement for the Footer ⬇️ */}
            <Footer />

            {/* Animations (Global Styles) */}
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
                /* New slow reverse spin for the large hero element */
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
                /* Slow pulse for the abstract brain path and center node */
                .animate-pulse-slow {
                    animation: pulse-opacity 8s infinite ease-in-out;
                }
                .animate-ping-slow {
                    animation: ping-custom 4s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                @keyframes pulse-opacity {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }
                @keyframes ping-custom {
                    0% { transform: scale(0.2); opacity: 0.8; }
                    80%, 100% { transform: scale(2.0); opacity: 0; }
                }
            `}</style>
        </div>
    );
}