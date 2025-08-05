"use client";

import { useRouter } from 'next/navigation';

export default function CTA() {
  const router = useRouter();
  
  return (
    <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="relative isolate overflow-hidden bg-calm-blue px-6 py-24 text-center shadow-2xl sm:rounded-4xl sm:px-16">
                <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-focus-gold/20 blur-3xl"></div>
                <h2 className="font-serif mx-auto max-w-2xl text-4xl font-medium tracking-tight text-white sm:text-5xl">
                    Ready to Begin Your Transformation?
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80">
                    Your journey towards clarity and control starts with a single step. Choose your plan and unlock the tools you need to thrive.
                </p>
                <div className="mt-10">
                    <button onClick={() => router.push('/pricing')} className="bg-focus-gold text-white font-sans font-semibold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105">
                        View Plans & Get Started
                    </button>
                </div>
            </div>
        </div>
    </section>
  );
};