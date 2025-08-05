"use client";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-72px)] bg-[#0a122a] text-white overflow-hidden px-4 sm:px-8">
      
      {/* Background visual layer with subtle human texture */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1400&q=80"
          alt="Thoughtful person background"
          className="w-full h-full object-cover object-center grayscale blur-sm"
        />
      </div>

      {/* Animated SVG spiral overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-[80vw] max-w-md h-auto text-blue-500/20 animate-spin-slow"
        >
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100 100 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40 A60 60 0 1 1 40 100 A60 60 0 1 0 100 160 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40" 
            fill="none" stroke="currentColor" strokeWidth="0.4" className="stroke-blue-400/20"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center max-w-4xl mx-auto space-y-8 pt-16 pb-28 animate-fade-in-up">
        
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
          Focus isn’t lost. <br />It’s waiting to be found — <span className="text-blue-400">your way.</span>
        </h1>

        <p className="font-sans text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
          We don’t fix minds. We help you understand yours — deeply, compassionately, and with tools made just for ADHD.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => router.push('/assessment')}
            className="glow-on-hover w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-10 rounded-full transition-all duration-300 shadow-xl"
          >
            Start Your Journey →
          </button>
          <button
            onClick={() => router.push('/pricing')}
            className="border border-blue-400/30 text-blue-300 hover:bg-blue-400/10 text-lg font-semibold py-4 px-10 rounded-full transition-all duration-300"
          >
            Explore Options
          </button>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
          animation: spin 80s linear infinite;
          transform-origin: center;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
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