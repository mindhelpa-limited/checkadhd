// src/components/Features.js
"use client";
import { Check, Target, Award } from "lucide-react";

export default function Features() {
  return (
    <section className="bg-soft-ivory py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base font-semibold leading-7 text-sage-green uppercase tracking-wide">THE CORE EXPERIENCE</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-charcoal sm:text-5xl">
            A Clear Path to Clarity
          </h2>
          <p className="mt-6 text-lg leading-8 text-charcoal/80">
            Our platform combines science-backed assessments with a personalized recovery program to help you build focus and find your calm.
          </p>
        </div>

        {/* Feature 1: The Assessment */}
        <div className="mt-20 grid grid-cols-1 gap-16 items-center lg:grid-cols-2">
          <div className="lg:order-first">
            <h3 className="text-3xl font-bold tracking-tight text-charcoal">
              Evidence-Based Assessment
            </h3>
            <p className="mt-4 text-charcoal/80">
              Built by clinical experts, our comprehensive assessment provides accurate, personalized insights based on scientifically-validated frameworks. It's the essential first step to understanding your unique cognitive patterns.
            </p>
            <dl className="mt-6 space-y-4">
              <div className="relative pl-9">
                <dt className="inline font-semibold text-charcoal">
                  <Check className="absolute left-1 top-1 h-5 w-5 text-slate-blue" />
                  <span className="ml-2">Clinically-Informed.</span>
                </dt>
                <dd className="inline ml-2 text-charcoal/80">Grounded in ASRS & DSM-5 criteria.</dd>
              </div>
              <div className="relative pl-9">
                <dt className="inline font-semibold text-charcoal">
                  <Check className="absolute left-1 top-1 h-5 w-5 text-slate-blue" />
                  <span className="ml-2">Actionable Insights.</span>
                </dt>
                <dd className="inline ml-2 text-charcoal/80">Forms the foundation of your recovery plan.</dd>
              </div>
            </dl>
          </div>
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2874&auto=format&fit=crop"
            alt="A person sitting calmly and reading a book, representing focus and clarity."
            className="rounded-3xl shadow-xl transform transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Feature 2: The Recovery Plan (Reversed layout) */}
        <div className="mt-24 grid grid-cols-1 gap-16 items-center lg:grid-cols-2">
          <img
            src="/meditate.png"
            alt="A person meditating peacefully in a well-lit, serene room."
            className="rounded-3xl shadow-xl transform transition-transform duration-500 hover:scale-[1.02]"
          />
          <div className="lg:order-last">
            <h3 className="text-3xl font-bold tracking-tight text-charcoal">
              Personalized Recovery Plan
            </h3>
            <p className="mt-4 text-charcoal/80">
              Receive a daily set of unique, AI-powered activities. From guided meditations to interactive readings, your plan is designed to build consistency and improve focus in just a few minutes each day.
            </p>
            <dl className="mt-6 space-y-4">
              <div className="relative pl-9">
                <dt className="inline font-semibold text-charcoal">
                  <Target className="absolute left-1 top-1 h-5 w-5 text-slate-blue" />
                  <span className="ml-2">AI-Powered.</span>
                </dt>
                <dd className="inline ml-2 text-charcoal/80">Engage with new, unique content every day.</dd>
              </div>
              <div className="relative pl-9">
                <dt className="inline font-semibold text-charcoal">
                  <Award className="absolute left-1 top-1 h-5 w-5 text-slate-blue" />
                  <span className="ml-2">Gamified.</span>
                </dt>
                <dd className="inline ml-2 text-charcoal/80">Stay motivated by building your daily streak.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}