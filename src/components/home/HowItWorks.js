"use client";
import Image from "next/image";
import { UserPlus, CheckCircle, Sparkles } from "lucide-react";

const Step = ({ number, icon, title, tagline, content, image }) => (
  <div className="flex flex-col lg:flex-row gap-12 group items-start">
    {/* Left: Icon + Text */}
    <div className="flex-1">
      <div className="flex items-center gap-4 mb-3">
        <div className="bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-400/30 p-3 rounded-full shadow-lg text-blue-200">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm italic text-blue-300 mb-2">{tagline}</p>
      <p className="text-gray-300 leading-relaxed max-w-prose">{content}</p>
    </div>

    {/* Right: Image */}
    <div className="w-full lg:w-[380px] shrink-0">
      <Image
        src={`/images/${image}`}
        alt={title}
        width={380}
        height={380}
        className="rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500"
      />
    </div>
  </div>
);

export default function HowItWorks() {
  return (
    <section className="py-28 sm:py-36 bg-[#0a122a] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <p className="text-blue-400 font-semibold tracking-wide uppercase">How It Works</p>
          <h2 className="mt-4 text-4xl sm:text-5xl font-serif font-bold">Simplicity. Safety. Support.</h2>
          <p className="mt-6 text-lg text-gray-300">
            We designed this experience to be more than a platform — it's a process. Gentle. Guided. Grounded in science and made for your peace of mind.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24 animate-fade-in-up">
          <Step
            number="1"
            icon={<UserPlus size={28} />}
            title="Step Into a Safe, Private Space"
            tagline="A place that’s just for you — peaceful, private, yours."
            content="Begin by choosing your plan and opening your private wellness account. No distractions. Just your journey, your pace."
            image="safe-space.png"
          />
          <Step
            number="2"
            icon={<CheckCircle size={28} />}
            title="Understand Yourself Deeply"
            tagline="This isn’t just data — it’s your story, made visible."
            content="Take a clinically-informed ADHD assessment rooted in DSM-5 and ASRS frameworks. You'll gain insights, clarity, and a powerful baseline."
            image="adhd-assessment.png"
          />
          <Step
            number="3"
            icon={<Sparkles size={28} />}
            title="Start Your Daily Flow"
            tagline="Clarity builds from consistency — one moment at a time."
            content="Access your dashboard and start your personalized daily routine — 5 short, intentional, AI-guided activities to build focus, calm, and consistency."
            image="daily-routine.png"
          />
        </div>
      </div>

      {/* Animation (non-global) */}
      <style jsx>{`
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

        .animate-fade-in-up {
          animation: fadeInUp 1.2s ease-out both;
        }
      `}</style>
    </section>
  );
}