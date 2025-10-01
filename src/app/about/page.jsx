
"use client";
import { Zap, Brain, CheckCircle, Award, Briefcase, TrendingUp } from "lucide-react";

// --- Custom Dark Navy Color (Based on your image) ---
const DARK_NAVY = "#101935";

// --- Utility: Animated Heading Component (Revised for higher impact) ---
const AnimatedHeading = ({ children }) => {
  const words = children.split(" ");
  return (
    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block animate-fadeInUp mr-2"
          style={{ animationDelay: `${0.2 + index * 0.08}s` }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
};

// --- Value Card Component (Enhanced with Hover Animation) ---
const ValueCard = ({ icon, title, children }) => (
  <div className="p-8 bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl transition-all duration-500 hover:bg-white/10 hover:translate-y-[-5px] hover:shadow-cyan-500/10 border border-white/10 animate-fadeInUp">
    <div className="flex items-center justify-center w-14 h-14 bg-white text-cyan-400 rounded-lg mb-4 transition-transform duration-500 group-hover:scale-110">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="mt-2 text-blue-200">{children}</p>
  </div>
);

// --- Main About Page Component ---
export default function UltimatePremiumAboutPage() {
  return (
    <div className="text-gray-800">
      {/* Custom Styles for Animation and Premium Gradient with DARK NAVY base */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
        }
        
        @keyframes gradientPulse {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-background {
          background: linear-gradient(-45deg, ${DARK_NAVY} 30%, #1d4ed8 55%, #3b82f6 75%, ${DARK_NAVY} 100%);
          background-size: 400% 400%;
          animation: gradientPulse 18s ease infinite;
          box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.7);
          position: relative;
        }
      `}</style>

      {/* --- 1. HERO SECTION: REVISED FOR MAXIMUM IMPACT AND BEAUTY --- */}
      <div className="gradient-background relative h-auto py-40 md:py-60 flex items-center justify-center text-center text-white overflow-hidden">
        <div className="relative z-10 px-4 max-w-5xl mx-auto">
          
          <div className="p-8 md:p-12 bg-black/15 backdrop-blur-md rounded-3xl border border-blue-400/20 shadow-2xl shadow-black/50">
            
            <p className="text-lg md:text-xl font-medium tracking-widest uppercase text-cyan-300 animate-fadeInUp mb-4" style={{ animationDelay: "0.1s" }}>
                Comprehensive Mental Wellness for Every Mind
            </p>

            <AnimatedHeading>
              Clarity, Recovery, and Psychiatrist-Led Coaching
            </AnimatedHeading>
            
            <p
              className="mt-6 text-xl md:text-2xl max-w-4xl mx-auto text-blue-200 animate-fadeInUp"
              style={{ animationDelay: "1.0s" }}
            >
              We provide the **structured evaluations** and **personalized recovery pathways** required to guide you forward with confidence and achieve your most ambitious personal goals.
            </p>
            
            <div className="mt-12 animate-fadeInUp" style={{ animationDelay: "1.2s" }}>
              <a
                href="#our-approach"
                className="inline-block px-12 py-5 text-xl font-semibold text-blue-900 bg-white rounded-full shadow-2xl hover:bg-blue-50 transition duration-500 transform hover:scale-[1.03] hover:shadow-white/40"
                style={{ transitionDuration: '500ms' }}
              >
                Start Your Personalized Recovery Journey
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* --- 2. OUR CLINICAL FOUNDATION SECTION --- */}
      <div id="our-approach" className="py-32 bg-white shadow-xl shadow-black/5" >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="animate-fadeInUp" style={{ animationDelay: "1.4s" }}>
              <span className="text-blue-600 font-semibold tracking-widest uppercase text-sm">
                THE MINDHELPA DIFFERENCE
              </span>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mt-2 mb-6 rounded-full"></div>
              
              <h2 className="text-4xl font-bold mt-2 mb-6 text-gray-900">
                Full-Spectrum Support: From Assessment to Achieving Goals
              </h2>
              <p className="text-gray-600 text-xl leading-relaxed">
                We bridge the gap between initial **screening and assessment** and sustained, real-world **recovery**. Our system is built on a five-part daily plan that incorporates mindful habits, cognitive care, and science-based exercises. We don't just assess; we provide the **Psychiatrist-Led Coaching** and **Daily Recovery Tools** necessary to ensure you take charge of your mental health journey.
              </p>
              <ul className="mt-8 space-y-4 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle size={22} className="text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">**Precision Assessment:** DSM-5 aligned evaluations for clarity.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={22} className="text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">**Daily Recovery:** Science-based tools for resilience and focus.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={22} className="text-cyan-500 mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">**Professional Guidance:** Direct coaching from licensed psychiatrists.</span>
                </li>
              </ul>
            </div>
            <div className="text-center animate-fadeInUp" style={{ animationDelay: "1.6s" }}>
              <div className="w-full h-96 bg-blue-50 border-2 border-blue-200 rounded-2xl flex flex-col items-center justify-center shadow-2xl shadow-blue-300/30 p-8">
                <TrendingUp size={80} className="text-blue-500 mb-4" />
                <p className="text-2xl font-semibold text-blue-700">Measurable Progress</p>
                <p className="text-gray-500 mt-2">See how our structured plan guides global recovery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. OUR CORE VALUES & INSTITUTE SECTION --- */}
      <div className="py-32" style={{ backgroundColor: DARK_NAVY }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16 animate-fadeInUp" style={{ animationDelay: "1.8s" }}>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              Our Commitment: Excellence in Care & Practice
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-300 mx-auto mt-4 rounded-full"></div>
            <p className="mt-4 text-xl text-blue-300">
              The principles that drive our clinical services and the specialized training offered through the **Mindhelpa Institute**.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <ValueCard icon={<Award size={28} />} title="Clinical Excellence">
              Our methods are grounded in psychiatric research and evidence-based practice.
            </ValueCard>
            <ValueCard icon={<Brain size={28} />} title="Holistic Assessment">
              We look beyond symptoms, considering the full context of your life and goals.
            </ValueCard>
            <ValueCard icon={<Zap size={28} />} title="Goal-Oriented Coaching">
              Focused, accountable coaching to help you crush your most important personal goals.
            </ValueCard>
            <ValueCard icon={<Briefcase size={28} />} title="Professional Training">
              Supporting the future of mental health through the specialized programs of our Institute.
            </ValueCard>
          </div>
        </div>
      </div>

      {/* --- 4. CALL TO ACTION / GLOBAL REACH SECTION --- */}
      <div className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center animate-fadeInUp" style={{ animationDelay: "2.0s" }}>
          <h2 className="text-4xl font-bold text-gray-900">
            Ready to Build the Life You Deserve?
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Your mental health journey doesn’t have to be chaotic. Recovery is possible — and we’ll guide you **globally** with expert support every step of the way.
          </p>
          <div className="mt-10">
            <a
              href="/get-started-link"
              className="inline-block px-12 py-5 text-xl font-bold text-white bg-blue-700 rounded-lg shadow-2xl shadow-blue-500/50 hover:bg-blue-800 transition duration-500 transform hover:scale-[1.03]"
              style={{
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5), 0 0 10px rgba(255, 255, 255, 0.4) inset',
                transitionDuration: '500ms'
              }}
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}