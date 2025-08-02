"use client";
import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import Footer from "../../components/home/Footer";
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

// --- Main FAQ Page Component (Rewritten as an arrow function) ---
const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

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

  return (
    <div className="bg-white text-gray-800">
      {/* --- Hero Section with Background Image --- */}
      <div className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2940&auto=format&fit=crop" 
                alt="A supportive and professional help center environment" 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 px-4 animate-fadeInUp">
          <p className="text-base font-semibold leading-7 text-gray-200">HELP CENTER</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Answers to Your Questions
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            We've compiled answers to the most common questions about our platform, assessment, and subscription.
          </p>
        </div>
      </div>

      {/* --- FAQ & Image Section --- */}
      <div className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: FAQ Items */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked</h2>
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

          {/* Right Side: Image */}
          <div className="lg:mt-12">
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=3132&auto=format&fit=crop"
              alt="A group of people collaborating and finding answers together."
              className="rounded-2xl shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* --- CTA Section --- */}
      <div className="bg-gray-50">
        <div className="max-w-4xl mx-auto text-center py-20 px-4">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Still Have Questions?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our support team is here to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
          <a href="/contact" className="mt-8 inline-block bg-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105">
            Contact Us <ArrowRight className="inline w-5 h-5 ml-2" />
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FaqPage;
