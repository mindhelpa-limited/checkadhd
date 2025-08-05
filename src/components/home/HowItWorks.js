"use client";
import { UserPlus, CheckSquare, Sparkles } from "lucide-react";

// Step Component
const Step = ({ icon, number, title, children }) => (
  <div className="flex items-start space-x-6">
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center justify-center w-12 h-12 bg-primary-light text-primary font-bold text-xl rounded-full">
        {number}
      </div>
      <div className="w-px h-full bg-primary-light min-h-[8rem]"></div>
    </div>
    <div className="pt-2">
      <div className="flex items-center mb-3 space-x-4">
        <div className="bg-accent-light text-accent p-3 rounded-full">{icon}</div>
        <h3 className="text-2xl font-semibold text-primary-dark">{title}</h3>
      </div>
      <p className="text-text-muted leading-relaxed max-w-prose">{children}</p>
    </div>
  </div>
);

// Main Component
export default function HowItWorks() {
  return (
    <section className="py-24 sm:py-32 bg-primary-light/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary font-semibold leading-7">A CLEAR PATH FORWARD</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-primary-dark sm:text-5xl">
            Your Journey in 3 Steps
          </h2>
          <p className="mt-6 text-lg leading-8 text-text-muted">
            We've designed a simple, secure, and supportive process to guide you from where you are to where you want to be.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="space-y-0">
            <Step number="1" icon={<UserPlus size={28} />} title="Sign Up & Subscribe">
              Choose your plan and create your private account. Your access will be instantly and securely upgraded.
            </Step>
            <Step number="2" icon={<CheckSquare size={28} />} title="Take the Assessment">
              Complete our comprehensive, clinically-informed test to establish your personal baseline and unlock your plan.
            </Step>
            <Step number="3" icon={<Sparkles size={28} />} title="Begin Your Daily Plan">
              Access your dashboard and start with 5 unique, AI-powered activities. Track your progress and build momentum.
            </Step>
          </div>
        </div>
      </div>
    </section>
  );
}