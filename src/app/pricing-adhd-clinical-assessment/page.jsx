// src/app/pricing-adhd-clinical-assessment/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Clock, BrainCircuit, ShieldCheck, DollarSign } from "lucide-react";
import Footer from "../../components/home/Footer"; // Adjust path if necessary

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
    // **FIX APPLIED HERE**: "DSM-5" is now enclosed in quotes.
    { text: "Comprehensive DSM-5 Evaluation", icon: <CheckCircle size={20} /> },
    { text: "Formal, Medically Recognized Detailed Clinical Report", icon: <ShieldCheck size={20} /> },
    { text: "Differential Diagnosis Screening & Rule-Outs", icon: <CheckCircle size={20} /> },
    { text: "Personalised Next Steps & Expert-Guided Recommendations", icon: <BrainCircuit size={20} /> },
    { text: "Fast Access: Avoid NHS Waiting Times", icon: <Clock size={20} /> },
  ];

  const handleStripeCheckout = () => {
    // In a real application, this would redirect to a Stripe Checkout URL
    // for the £750 one-time payment.
    console.log("Redirecting to Stripe Checkout for ADHD Clinical Assessment...");
    
    // Placeholder for actual Stripe integration redirect
    alert("Redirecting to Stripe for secure payment of £750...");
    // router.push('YOUR_STRIPE_CHECKOUT_LINK'); 
  };

  return (
    <div className="bg-[#0a122a] text-white min-h-screen pt-16">
      
      {/* HEADER/HERO SECTION */}
      <div className="max-w-4xl mx-auto text-center py-16 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold font-serif text-white leading-tight">
          The Gold Standard: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">ADHD Clinical Assessment</span>
        </h1>
        {/* **FIX APPLIED HERE**: "DSM-5" is now enclosed in quotes. */}
        <p className="mt-4 text-xl text-gray-300">
          Get definitive clarity with a comprehensive, psychiatrist-led diagnostic evaluation, built on robust "DSM-5" standards.
        </p>
      </div>

      {/* PRICING CARD SECTION (Blue Gradient & Robust Content) */}
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl overflow-hidden transform transition duration-500 hover:scale-[1.01] hover:shadow-blue-500/20">
          
          {/* Header with Blue Gradient */}
          <div className="p-8 text-center bg-gradient-to-br from-blue-600 to-blue-800 border-b border-blue-400/50">
            <DollarSign className="w-10 h-10 mx-auto text-white/90 mb-3" />
            <p className="text-sm uppercase tracking-widest font-semibold text-blue-200">One-Time Fee</p>
            <h2 className="text-5xl font-bold text-white mt-1">
              £{assessmentPrice}
            </h2>
            <p className="text-sm text-blue-200 mt-1">Full Clinical & Medico-Legal Standard</p>
          </div>

          {/* Core Content */}
          <div className="p-8">
            <h3 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-3">What You Receive:</h3>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 text-cyan-400 mt-1 mr-3">
                    {feature.icon}
                  </span>
                  <p className="text-gray-300 leading-relaxed">
                    <strong className="text-white">{feature.text.split(':')[0]}</strong>
                    {feature.text.includes(':') ? `: ${feature.text.split(':')[1]}` : ''}
                  </p>
                </li>
              ))}
            </ul>

            {/* Justification */}
            <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-lg font-semibold text-blue-400 mb-2">Why This Investment?</p>
                <p className="text-gray-400 text-sm">
                    This fee covers the time and specialist expertise of a Consultant Psychiatrist, the required clinical tools, and the professional administrative costs of producing a **formal, detailed diagnostic report** that holds weight with healthcare providers and institutions. It's the definitive step towards treatment.
                </p>
            </div>
            
            {/* Stripe CTA Button */}
            <button
              onClick={handleStripeCheckout}
              className="mt-8 w-full glow-on-hover bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-gray-900 text-xl font-bold py-4 rounded-xl transition-all duration-300 shadow-lg"
            >
              Secure Your Assessment Slot $\rightarrow$
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">
                Powered by Stripe for secure payment processing.
            </p>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}