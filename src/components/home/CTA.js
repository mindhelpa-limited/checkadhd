"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function CTA() {
  const router = useRouter();
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
        observer.unobserve(entry.target);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 bg-[#0a122a] overflow-hidden">
      {/* Floating Glow Effects */}
      <div className="absolute inset-0 -z-10 animate-float-container">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#A78BFA]/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full animate-float-slow" />
      </div>

      <div className={`max-w-7xl mx-auto px-6 lg:px-8 relative z-10 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 sm:p-16 shadow-2xl rounded-3xl border border-white/10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Standalone Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
            <Image
              src="/images/cta.png"
              alt="An abstract representation of a journey towards mental clarity and focus"
              width={500}
              height={400}
              className="w-full max-w-sm lg:max-w-none h-auto object-contain animate-image-float-pulse"
            />
          </div>

          {/* Text and Button Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="font-serif mx-auto max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl breathing-heading">
              <span className="relative inline-block cta-circle-draw">
                Ready to Begin Your Transformation?
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70">
              Your journey towards clarity and control starts with a single step.
              Choose your plan and unlock the tools you need to thrive.
            </p>

            <div className="mt-10">
              <button
                onClick={() => router.push("/pricing")}
                className="w-full sm:w-auto text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 breathing-button"
              >
                View Plans & Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* Applies the continuous circling animation to the heading's pseudo-element */
        .cta-circle-draw {
            position: relative;
        }
        .cta-circle-draw::after {
          content: '';
          position: absolute;
          top: -0.5rem;
          left: -1rem;
          right: -1rem;
          bottom: -0.5rem;
          border: 2px solid rgba(167, 139, 250, 0.4);
          border-radius: 50%;
          z-index: -1;
          background: transparent;
          animation: drawCircle 8s linear infinite;
        }

        @keyframes drawCircle {
          0% {
            transform: rotate(0deg);
            clip-path: polygon(50% 50%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 50%);
          }
          25% {
            transform: rotate(0deg);
            clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%);
          }
          50% {
            transform: rotate(180deg);
            clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%);
          }
          100% {
            transform: rotate(360deg);
            clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%);
          }
        }
        

        @keyframes breathing-effect {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.4));
          }
          50% {
            transform: scale(1.02);
            filter: drop-shadow(0 0 10px rgba(109, 40, 217, 0.6));
          }
        }
        .breathing-heading {
          animation: breathing-effect 5s infinite ease-in-out;
        }
        .breathing-button {
          background-image: linear-gradient(90deg, #3B82F6, #6D28D9, #3B82F6);
          background-size: 200% auto;
          transition: background-position 0.5s ease-in-out;
          animation: breathing-effect 5s infinite ease-in-out; 
        }
        .breathing-button:hover {
          animation: pulse-button-bg 1s infinite linear;
        }
        @keyframes pulse-button-bg {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
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
        @keyframes image-float-pulse {
          0% {
            transform: translateY(0px) scale(0.98);
            filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.4));
          }
          50% {
            transform: translateY(-8px) scale(1);
            filter: drop-shadow(0 0 15px rgba(109, 40, 217, 0.6));
          }
          100% {
            transform: translateY(0px) scale(0.98);
            filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.4));
          }
        }
        .animate-image-float-pulse {
          animation: image-float-pulse 4s infinite ease-in-out;
        }
      `}</style>
    </section>
  );
}