"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Check } from "lucide-react"; // Only importing the Check icon now

// The FeatureListItem component is simplified to always use the Check icon
const FeatureListItem = ({ feature, isVisible }) => {
  const [isCheckVisible, setIsCheckVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsCheckVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <li className={`flex items-start transition-transform duration-500 transform ${isVisible ? 'translate-x-0' : '-translate-x-10'}`}>
      <Check className={`w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-1 transition-transform duration-500 ${isCheckVisible ? 'animate-bounce-in' : 'scale-0'}`} />
      <span className="text-gray-200">{feature}</span>
    </li>
  );
};

export default function Pricing() {
  const router = useRouter();
  // The features list is simplified to just contain the text
  const features = [
    { text: "Comprehensive 75-Question ADHD Assessment" },
    { text: "Personalized ADHD Recovery Calendar for structured progress." },
    { text: "Daily Targeted Meditations with affirmations." },
    { text: "Daily ADHD Passages with audio option and quizzes." },
    { text: "Recommended Daily Exercise for physical well-being." },
    { text: "Cognitive Care Plan including daily water, fruit, and dietary tracking." },
    { text: "Timed Focus Exercises to build concentration and mental clarity." },
    { text: "Gamified Progress & Daily Streak Tracking to keep you motivated." },
  ];

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a122a] py-32 text-white overflow-hidden"
    >
      {/* Floating Glow Effects (consistent with other sections) */}
      <div className="absolute inset-0 -z-10 animate-float-container">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#A78BFA]/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full animate-float-slow" />
      </div>

      <div className={`max-w-7xl mx-auto px-6 lg:px-8 relative z-10 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Section Heading */}
        <div className={`max-w-3xl mx-auto text-center transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-base font-semibold tracking-widest text-blue-400 uppercase">
            Simple, All-Inclusive Pricing
          </p>
          <h2 className="mt-4 font-serif text-5xl font-bold leading-tight tracking-tight text-white pulsing-heading">
            One Plan, Unlimited Potential
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            Get full access to every feature with our simple premium subscription. No hidden fees, no complicated tiers.
          </p>
        </div>

        {/* Pricing and Animated Image - Layout Swapped for larger screens */}
        <div className="mt-24 flex flex-col lg:flex-row-reverse gap-16 items-center">
          {/* Animated Image Section */}
          <div className={`w-full lg:w-1/2 flex justify-center items-center h-full transform transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="relative w-full h-auto p-4 sm:p-8">
              <Image
                src="/images/price-value.png"
                alt="An abstract glowing network representing a personalized plan for growth"
                width={1000}
                height={800}
                className="w-full h-auto object-contain animate-image-float-pulse"
              />
            </div>
          </div>

          {/* Pricing Card */}
          <div className={`w-full lg:w-1/2 shrink-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/10 transform transition-all duration-1000 delay-500 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-500/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-3xl font-serif font-bold text-white">Premium Recovery Plan</h3>
            <p className="mt-4 text-5xl font-extrabold text-white">
              £15<span className="text-xl font-medium text-gray-400"> / month</span>
            </p>
            <p className="mt-4 text-gray-300">
              Everything you need to build focus, consistency, and a calmer mind.
            </p>

            <button
              onClick={() => router.push("/pricing")}
              className="mt-8 w-full text-white font-bold py-4 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 pulsing-button"
            >
              Get Started Today
            </button>

            <ul className="mt-8 space-y-4">
              {features.map((feature, index) => (
                <FeatureListItem key={index} feature={feature.text} isVisible={isVisible} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Animation Styling */}
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; text-shadow: 0 0 15px rgba(255, 255, 255, 0.6); }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulsing-heading { animation: pulse 2.5s infinite ease-in-out; }

        @keyframes pulse-button-bg {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .pulsing-button {
          background-image: linear-gradient(90deg, #3B82F6, #6D28D9, #3B82F6);
          background-size: 200% auto;
          transition: background-position 0.5s ease-in-out;
        }
        .pulsing-button:hover {
          animation: pulse-button-bg 1s infinite linear;
        }

        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          80% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }

        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-10px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-slow {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
          100% { transform: translate(0, 0); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }

        @keyframes image-float-pulse {
          0% {
            transform: translateY(0px) scale(0.98);
            filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.4));
          }
          50% {
            transform: translateY(-8px) scale(1);
            filter: drop-shadow(0 0 15px rgba(109, 40, 217, 0.6));
          }
          100% {
            transform: translateY(0px) scale(0.98);
            filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.4));
          }
        }
        .animate-image-float-pulse {
          animation: image-float-pulse 4s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}