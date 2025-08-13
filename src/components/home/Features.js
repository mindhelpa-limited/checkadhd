"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Features() {
  const router = useRouter();

  return (
    <section className="bg-[#0a122a] py-28 sm:py-36 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-white">
            A Clear Path to Clarity
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            You don’t just take a test. You begin a guided journey — built on
            science, refined by care, and shaped to fit the way your mind works.
          </p>
        </div>

        {/* Feature Block 2 (now updated for the new games and therapy) */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mt-0">
          <img
            src="/images/grow-guidance.jpg"
            alt="Young woman meditating in a serene flower garden"
            className="rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-500"
          />
          <div>
            <h3 className="font-serif text-3xl font-bold text-white">
              Gamified Recovery: Find Your Flow
            </h3>
            <p className="mt-4 text-gray-300">
              Transform your daily recovery with our structured 30-minute session. Each day, you'll engage in a series of focus-building activities designed to boost your concentration and provide a rewarding experience.
            </p>
            <ul className="mt-6 space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✔</span>
                <div>
                  <strong className="text-white">Structured Daily Session:</strong>
                  <br />
                  A 30-minute routine with meditation, gaming, and breaks for rehydration and exercise.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✔</span>
                <div>
                  <strong className="text-white">Engaging Games:</strong>
                  <br />
                  Dive into **MoneyStack**, a captivating stacking game reminiscent of Tetris; slither your way to rewards in **Snake**, collecting credits as you grow; or enjoy the fast-paced action of **PingPong**.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✔</span>
                <div>
                  <strong className="text-white">Healing Sounds:</strong>
                  <br />
                  Access a library of **Afrotherapy music and healing sounds** for calm and focus anytime.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature Block 1 (remains the same) */}
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

      </div>

      {/* Manual Divider added here */}
      <div className="absolute bottom-0 left-0 w-full h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>
    </section>
  );
}