"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  ClipboardList,
  FileText,
  CheckCircle,
  BarChart2,
  Lightbulb,
  Printer,
  LayoutDashboard,
  Infinity,
} from "lucide-react";

// Reusable list item with reveal animation + icon
const FeatureListItem = ({ title, icon }) => {
  const itemRef = useRef(null);
  const [isItemVisible, setIsItemVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsItemVisible(true);
    }, { threshold: 0.5 });

    if (itemRef.current) observer.observe(itemRef.current);
    return () => itemRef.current && observer.unobserve(itemRef.current);
  }, []);

  return (
    <li
      ref={itemRef}
      className={`flex items-start gap-4 transform transition-all duration-700 ${
        isItemVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 grid place-items-center ${
          isItemVisible ? "animate-bounce-in" : ""
        }`}
      >
        <div className="text-blue-300">{icon}</div>
      </div>
      <span className="text-gray-200">{title}</span>
    </li>
  );
};

export default function PricingHighlight() {
  const router = useRouter();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Final 8 items — assessment-only package
  const features = [
    {
      title: "Comprehensive 75-Question ADHD Assessment",
      icon: <ClipboardList className="w-5 h-5" />,
    },
    {
      title: "Instant PDF Report of Results",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: "Clinically-Validated ADHD Scoring (ASRS + DSM-5 Based)",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      title: "Personalized Strengths & Challenges Breakdown",
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      title: "Professional Recommendations for Next Steps",
      icon: <Lightbulb className="w-5 h-5" />,
    },
    {
      title: "Printable Insights for Sharing with Doctor or Coach",
      icon: <Printer className="w-5 h-5" />,
    },
    {
      title: "Secure Online Dashboard to View Results Anytime",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      title: "Lifetime Access — One-Time Payment, No Subscriptions",
      icon: <Infinity className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a122a] py-32 text-white overflow-hidden"
    >
      {/* Floating Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full animate-float-slow" />
      </div>

      <div
        className={`max-w-7xl mx-auto px-6 lg:px-8 relative z-10 transform transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base font-semibold tracking-widest text-blue-400 uppercase">
            Simple, One-Time Pricing
          </p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-bold text-white">
            Lifetime Access for Just £50
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            Get everything you need for a clear ADHD assessment — one plan, one
            payment, no subscriptions.
          </p>
        </div>

        {/* Pricing + Image */}
        <div className="mt-24 flex flex-col lg:flex-row-reverse gap-16 items-center">
          {/* Visual */}
          <div
            className={`w-full lg:w-1/2 flex justify-center transform transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <div className="relative w-full h-auto p-4 sm:p-8">
              <Image
                src="/images/price-value.png"
                alt="Visual representation of ADHD toolkit"
                width={1000}
                height={800}
                className="w-full h-auto object-contain animate-image-float-pulse"
              />
            </div>
          </div>

          {/* Pricing Card */}
          <div
            className={`w-full lg:w-1/2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/10 transition-all duration-1000 delay-500 hover:scale-[1.02] hover:border-blue-500/30 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-3xl font-serif font-bold text-white">
              ADHD Assessment Package
            </h3>

            {/* Static price */}
            <p className="mt-6 text-5xl font-extrabold text-white">
              £50 <span className="text-xl font-medium text-gray-400"> one-time</span>
            </p>

            <p className="mt-4 text-gray-300">
              A single payment for lifetime access to your ADHD results and insights.
            </p>

            {/* CTA */}
            <button
              onClick={() => router.push("/pricing")}
              className="mt-8 w-full text-white font-bold py-4 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 pulsing-button"
            >
              Get Lifetime Access
            </button>

            <ul className="mt-8 space-y-4">
              {features.map((f, i) => (
                <FeatureListItem key={i} title={f.title} icon={f.icon} />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="absolute bottom-0 left-0 w-full h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      {/* Styles */}
      <style jsx>{`
        .pulsing-button {
          background-image: linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6);
          background-size: 200% auto;
        }
        .pulsing-button:hover {
          animation: pulse-button-bg 1s infinite linear;
        }
        @keyframes pulse-button-bg {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          80% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-10px, -10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        @keyframes image-float-pulse {
          0% { transform: translateY(0) scale(0.98); filter: drop-shadow(0 0 5px rgba(59,130,246,.4)); }
          50% { transform: translateY(-8px) scale(1); filter: drop-shadow(0 0 15px rgba(59,130,246,.6)); }
          100% { transform: translateY(0) scale(0.98); filter: drop-shadow(0 0 5px rgba(59,130,246,.4)); }
        }
        .animate-image-float-pulse { animation: image-float-pulse 4s infinite ease-in-out; }
      `}</style>
    </section>
  );
}
