"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image"; // Added Image import

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-[calc(100vh-72px)] bg-[#0a122a] text-white flex items-center justify-center px-6 sm:px-10 overflow-hidden">

      {/* Radial gradient background with subtle animated light glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a122a] via-[#101b3d] to-[#0a122a]" />
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-400/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full animate-float-slow" />
      </div>

      {/* Spiral from previous design */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 z-10">
        <svg viewBox="0 0 200 200" className="w-[80vw] max-w-md h-auto text-blue-500/20 animate-spin-slow">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100 100 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40 A60 60 0 1 1 40 100 A60 60 0 1 0 100 160 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40" fill="none" stroke="currentColor" strokeWidth="0.4" />
        </svg>
      </div>

      {/* Hero Grid */}
      <div className="relative z-20 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-24">

        {/* Left Side: Text */}
        <div className="text-left px-4 sm:px-0 space-y-8 animate-fade-in-up">
          <p className="font-sans text-blue-300 uppercase text-sm tracking-widest">ADHD support made human</p>

          <h1 className="font-sans text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
            Focus isn’t lost. <br />
            It’s waiting to be found — <span className="text-blue-400">your way.</span>
          </h1>

          <p className="font-sans text-base sm:text-lg text-gray-300 font-normal leading-relaxed">
            We don’t fix minds. We help you understand yours — deeply, compassionately, and with tools made just for ADHD.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => router.push("/assessment")}
              className="relative group inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-4 px-10 rounded-full shadow-xl transition-all duration-300"
            >
              <span className="mr-2">Start Your Journey</span>
              <ArrowRight size={20} />
              <span className="absolute -inset-px rounded-full group-hover:ring-2 group-hover:ring-blue-400 transition-all duration-300"></span>
            </button>

            <button
              onClick={() => router.push("/pricing")}
              className="text-blue-300 hover:text-blue-200 border border-blue-400/30 hover:bg-blue-400/10 text-lg font-medium py-4 px-10 rounded-full transition-all duration-300"
            >
              Explore Options
            </button>
          </div>
        </div>

        {/* Right Side: Brain Image */}
        <div className="flex justify-center animate-float">
          <Image
            src="/images/brain-glow.png"
            alt="animated brain"
            width={400}
            height={400}
            className="w-[300px] sm:w-[350px] md:w-[400px] opacity-90"
          />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-blue-400/50 animate-bounce z-30">
        ↓ Scroll to learn more
      </div>

      {/* Animations */}
      <style jsx global>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-spin-slow {
          animation: spin 100s linear infinite;
          transform-origin: center;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0); }
        }
      `}</style>
      <div className="absolute bottom-0 left-0 w-full h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>
    </section>
  );
}