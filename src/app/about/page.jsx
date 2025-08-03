"use client";
import { Heart, Brain, Zap, Shield } from "lucide-react";

// --- Value Card Component ---
const ValueCard = ({ icon, title, children }) => (
  <div className="text-center">
    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{children}</p>
  </div>
);

// --- Main About Page Component ---
export default function AboutPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* --- Hero Section --- */}
      <div className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
            alt="A diverse team working together collaboratively"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 px-4 animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Our Mission is to Empower Minds
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
            We believe that with the right tools and support, everyone can navigate the challenges of ADHD and unlock their full potential.
          </p>
        </div>
      </div>

      {/* --- Our Story Section --- */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?q=80&w=2940&auto=format&fit=crop"
              alt="A person writing thoughtfully in a journal"
              className="rounded-2xl shadow-xl mx-auto"
            />
          </div>
          <div>
            <span className="text-blue-600 font-semibold tracking-wider uppercase">
              OUR STORY
            </span>
            <h2 className="text-4xl font-bold mt-2 mb-4 text-gray-900">
              Born from a Need for Clarity
            </h2>
            <p className="text-gray-600 text-lg">
              ADHD Check was founded on a simple but powerful idea: that understanding your mind is the first step to managing it. Frustrated by the lack of accessible, supportive, and modern tools for adults with ADHD, our founder set out to create a platform that combines clinical insights with engaging, technology-driven solutions to make the journey to focus a little easier.
            </p>
          </div>
        </div>
      </div>

      {/* --- Our Values Section --- */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Our Core Values
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              These principles guide every decision we make and every feature we build.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <ValueCard icon={<Heart size={28} />} title="Empathy-Driven">
              We build with compassion, creating tools we would want to use ourselves.
            </ValueCard>
            <ValueCard icon={<Brain size={28} />} title="Science-Backed">
              Our methods are grounded in established clinical frameworks and research.
            </ValueCard>
            <ValueCard icon={<Zap size={28} />} title="Empowerment">
              We provide tools and insights to help you take control of your journey.
            </ValueCard>
            <ValueCard icon={<Shield size={28} />} title="Privacy & Trust">
              Your data is yours. We are committed to keeping it secure and confidential.
            </ValueCard>
          </div>
        </div>
      </div>

      {/* --- Meet the Founder Section --- */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <img
            src="/kelvin.png"
            alt="Headshot of the founder, Dr. Kelvin"
            className="w-32 h-32 rounded-full mx-auto shadow-xl object-cover"
          />
          <h3 className="mt-6 text-2xl font-bold text-gray-900">Dr. Kelvin</h3>
          <p className="text-blue-600 font-semibold">Founder & CEO</p>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            "My personal journey with ADHD inspired me to create a solution that I wish I had years ago. My goal is to provide a supportive, data-driven platform that empowers others to not just cope with ADHD, but to truly thrive."
          </p>
        </div>
      </div>
    </div>
  );
}