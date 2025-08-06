"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserPlus, CheckCircle, Sparkles, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const router = useRouter();

  return (
    <section className="relative py-28 sm:py-36 text-white overflow-hidden bg-[#0a122a]">
      {/* Floating Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#A78BFA]/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full animate-float-slow" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-blue-400 font-semibold tracking-wide uppercase">How It Works</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-white">
            Simplicity. Safety. Support.
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            We designed this experience to be more than a platform — it's a process. Gentle. Guided. Grounded in science and made for your peace of mind.
          </p>
        </div>

        {/* Steps - Horizontal on Desktop, Vertical on Mobile */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16 items-stretch">
          {/* Step 1 */}
          <div className="flex-1 bg-white/5 p-8 rounded-2xl shadow-xl border border-transparent hover:border-blue-500/20 transition-colors duration-300 flex flex-col">
            <div className="relative w-full h-48 mb-6">
              <Image
                src="/images/safe-space.png"
                alt="A safe, private space"
                fill
                className="rounded-xl object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-400/30 p-3 rounded-full shadow-lg text-blue-200">
                <UserPlus size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-white">Step Into a Safe Space</h3>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-prose mt-auto">
              Begin by choosing your plan and opening your private wellness account. No distractions. Just your journey, your pace.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex-1 bg-white/5 p-8 rounded-2xl shadow-xl border border-transparent hover:border-blue-500/20 transition-colors duration-300 flex flex-col">
            <div className="relative w-full h-48 mb-6">
              <Image
                src="/images/adhd-assessment.png"
                alt="An ADHD assessment"
                fill
                className="rounded-xl object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-400/30 p-3 rounded-full shadow-lg text-blue-200">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-white">Understand Yourself</h3>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-prose mt-auto">
              Take a clinically-informed ADHD assessment rooted in DSM-5 and ASRS frameworks. You'll gain insights, clarity, and a powerful baseline.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex-1 bg-white/5 p-8 rounded-2xl shadow-xl border border-transparent hover:border-blue-500/20 transition-colors duration-300 flex flex-col">
            <div className="relative w-full h-48 mb-6">
              <Image
                src="/images/daily-routine.png"
                alt="A personalized daily routine"
                fill
                className="rounded-xl object-cover"
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-400/30 p-3 rounded-full shadow-lg text-blue-200">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-white">Start Your Daily Flow</h3>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-prose mt-auto">
              Access your dashboard and start your personalized daily routine — 5 short, intentional, AI-guided activities to build focus, calm, and consistency.
            </p>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="text-center mt-20">
          <button
            onClick={() => router.push("/pricing")}
            className="relative group inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-4 px-10 rounded-full shadow-xl transition-all duration-300"
          >
            <span className="mr-2">Get Started</span>
            <ArrowRight size={20} />
            <span className="absolute -inset-px rounded-full group-hover:ring-2 group-hover:ring-blue-400 transition-all duration-300"></span>
          </button>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-10px, -10px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-slow {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, 10px); }
          100% { transform: translate(0, 0); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
      `}</style>

      {/* Manual Divider added here */}
      <div className="absolute bottom-0 left-0 w-full h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>
    </section>
  );
}