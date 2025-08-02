"use client";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export default function Pricing() {
  const router = useRouter();

  const features = [
    "Complete 75-Question ADHD Assessment",
    "Personalized Daily Recovery Dashboard",
    "AI-Powered Meditations & Exercises",
    "Interactive Readings with Quizzes",
    "Gamified Progress & Streak Tracking",
  ];

  return (
    <section className="bg-gray-50 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base font-semibold leading-7 text-blue-600">
            SIMPLE, ALL-INCLUSIVE PRICING
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            One Plan, Unlimited Potential
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get full access to every feature with our simple premium subscription. No hidden fees, no complicated tiers.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2811&auto=format&fit=crop"
              alt="A person reviewing their finances and plans, looking confident."
              className="rounded-2xl shadow-xl object-cover w-full h-full"
            />
          </div>

          {/* Pricing Card Section */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900">Premium Recovery Plan</h3>
            <p className="mt-4 text-5xl font-extrabold text-gray-900">
              £15
              <span className="text-xl font-medium text-gray-500"> / month</span>
            </p>
            <p className="mt-4 text-gray-600">
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
                  <Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
