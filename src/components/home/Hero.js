"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-[calc(100vh-72px)] bg-[#0a122a] text-white flex items-center justify-center px-6 sm:px-10 overflow-hidden">

      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-new.png"
          alt="A person meditating, symbolizing focus and calm"
          fill
          className="object-cover object-center opacity-30"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a122a] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a122a] to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl text-center space-y-8 py-24 px-4 sm:px-0 animate-fade-in-up">
        
        <p className="font-sans text-blue-300 uppercase text-sm tracking-widest font-semibold">ADHD support made human</p>

        <h1 className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Focus isn’t lost. <br className="hidden sm:block" />
          It’s waiting to be found — <span className="text-blue-400">your way.</span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl mx-auto">
          We don’t fix minds. We help you understand yours — deeply, compassionately, and with tools made just for ADHD.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
          <button
            onClick={() => router.push("/assessment")}
            className="relative group inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-10 rounded-full shadow-xl transition-all duration-300"
          >
            <span className="mr-2">Start Your Journey</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
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

        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
      <div className="absolute bottom-0 left-0 w-full h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>
    </section>
  );
}
