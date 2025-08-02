"use client";
import { Check } from "lucide-react";

// --- Main Features Component ---
export default function Features() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base font-semibold leading-7 text-blue-600">THE CORE EXPERIENCE</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything You Need to Thrive
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform combines science-backed assessments with an engaging recovery program to help you build consistency and find your focus.
          </p>
        </div>

        {/* Feature 1: Assessment */}
        <div className="mt-20 grid grid-cols-1 gap-16 items-center lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Evidence-Based Assessment
            </h3>
            <p className="mt-4 text-gray-600">
              Built by clinical experts, our 75-question assessment provides accurate, personalized insights based on scientifically-validated frameworks. It's the essential first step to understanding your unique cognitive patterns.
            </p>
            <dl className="mt-6 space-y-4">
              <div className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <Check className="absolute left-1 top-1 h-5 w-5 text-blue-600" />
                  <span>Clinically-Informed.</span>
                </dt>
                <dd className="inline ml-2 text-gray-600">Grounded in ASRS & DSM-5 criteria.</dd>
              </div>
              <div className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <Check className="absolute left-1 top-1 h-5 w-5 text-blue-600" />
                  <span>Actionable Insights.</span>
                </dt>
                <dd className="inline ml-2 text-gray-600">Forms the foundation of your recovery plan.</dd>
              </div>
            </dl>
          </div>
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2900&auto=format&fit=crop"
            alt="Team collaborating around a table with laptops."
            className="rounded-2xl shadow-xl"
          />
        </div>

        {/* Feature 2: Recovery Plan */}
        <div className="mt-24 grid grid-cols-1 gap-16 items-center lg:grid-cols-2">
           <div className="lg:order-last">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">
              Personalized Recovery Plan
            </h3>
            <p className="mt-4 text-gray-600">
              Receive a daily set of 5 unique, AI-powered activities. From guided audio meditations to interactive readings and focus exercises, your plan is designed to build consistency and improve focus in just a few minutes each day.
            </p>
            <dl className="mt-6 space-y-4">
              <div className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <Check className="absolute left-1 top-1 h-5 w-5 text-blue-600" />
                  <span>AI-Powered.</span>
                </dt>
                <dd className="inline ml-2 text-gray-600">Engage with new content every day.</dd>
              </div>
              <div className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <Check className="absolute left-1 top-1 h-5 w-5 text-blue-600" />
                  <span>Gamified.</span>
                </dt>
                <dd className="inline ml-2 text-gray-600">Stay motivated by building your daily streak.</dd>
              </div>
            </dl>
          </div>
          <img
            src="/meditate.png"
            alt="A person meditating peacefully in a well-lit, serene room."
            className="rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}
