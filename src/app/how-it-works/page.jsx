"use client";
import Footer from "../../components/home/Footer";
import { CreditCard, UserPlus, CheckSquare, Plus, ArrowRight } from "lucide-react";
import { useState } from "react";
// --- Step Component for the timeline ---
const Step = ({ icon, number, title, children, isLast = false }) => (
  <div className="flex">
    <div className="flex flex-col items-center mr-6 md:mr-8">
      <div className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full font-bold text-xl shadow-lg">
        {number}
      </div>
      {!isLast && <div className="w-px h-full bg-gray-300 mt-4"></div>}
    </div>
    <div className={`pb-16 ${isLast ? '' : 'md:pb-24'}`}>
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4 shadow-sm">{icon}</div>
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 max-w-prose">{children}</p>
    </div>
  </div>
);

// --- FAQ Item Component ---
const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-6">
            <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-800">{question}</span>
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                    <Plus className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'transform rotate-45' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="mt-4 text-gray-600 animate-fadeIn">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

// --- Main How It Works Page Component ---
export default function HowItWorksPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* --- Hero Section --- */}
      <div className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto py-24 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            A Clear Path to a Calmer Mind
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Our process is designed to be simple, secure, and supportive, guiding you from payment to a personalized daily plan in just a few steps.
          </p>
        </div>
      </div>

      {/* --- Step-by-Step Timeline Section --- */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            <Step number="1" icon={<CreditCard size={28} />} title="Choose Your Plan & Subscribe">
              Begin by selecting our premium plan on the pricing page. You'll be securely redirected to our payment partner, Stripe, to complete your subscription. This is your commitment to begin the journey.
            </Step>

            <Step number="2" icon={<UserPlus size={28} />} title="Create Your Secure Account">
              After your payment is successful, you'll be guided back to our site to create your private account. This step links your new subscription to your profile, ensuring your access to all premium features.
            </Step>

            <Step number="3" icon={<CheckSquare size={28} />} title="Begin Your Daily Recovery" isLast={true}>
              With your account created, you'll immediately access the dashboard. Here, you'll take the initial ADHD assessment, which unlocks your personalized daily plan of AI-powered activities designed to build consistency and improve focus.
            </Step>
          </div>
        </div>
      </div>

      {/* --- FAQ Section --- */}
      <div className="bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Your Questions, Answered</h2>
              <div className="space-y-2">
                  <FaqItem question="What happens right after I pay?" answer="Immediately after your payment is confirmed by Stripe, you will be automatically redirected to our secure sign-up page. Here, you'll create your account, which will be instantly recognized as a premium account." />
                  <FaqItem question="Is my payment information secure?" answer="Yes, 100%. We partner with Stripe, a global leader in online payments, to handle all billing. Your payment details are never stored on our servers, ensuring the highest level of security." />
                  <FaqItem question="Can I cancel my subscription at any time?" answer="Absolutely. You have full control over your subscription. You can easily manage or cancel your plan at any time through your profile page, with no hidden fees or long-term contracts." />
                   <FaqItem question="Why do I need to create an account after paying?" answer="This flow ensures that your premium subscription is securely linked to a unique user account that only you can access. It's the most secure way to manage user subscriptions and data privacy." />
              </div>
          </div>
      </div>

      {/* --- CTA Section --- */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto text-center py-20 px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Ready to Begin Your Transformation?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Your journey towards clarity and control starts with a single step.
          </p>
          <a href="/pricing" className="mt-8 inline-block bg-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            View Plans & Get Started
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
