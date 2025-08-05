"use client";
import { UserPlus, CheckCircle, Sparkles } from "lucide-react";

const Step = ({ icon, number, title, children }) => (
  <div className="flex items-start space-x-6 group">
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 font-bold text-xl rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
        {number}
      </div>
      <div className="w-px h-full bg-blue-200 min-h-[8rem]"></div>
    </div>
    <div className="pt-2">
      <div className="flex items-center mb-3 space-x-4">
        <div className="bg-blue-100 text-blue-500 p-3 rounded-full shadow-md">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-gray-300 leading-relaxed max-w-prose">{children}</p>
    </div>
  </div>
);

export default function HowItWorks() {
  return (
    <section className="py-28 sm:py-36 bg-[#0a122a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-in-up">
          <p className="text-blue-400 font-semibold tracking-wide uppercase">How It Works</p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-serif font-bold text-white">
            Simplicity. Safety. Support.
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            We designed this experience to be more than a platform — it's a process. Gentle. Guided. Grounded in science and made for your peace of mind.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-2xl mx-auto space-y-24">
          <Step number="1" icon={<UserPlus size={28} />} title="Create Your Space">
            Begin by choosing your plan and opening your private wellness account. No distractions. Just your journey, your pace.
          </Step>

          <Step number="2" icon={<CheckCircle size={28} />} title="Understand Yourself Deeply">
            Take a clinically-informed ADHD assessment rooted in DSM-5 and ASRS frameworks. You'll gain insights, clarity, and a powerful baseline.
          </Step>

          <Step number="3" icon={<Sparkles size={28} />} title="Begin Your Daily Flow">
            Access your dashboard and start your personalized daily routine — 5 short, intentional, AI-guided activities to build focus, calm, and consistency.
          </Step>
        </div>
      </div>

      {/* Global animation styles */}
      <style jsx global>{`
        .animate-fade-in-up {
          animation: fadeInUp 1.2s ease-out both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}