"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Features() {
  const router = useRouter();

  return (
    <section className="bg-[#0a122a] py-28 sm:py-36 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-32">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-5xl font-bold leading-tight tracking-tight text-white">
            A Clear Path to Clarity
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            You don’t just take a test. You begin a guided journey — built on
            science, refined by care, and shaped to fit the way your mind works.
          </p>
        </div>

        {/* Feature Block 1 */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="font-serif text-3xl font-bold text-white">
              Start with Understanding
            </h3>
            <p className="mt-4 text-gray-300">
              Our clinically-validated ADHD assessment isn’t just a label — it’s a
              mirror. Backed by ASRS and DSM-5 frameworks, it reveals patterns and
              gives you words for what you’ve been feeling.
            </p>
            <ul className="mt-6 space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✔</span>
                <div>
                  <strong className="text-white">Clinically Informed:</strong>
                  <br />
                  Developed with expert input and trusted screening tools.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✔</span>
                <div>
                  <strong className="text-white">Truly Personalized:</strong>
                  <br />
                  Tailored insights you can actually use in real life.
                </div>
              </li>
            </ul>
          </div>
          <img
            src="/images/start-understanding.jpg"
            alt="Therapist supporting a young man in a calm setting"
            className="rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-500"
          />
        </div>

        {/* Decorative Divider */}
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-28 h-auto text-blue-500/20"
            viewBox="0 0 200 200"
          >
            <path
              d="M100 100 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40 A60 60 0 1 1 40 100 A60 60 0 1 0 100 160"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Feature Block 2 */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <img
            src="/images/grow-guidance.jpg"
            alt="Young woman meditating in a serene flower garden"
            className="rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-500"
          />
          <div>
            <h3 className="font-serif text-3xl font-bold text-white">
              Grow with Guidance
            </h3>
            <p className="mt-4 text-gray-300">
              Based on your results, you’ll receive a daily recovery plan —
              brief, calming, and tailored. Whether it's mindfulness, structure,
              or focus tasks, your journey evolves with you.
            </p>
            <ul className="mt-6 space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✔</span>
                <div>
                  <strong className="text-white">AI-Powered Routine:</strong>
                  <br />
                  Dynamic tasks that adapt to your pace and goals.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✔</span>
                <div>
                  <strong className="text-white">Gamified Support:</strong>
                  <br />
                  Build streaks, earn clarity, and stay motivated long-term.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}