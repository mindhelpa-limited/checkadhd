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

const FaqItem = ({ faq, index, openIndex, setOpenIndex }) => {
  const isOpen = index === openIndex;

  return (
    <div className="border-b border-white/10 py-6">
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="text-lg font-semibold text-white">{faq.question}</span>
        <div className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full flex-shrink-0">
          <Plus
            className={`w-5 h-5 text-white transition-transform duration-300 ${
              isOpen ? "rotate-45" : ""
            }`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 mt-4" : "max-h-0"
        }`}
      >
        <p className="text-white/70 pr-8 text-base">{faq.answer}</p>
      </div>
    </div>
  );
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-[#0a122a] py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Find quick answers to common questions about our platform, the
            assessment, and the recovery program.
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