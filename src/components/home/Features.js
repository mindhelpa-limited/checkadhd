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

        {/* Feature Block 2 (updated for Recovery Tools instead of Games) */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mt-0">
          <img
            src="/images/grow-guidance.jpg"
            alt="Person writing in a journal as part of recovery"
            className="rounded-3xl shadow-xl hover:scale-[1.02] transition-transform duration-500"
          />
          <div>
            <h3 className="font-serif text-3xl font-bold text-white">
              Recovery That Fits Your Life
            </h3>
            <p className="mt-4 text-gray-300">
              Move beyond testing into tools that help you heal, grow, and stay
              consistent. Designed with ADHD recovery in mind, these supports
              keep you grounded while guiding your progress.
            </p>
            <ul className="mt-6 space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✔</span>
                <div>
                  <strong className="text-white">Goal Tracker:</strong>
                  <br />
                  Set, track, and celebrate your daily and weekly milestones with
                  a clear sense of progress.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✔</span>
                <div>
                  <strong className="text-white">Recovery Tools:</strong>
                  <br />
                  Journaling, focus practices, and structured exercises built to
                  support your attention and wellbeing.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 mt-1">✔</span>
                <div>
                  <strong className="text-white">One-on-One Coaching:</strong>
                  <br />
                  Personalized guidance from a coach who helps you apply your
                  insights into real-life strategies.
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

      {/* Manual Divider */}
      <div className="absolute bottom-0 left-0 w-full h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>
    </section>
  );
}
