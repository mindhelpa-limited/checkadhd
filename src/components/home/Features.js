"use client";
import { Check, Target, Award } from "lucide-react";

// This component presents the core features of the product with a modern, dark theme.
// The design is responsive and uses subtle animations to match the hero section.
export default function Features() {
  return (
    <section className="bg-[#0a122a] py-24 sm:py-32 animate-[fade-in_1s_ease-out]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base font-semibold leading-7 text-blue-400 uppercase tracking-wide">THE CORE EXPERIENCE</p>
          <h2 className="font-serif mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            A Clear Path to Clarity
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Our platform combines science-backed assessments with a personalized recovery program to help you build focus and find your calm.
          </p>
        </div>

        {/* Feature 1: Evidence-Based Assessment */}
        <div className="mt-20 grid grid-cols-1 gap-16 items-center lg:grid-cols-2">
          <div className="lg:order-first">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-white">
              Evidence-Based Assessment
            </h3>
            <p className="mt-4 text-gray-300">
              Built by clinical experts, our comprehensive assessment provides accurate, personalized insights based on scientifically-validated frameworks. It's the essential first step to understanding your unique cognitive patterns.
            </p>
            <dl className="mt-6 space-y-4">
              <div className="relative pl-9">
                <dt className="inline font-semibold text-white">
                  <Check className="absolute left-1 top-1 h-5 w-5 text-blue-400" />
                  <span className="ml-2">Clinically-Informed.</span>
                </dt>
                <dd className="inline ml-2 text-gray-400">Grounded in ASRS & DSM-5 criteria.</dd>
              </div>
              <div className="relative pl-9">
                <dt className="inline font-semibold text-white">
                  <Check className="absolute left-1 top-1 h-5 w-5 text-blue-400" />
                  <span className="ml-2">Actionable Insights.</span>
                </dt>
                <dd className="inline ml-2 text-gray-400">Forms the foundation of your recovery plan.</dd>
              </div>
            </dl>
          </div>
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2874&auto=format&fit=crop"
            alt="A person sitting calmly and reading a book, representing focus and clarity."
            className="rounded-3xl shadow-xl transform transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Feature 2: Personalized Recovery Plan (Reversed layout) */}
        <div className="mt-24 grid grid-cols-1 gap-16 items-center lg:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1517486801948-26ff38a0a911?q=80&w=2940&auto=format&fit=crop"
            alt="A person meditating peacefully in a well-lit, serene room."
            className="rounded-3xl shadow-xl transform transition-transform duration-500 hover:scale-[1.02]"
          />
          <div className="lg:order-last">
            <h3 className="font-serif text-3xl font-bold tracking-tight text-white">
              Personalized Recovery Plan
            </h3>
            <p className="mt-4 text-gray-300">
              Receive a daily set of unique, AI-powered activities. From guided meditations to interactive readings, your plan is designed to build consistency and improve focus in just a few minutes each day.
            </p>
            <dl className="mt-6 space-y-4">
              <div className="relative pl-9">
                <dt className="inline font-semibold text-white">
                  <Target className="absolute left-1 top-1 h-5 w-5 text-blue-400" />
                  <span className="ml-2">AI-Powered.</span>
                </dt>
                <dd className="inline ml-2 text-gray-400">Engage with new, unique content every day.</dd>
              </div>
              <div className="relative pl-9">
                <dt className="inline font-semibold text-white">
                  <Award className="absolute left-1 top-1 h-5 w-5 text-blue-400" />
                  <span className="ml-2">Gamified.</span>
                </dt>
                <dd className="inline ml-2 text-gray-400">Stay motivated by building your daily streak.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
       {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
