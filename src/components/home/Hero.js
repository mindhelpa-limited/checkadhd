"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-[calc(100vh-72px)] bg-[#0a122a] text-white flex items-center justify-center px-6 sm:px-10 overflow-hidden">

      {/* Background: Calm abstract blur image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1400&q=80"
          alt="calm blurred background"
          className="w-full h-full object-cover opacity-5 blur-sm"
        />
      </div>

      {/* Optional: glowing gradient shape */}
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-500 rounded-full blur-3xl opacity-20 z-0" />

      {/* Spiral visual */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 z-10">
        <svg viewBox="0 0 200 200" className="w-[80vw] max-w-md h-auto text-blue-500/20 animate-spin-slow">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path
            d="M100 100 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40 A60 60 0 1 1 40 100 A60 60 0 1 0 100 160 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.4"
          />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-20 max-w-4xl text-center space-y-8 pt-20 pb-28 animate-fade-in-up">

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Focus isn’t lost. <br />
          It’s waiting to be found — <span className="text-blue-400 underline underline-offset-4 animate-pop">your way.</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
          We don’t fix minds. We help you understand yours — deeply, compassionately, and with tools made just for ADHD.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
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

      {/* Animation */}
      <style jsx global>{`
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-spin-slow {
          animation: spin 100s linear infinite;
          transform-origin: center;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-pop {
          animation: popIn 0.8s ease-out;
        }
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
