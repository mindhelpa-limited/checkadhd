"use client";
import Footer from "../../components/home/Footer";
import { CreditCard, UserPlus, CheckSquare, Plus, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image"; // Added Image import

// --- Step Component for the timeline ---
const Step = ({ number, title, children, isLast = false, imageSrc, imagePosition = 'right' }) => {
  const stepRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (stepRef.current) observer.observe(stepRef.current);
    return () => {
      if (stepRef.current) observer.unobserve(stepRef.current);
    };
  }, []);

  const contentOrder = imagePosition === 'right' ? 'md:order-1' : 'md:order-2';
  const imageOrder = imagePosition === 'right' ? 'md:order-2' : 'md:order-1';

  return (
    <div ref={stepRef} className={`grid md:grid-cols-2 items-center gap-16 md:gap-24 pb-16 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className={`flex items-start ${contentOrder}`}>
        <div className="flex flex-col items-center mr-6 md:mr-8 flex-shrink-0">
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full font-bold text-xl shadow-lg">
            {number}
          </div>
          {!isLast && <div className="w-px h-full bg-blue-500/20 mt-4"></div>}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 max-w-prose">{children}</p>
        </div>
      </div>
      <div className={`text-center ${imageOrder}`}>
        <Image
          src={imageSrc}
          alt={`Step ${number}: ${title}`}
          width={700}
          height={500}
          className="rounded-2xl shadow-xl border border-white/10 mx-auto w-full max-w-lg"
        />
      </div>
    </div>
  );
};

// --- FAQ Item Component ---
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 py-6">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium text-blue-200">{question}</span>
        <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex-shrink-0 transition-transform duration-300 transform hover:scale-110">
          <Plus className={`w-5 h-5 text-white transition-transform ${isOpen ? 'transform rotate-45' : ''}`} />
        </div>
      </button>
      {isOpen && (
        <div className="mt-4 text-white/70 animate-fadeIn">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

// --- Main How It Works Page Component ---
export default function HowItWorksPage() {
  return (
    <div className="bg-[#0a122a] text-white overflow-hidden">
      {/* --- Hero Section with Image --- */}
      <div className="relative bg-[#0a122a] py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 animate-float-container">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full animate-float-slow" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="md:col-span-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-serif text-left">
              A Clear Path to a Calmer Mind
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-300 text-left">
              Our process is designed to be simple, secure, and supportive, guiding you from payment to a personalized daily plan in just a few steps.
            </p>
          </div>
          <div className="md:col-span-1 text-center">
            <Image
              src="/images/work-one.png"
              alt="An abstract image representing a clear path"
              width={700}
              height={500}
              className="rounded-2xl shadow-xl mx-auto w-full max-w-md md:max-w-none"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
      </div>

      {/* --- Step-by-Step Timeline Section --- */}
      <div className="py-24 bg-[#0a122a] relative">
        <div className="absolute inset-0 -z-10 animate-float-container">
          <div className="absolute top-[30%] left-[10%] w-[400px] h-[400px] bg-purple-400/15 blur-[100px] rounded-full animate-float-slow" />
          <div className="absolute bottom-[20%] right-[15%] w-[300px] h-[300px] bg-cyan-400/10 blur-[80px] rounded-full animate-float" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="relative">
            <Step 
              number="1" 
              title="Choose Your Plan & Subscribe" 
              imageSrc="/images/work-two.png"
              imagePosition="left"
            >
              Begin by selecting our premium plan on the pricing page. You'll be securely redirected to our payment partner, Stripe, to complete your subscription. This is your commitment to begin the journey.
            </Step>

            <Step 
              number="2" 
              title="Create Your Secure Account" 
              imageSrc="/images/work-three.png"
              imagePosition="right"
            >
              After your payment is successful, you'll be guided back to our site to create your private account. This step links your new subscription to your profile, ensuring your access to all premium features.
            </Step>

            <Step 
              number="3" 
              title="Begin Your Daily Recovery" 
              imageSrc="/images/work-four.png"
              isLast={true}
              imagePosition="left"
            >
              With your account created, you'll immediately access the dashboard. Here, you'll take the initial ADHD assessment, which unlocks your personalized daily plan of AI-powered activities designed to build consistency and improve focus.
            </Step>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
      </div>

      {/* --- FAQ Section --- */}
      <div className="bg-[#0a122a] py-20 relative">
        <div className="absolute inset-0 -z-10 animate-float-container">
          <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-purple-400/10 blur-[100px] rounded-full animate-float-slow" />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-white font-serif">Your Questions, Answered</h2>
          <div className="space-y-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 sm:p-12 rounded-3xl shadow-2xl border border-white/10">
            <FaqItem question="What happens right after I pay?" answer="Immediately after your payment is confirmed by Stripe, you will be automatically redirected to our secure sign-up page. Here, you'll create your account, which will be instantly recognized as a premium account." />
            <FaqItem question="Is my payment information secure?" answer="Yes, 100%. We partner with Stripe, a global leader in online payments, to handle all billing. Your payment details are never stored on our servers, ensuring the highest level of security." />
            <FaqItem question="Can I cancel my subscription at any time?" answer="Absolutely. You have full control over your subscription. You can easily manage or cancel your plan at any time through your profile page, with no hidden fees or long-term contracts." />
            <FaqItem question="Why do I need to create an account after paying?" answer="This flow ensures that your premium subscription is securely linked to a unique user account that only you can access. It's the most secure way to manage user subscriptions and data privacy." />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
      </div>

      {/* --- CTA Section --- */}
      <div className="bg-[#0a122a] py-20 relative">
        <div className="absolute inset-0 -z-10 animate-float-container">
          <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-cyan-400/10 blur-[100px] rounded-full animate-float" />
          <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] bg-blue-400/15 blur-[80px] rounded-full animate-float-slow" />
        </div>
        <div className="max-w-4xl mx-auto text-center py-20 px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-serif">
            Ready to Begin Your Transformation?
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Your journey towards clarity and control starts with a single step.
          </p>
          <a
            href="/pricing"
            className="mt-8 inline-block bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 glow-on-hover"
          >
            View Plans & Get Started
          </a>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-px">
          <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
      </div>
      <Footer />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        
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

        .glow-on-hover {
          position: relative;
          z-index: 0;
        }
        .glow-on-hover:before {
          content: '';
          position: absolute;
          top: -2px; left: -2px;
          right: -2px; bottom: -2px;
          border-radius: 9999px;
          background: linear-gradient(45deg, #3b82f6, #2563eb, #1d4ed8);
          background-size: 400%;
          z-index: -1;
          filter: blur(6px);
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        .glow-on-hover:hover:before {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}