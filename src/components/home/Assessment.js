"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function Assessment() {
  const router = useRouter();

  return (
    <section className="relative bg-[#0a122a] text-white py-28 sm:py-36 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-[#A78BFA]/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-blue-400/10 blur-[100px] rounded-full animate-float-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Image with ambient glow */}
          <div className="w-full h-full animate-fade-in-up">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=2874&auto=format&fit=crop"
                alt="Focused calm"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0a122a]/70 to-transparent" />
            </div>
          </div>

          {/* Right: Content */}
          <div className="animate-fade-in-up">
            <p className="text-[#A78BFA] font-semibold tracking-widest uppercase mb-2">
              The First Step
            </p>

            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Understand What Your Mind Has Been Trying to Tell You
            </h2>

            <p className="mt-6 text-lg text-gray-300 max-w-prose">
              This isn’t just a quiz. It’s a clinically grounded experience designed to mirror your
              thoughts back to you — clearly, gently, and without judgment. Our ASRS + DSM-5 based
              system gives you a reliable, empowering insight into your cognitive patterns.
            </p>

            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-4">
                <CheckCircle className="text-green-400 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-white text-lg">Clinically-Informed</h4>
                  <p className="text-gray-400 text-base leading-relaxed">
                    Developed using trusted mental health screening protocols — no pseudoscience.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <CheckCircle className="text-green-400 w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-semibold text-white text-lg">Truly Personalized</h4>
                  <p className="text-gray-400 text-base leading-relaxed">
                    Your result becomes the foundation for everything we guide you through next.
                  </p>
                </div>
              </li>
            </ul>

            <button
              onClick={() => router.push("/assessment")}
              className="mt-10 inline-block bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold text-lg py-4 px-10 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Take the Free Snippet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}