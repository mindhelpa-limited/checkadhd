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
        // Corrected to use 'observer' to unobserve, not 'entry'
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32 bg-[#0a122a] overflow-hidden">
      {/* Floating Glow Effects (consistent with other sections) */}
      <div className="absolute inset-0 -z-10 animate-float-container">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#A78BFA]/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full animate-float-slow" />
      </div>

      <div className={`max-w-7xl mx-auto px-6 lg:px-8 relative z-10 transform transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="relative isolate overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 sm:p-16 shadow-2xl rounded-3xl border border-white/10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Text and Button Section */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="font-serif mx-auto max-w-2xl text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Ready to Begin Your Transformation?
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/70">
              Your journey towards clarity and control starts with a single step.
              Choose your plan and unlock the tools you need to thrive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-10">
              <button
                onClick={() => router.push('/pricing')}
                className="glow-on-hover w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-10 rounded-full transition-all duration-300 shadow-xl"
              >
                View Plans →
              </button>
              <button
                onClick={() => router.push('/assessment')}
                className="border border-blue-400/30 text-blue-300 hover:bg-blue-400/10 text-lg font-semibold py-4 px-10 rounded-full transition-all duration-300"
              >
                Take the ADHD Test
              </button>
            </div>
          </div>
          
          {/* Animated SVG Section */}
          <div className="w-full lg:w-1/2 flex justify-center items-center h-full">
            <div className="relative w-full max-w-sm h-auto">
              <svg viewBox="0 0 200 200" className="w-full h-auto text-blue-500/20 animate-spin-slow">
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M100 100 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40 A60 60 0 1 1 40 100 A60 60 0 1 0 100 160 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40" fill="none" stroke="currentColor" strokeWidth="0.4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Floating Background Glows */
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

        /* Animated SVG Effects */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 80s linear infinite; transform-origin: center; }

        /* Glow on hover for button */
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
    </section>
  );
}