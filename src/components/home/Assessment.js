"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// Reusable list item component for cleaner code
const FeatureListItem = ({ title, content }) => {
  const itemRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (itemRef.current) {
      observer.observe(itemRef.current);
    }
    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  return (
    <li
      ref={itemRef}
      className={`flex items-start gap-4 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
    >
      <CheckCircle className={`text-green-400 w-6 h-6 mt-1 flex-shrink-0 ${isVisible ? 'animate-bounce-in' : ''}`} />
      <div>
        <h4 className="font-semibold text-white text-lg">{title}</h4>
        <p className="text-gray-400 text-base leading-relaxed">{content}</p>
      </div>
    </li>
  );
};

export default function Assessment() {
  const router = useRouter();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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
    <section
      ref={sectionRef}
      className="relative bg-[#0a122a] text-white py-28 sm:py-36 overflow-hidden"
    >
      {/* Dynamic Glow Effects (Updated to Blue) */}
      <div className="absolute inset-0 -z-10 animate-float-container">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full animate-float-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Image with ambient glow */}
          <div className={`w-full h-full transform transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10">
              <Image
                src="/images/how-it-works.png"
                alt="Image representing how the platform works"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0a122a]/70 to-transparent" />
            </div>
          </div>

          {/* Right: Content */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-blue-400 font-semibold tracking-widest uppercase mb-2">
              The First Step
            </p>

            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Understand What Your Mind Has Been Trying to Tell You
            </h2>

            <p className="mt-6 text-lg text-gray-300 max-w-prose">
              This isn’t just a quiz. It’s a clinically grounded experience designed to mirror your
              thoughts back to you — clearly, gently, and without judgment. Our ASRS + DSM-5 based
              system gives you a reliable, empowering insight into your cognitive patterns.
            </p>

            <ul className="mt-8 space-y-5">
              <FeatureListItem
                title="Clinically-Informed"
                content="Developed using trusted mental health screening protocols — no pseudoscience."
              />
              <FeatureListItem
                title="Truly Personalized"
                content="Your result becomes the foundation for everything we guide you through next."
              />
            </ul>

            <button
              onClick={() => router.push("/assessment")}
              className="mt-10 inline-block text-white font-semibold text-lg py-4 px-10 rounded-full shadow-lg transition-all transform hover:scale-105 button-gradient"
            >
              Take the Free Snippet
            </button>
          </div>
        </div>
      </div>

      {/* Manual Divider added here */}
      <div className="absolute bottom-0 left-0 w-full h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>

      {/* Animation Styles (Updated Button Gradient) */}
      <style jsx>{`
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          80% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        @keyframes pulse-gradient {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .button-gradient {
          background-image: linear-gradient(135deg, #3B82F6, #1D4ED8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .button-gradient:hover {
          animation: pulse-gradient 1.5s infinite ease-in-out;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }

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