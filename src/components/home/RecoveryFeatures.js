"use client";
import { Check } from "lucide-react";
import Image from "next/image";

export default function UnderstandingSection() {
  return (
    <section className="bg-[#0a122a] py-24 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Image - NOW order-1 on mobile */}
          <div className="order-1 lg:order-1">
            <Image
              src="/images/meditating-girl.png" // You'll need to save the image here
              alt="A person meditating, surrounded by flowers"
              width={700}
              height={500}
              className="rounded-3xl shadow-2xl w-full max-w-lg lg:max-w-none mx-auto"
            />
          </div>
          
          {/* Right Side: Text Content - NOW order-2 on mobile */}
          <div className="order-2 lg:order-2">
            <div className="bg-[#101b3d] p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
              <p className="font-sans text-blue-300 uppercase text-sm tracking-widest">
                Gamified Support: Build streaks, earn clarity, and stay motivated long-term.
              </p>
              
              <h2 className="font-sans text-4xl font-semibold leading-tight tracking-tight">
                Start with Understanding
              </h2>
              
              <p className="font-sans text-lg text-gray-300">
                Our clinically-validated ADHD assessment isn’t just a label — it’s a mirror. Backed by ASRS and DSM-5 frameworks, it reveals patterns and gives you words for what you’ve been feeling.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="flex-shrink-0 w-6 h-6 text-green-400 mt-1 mr-3" />
                  <span className="font-sans text-lg text-gray-300">
                    <span className="font-medium text-white">Clinically Informed:</span> Developed with expert input and trusted screening tools.
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="flex-shrink-0 w-6 h-6 text-green-400 mt-1 mr-3" />
                  <span className="font-sans text-lg text-gray-300">
                    <span className="font-medium text-white">Truly Personalized:</span> Tailored insights you can actually use in real life.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}