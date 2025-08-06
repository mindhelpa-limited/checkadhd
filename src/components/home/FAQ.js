"use client";
import { useState, useRef, useEffect } from "react";
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
        <span className="text-lg font-semibold text-blue-200">{faq.question}</span>
        <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex-shrink-0 transition-transform duration-300 transform hover:scale-110">
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
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0a122a] py-24 sm:py-32 overflow-hidden">
      {/* Floating Glow Effects */}
      <div className="absolute inset-0 -z-10 animate-float-container">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#A78BFA]/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full animate-float-slow" />
      </div>

      <div className={`max-w-4xl mx-auto px-6 lg:px-8 relative z-10 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl font-bold text-white pulsing-heading">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
            Find quick answers to common questions about our platform, the
            assessment, and the recovery program.
          </p>
        </div>

        <div className="space-y-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-2xl border border-white/10">
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
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; text-shadow: 0 0 15px rgba(255, 255, 255, 0.6); }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulsing-heading { animation: pulse 2.5s infinite ease-in-out; }

        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-10px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-slow {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
          100% { transform: translate(0, 0); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
      `}</style>
    </section>
  );
}