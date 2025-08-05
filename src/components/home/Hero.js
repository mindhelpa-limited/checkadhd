// src/components/Hero.js
"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative h-screen flex items-center justify-center text-center text-ivory-800 overflow-hidden bg-soft-ivory">
      {/* High-quality, serene image as background */}
      <img
        src="https://images.unsplash.com/photo-1517486804561-1c39058b8f52?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
        alt="A serene landscape with soft light, representing clarity and calm."
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      
      {/* Subtle overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-soft-ivory/80 to-transparent"></div>
      
      <div className="relative z-10 px-4 animate-fadeInUp max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter leading-tight text-charcoal">
          Find Your Calm. Reclaim Your Focus.
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-charcoal/80">
          A personalized path to managing ADHD, built on science and designed for a more tranquil life.
        </p>
        <button
          onClick={() => router.push('/pricing')}
          className="mt-10 bg-slate-blue text-soft-ivory font-bold py-4 px-10 rounded-full text-lg shadow-xl hover:bg-slate-blue/90 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center mx-auto"
        >
          Start Your Journey
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
}