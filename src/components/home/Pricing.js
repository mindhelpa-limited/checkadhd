"use client";

import { useRouter } from "next/navigation"; import { Check } from "lucide-react";

export default function Pricing() { const router = useRouter();

const features = [ "Complete 75-Question ADHD Assessment", "Personalized Daily Recovery Dashboard", "AI-Powered Meditations & Exercises", "Interactive Readings with Quizzes", "Gamified Progress & Streak Tracking", ];

return ( <section className="bg-[#0a122a] py-32 text-white"> <div className="max-w-7xl mx-auto px-6 lg:px-8"> {/* Section Heading */} <div className="max-w-3xl mx-auto text-center animate-fade-in-up"> <p className="text-base font-semibold tracking-widest text-blue-400 uppercase"> Simple, All-Inclusive Pricing </p> <h2 className="mt-4 font-serif text-5xl font-bold leading-tight tracking-tight text-white"> One Plan, Unlimited Potential </h2> <p className="mt-6 text-lg text-gray-300"> Get full access to every feature with our simple premium subscription. No hidden fees, no complicated tiers. </p> </div>

{/* Pricing and Image */}
    <div className="mt-24 grid lg:grid-cols-2 gap-16 items-center animate-fade-in-up">
      {/* Image Section */}
      <div className="w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2811&auto=format&fit=crop"
          alt="A person reviewing their finances and plans, looking confident."
          className="rounded-3xl shadow-xl object-cover w-full h-full"
        />
      </div>

      {/* Pricing Card */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-white/10">
        <h3 className="text-3xl font-serif font-bold text-white">Premium Recovery Plan</h3>
        <p className="mt-4 text-5xl font-extrabold text-white">
          £15<span className="text-xl font-medium text-gray-400"> / month</span>
        </p>
        <p className="mt-4 text-gray-300">
          Everything you need to build focus, consistency, and a calmer mind.
        </p>
        <button
          onClick={() => router.push("/pricing")}
          className="mt-8 w-full bg-blue-600 text-white font-bold py-4 rounded-lg text-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Get Started Today
        </button>
        <ul className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="w-6 h-6 text-green-400 mr-3 flex-shrink-0 mt-1" />
              <span className="text-gray-200">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>

  {/* Animation Styling */}
  <style jsx global>{`
    .animate-fade-in-up {
      animation: fadeInUp 1.2s ease-out both;
    }
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
  `}</style>
</section>

); }