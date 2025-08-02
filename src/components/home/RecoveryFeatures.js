"use client";
import { Calendar, Target, Award } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Calendar className="w-10 h-10 text-blue-600" />,
      title: "Join the 20-Day ADHD Recovery Plan",
      description:
        "Start your personalized journey to better focus and productivity with our evidence-based 20-day program.",
    },
    {
      icon: <Target className="w-10 h-10 text-blue-600" />,
      title: "Complete 5 Daily Tasks",
      description:
        "Engage in targeted meditation, affirmations, daily passages, exercises, and focus tasks every day.",
    },
    {
      icon: <Award className="w-10 h-10 text-blue-600" />,
      title: "Track Your Streak & Take the Test",
      description:
        "Build your streak, track progress, and take the ADHD test after each 20-day cycle to see measurable results.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-4xl font-bold text-gray-900">How It Works</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          We’ve designed a simple, science-backed system to help you stay
          consistent and achieve better focus through daily structured tasks.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}