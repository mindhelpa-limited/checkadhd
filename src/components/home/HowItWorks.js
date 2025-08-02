"use client";
import { CreditCard, UserPlus, CheckSquare } from "lucide-react";

// --- Step Component for the timeline ---
const Step = ({ icon, number, title, children, isLast = false }) => (
  <div className="flex">
    <div className="flex flex-col items-center mr-6 md:mr-8">
      <div className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full font-bold text-xl shadow-lg">
        {number}
      </div>
      {!isLast && <div className="w-px h-full bg-gray-300 mt-4"></div>}
    </div>
    <div className={`pb-12 ${isLast ? '' : 'md:pb-20'}`}>
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4 shadow-sm">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 max-w-prose">{children}</p>
    </div>
  </div>
);


// --- Main How It Works Component ---
export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-base font-semibold leading-7 text-blue-600">A CLEAR PATH FORWARD</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                How It Works
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
                We've designed a simple, secure, and supportive process to guide you from where you are to where you want to be.
            </p>
        </div>

        <div className="max-w-3xl mx-auto">
            <Step number="1" icon={<CreditCard size={28} />} title="Subscribe & Sign Up">
              Choose your plan on our pricing page and pay securely with Stripe. After payment, you'll be guided to create your private account, which will be automatically upgraded to premium.
            </Step>

            <Step number="2" icon={<CheckSquare size={28} />} title="Take the Assessment">
              Once your account is created, you'll take our comprehensive, clinically-informed test. This establishes your personal baseline and unlocks your personalized recovery plan.
            </Step>

            <Step number="3" icon={<UserPlus size={28} />} title="Begin Your Daily Recovery" isLast={true}>
              Access your dashboard and start your daily plan of 5 unique, AI-powered activities. Track your progress, build your streak, and work towards a more focused life.
            </Step>
        </div>
      </div>
    </section>
  );
}
