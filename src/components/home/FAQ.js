"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "What does the £15/month plan include?",
    answer:
      "Your subscription includes the full ADHD assessment, a personalized recovery dashboard, daily AI-powered meditations, affirmations, exercises, cognitive care tracking, and progress monitoring with our gamified streak system.",
  },
  {
    question: "Is the ADHD assessment a clinical diagnosis?",
    answer:
      "No. Our assessment is an evidence-based tool designed to provide helpful insights and a strong baseline, but it does not replace a clinical diagnosis from a qualified healthcare provider. You can, however, share your results with your doctor.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, absolutely. You can cancel your subscription at any time directly from your account profile. You will retain access to all premium features until the end of your current billing cycle.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We prioritize your privacy and security. We use industry‑standard encryption and best practices to ensure your personal information and assessment results remain private and protected at all times.",
  },
];

// --- FAQ Item Component with smooth animation ---
const FaqItem = ({ faq, index, openIndex, setOpenIndex }) => {
    const isOpen = index === openIndex;

    return (
        <div className="border-b border-gray-200 py-6">
            <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center text-left"
            >
                <span className="text-lg font-medium text-gray-800">{faq.question}</span>
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full flex-shrink-0">
                    <Plus className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isOpen ? 'transform rotate-45' : ''}`} />
                </div>
            </button>
            <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
            >
                <p className="text-gray-600 pr-8">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
};


// --- Main FAQ Component ---
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Find quick answers to common questions about our platform, the assessment, and the recovery program.
            </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FaqItem 
                key={index} 
                faq={faq} 
                index={index} 
                openIndex={openIndex} 
                setOpenIndex={setOpenIndex} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
