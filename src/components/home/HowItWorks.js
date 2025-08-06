"use client";
import Image from "next/image";
import { UserPlus, CheckCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const Step = ({ number, icon, title, tagline, content, image, reverse }) => (
  <div className={`flex flex-col gap-12 group items-start relative p-8 rounded-3xl border border-transparent hover:border-blue-500/20 transition-colors duration-300 ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
    {/* Prominent Number (Absolute Positioned) */}
    {/* FIX: Adjusted the left position on large screens from -12 to -6 */}
    <span className="absolute -top-6 left-1/2 -translate-x-1/2 lg:-left-6 lg:top-1/2 lg:-translate-x-0 lg:-translate-y-1/2 text-8xl font-extrabold text-blue-500/10 opacity-50 z-0">{number}</span>

    {/* Left/Right: Icon + Text */}
    <div className="flex-1 z-10">
      <div className="flex items-center gap-4 mb-3">
        {/* Updated Icon Container with Floating Animation */}
        <div className="bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-400/30 p-3 rounded-full shadow-lg text-blue-200 animate-float">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm italic text-blue-300 mb-2">{tagline}</p>
      <p className="text-gray-300 leading-relaxed max-w-prose">{content}</p>
    </div>

    {/* Right/Left: Image */}
    <div className="w-full lg:w-[380px] shrink-0 z-10">
      <Image
        src={`/images/${image}`}
        alt={title}
        width={380}
        height={380}
        className="rounded-2xl shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all duration-500"
      />
    </div>
  </div>
);

export default function HowItWorks() {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    setIsPulsing(true);
  }, []);

  return (
    <section className="py-28 sm:py-36 text-white relative overflow-hidden" style={{ backgroundColor: '#13112d' }}>
      {/* Subtle Shimmering Background */}
      <div className="absolute inset-0 z-0 shimmering-background"></div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-blue-400 font-semibold tracking-wide uppercase">How It Works</p>
          <h2
            className={`mt-4 text-4xl sm:text-5xl font-serif font-bold ${isPulsing ? "pulsing-heading" : ""}`}
          >
            Simplicity. Safety. Support.
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            We designed this experience to be more than a platform — it's a process. Gentle. Guided. Grounded in science and made for your peace of mind.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24">
          <Step
            number="1"
            icon={<UserPlus size={28} />}
            title="Step Into a Safe, Private Space"
            tagline="A place that’s just for you — peaceful, private, yours."
            content="Begin by choosing your plan and opening your private wellness account. No distractions. Just your journey, your pace."
            image="safe-space.png"
            reverse={false}
          />
          <Step
            number="2"
            icon={<CheckCircle size={28} />}
            title="Understand Yourself Deeply"
            tagline="This isn’t just data — it’s your story, made visible."
            content="Take a clinically-informed ADHD assessment rooted in DSM-5 and ASRS frameworks. You'll gain insights, clarity, and a powerful baseline."
            image="adhd-assessment.png"
            reverse={true}
          />
          <Step
            number="3"
            icon={<Sparkles size={28} />}
            title="Start Your Daily Flow"
            tagline="Clarity builds from consistency — one moment at a time."
            content="Access your dashboard and start your personalized daily routine — 5 short, intentional, AI-guided activities to build focus, calm, and consistency."
            image="daily-routine.png"
            reverse={false}
          />
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
            text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .pulsing-heading {
          animation: pulse 2.5s infinite ease-in-out;
        }

        @keyframes shimmer {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        .shimmering-background {
          background-color: #13112d;
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.03) 0%,
            transparent 50%,
            rgba(255, 255, 255, 0.03) 100%
          );
          background-size: 400% 400%;
          animation: shimmer 40s infinite linear;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}