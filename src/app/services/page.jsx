"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Target,
  Globe2,
  Quote,
  ArrowRight,
  BrainCircuit,
  X,
} from "lucide-react";

import Footer from "../../components/home/Footer";
// 💡 IMPORTED THE HEADER
import Header from "../../components/Header"; 

// ----------------- New Animated Icon Component -----------------
const AnimatedSpiralCircle = ({ className }) => (
  <div
    className={`w-10 h-10 flex items-center justify-center ${className}`}
  >
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full text-purple-300 animate-spiral-spin"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 10 C69.88 10 86 26.12 86 46 M50 10 C30.12 10 14 26.12 14 46 M14 46 C14 65.88 30.12 82 50 82 M86 46 C86 65.88 69.88 82 50 82 M50 82 C40 82 32 74 32 64 M50 10 C60 10 68 18 68 28"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="opacity-70"
      />
    </svg>
  </div>
);

// ----------------- Data Constants -----------------
const services = [
  {
    name: "ADHD Assessment",
    description:
      "A complete ADHD test built on DSM-5 standards to help you understand your mind better.",
    imageUrl: "/images/blockstack.png",
    dest: "/pricing-adhd-assessment",
    isAdhd: true,
  },
  {
    name: "ADHD Clinical Assessment",
    description:
      "Get definitive clarity with a comprehensive, psychiatrist-led diagnostic evaluation, built on robust DSM-5 standards and ICD-11 criteria.",
    imageUrl: "/images/trailmuncher.png",
    dest: "/pricing-adhd-clinical-assessment",
    isAdhd: false,
  },
  {
    name: "Psychiatrist-Led Coaching",
    description:
      "Work directly with licensed professionals for personalized guidance and strategies.",
    imageUrl: "/images/neuralbounds.png",
    dest: "/book-a-coach",
    isAdhd: false,
  },
];

const musicTiles = [
  // This array is intentionally left empty
];

// ----------------- Reusable Components -----------------
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-[#0a122a] border border-white/10 rounded-xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-400/20 group">
    <div className="w-16 h-16 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-full mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:text-white">
      {icon}
    </div>
    <h3 className="mt-6 text-xl font-serif font-semibold text-white text-center">
      {title}
    </h3>
    <p className="mt-2 text-gray-400 text-center text-base">{description}</p>
  </div>
);

function ComingSoonModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#101b3d] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-2xl font-semibold text-white">Coming Soon</h3>
        <p className="mt-3 text-gray-300">
          This feature is under development. Stay tuned!
        </p>
      </div>
    </div>
  );
}

// ----------------- Main Page -----------------
export default function FeaturesPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleExploreClick = (serviceName, dest) => {
    if (
      serviceName === "ADHD Assessment" ||
      serviceName === "ADHD Clinical Assessment" ||
      serviceName === "Psychiatrist-Led Coaching"
    ) {
      router.push(dest);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div className="bg-[#0a122a] text-white overflow-hidden">
      
      {/* 💡 RENDERED HEADER HERE */}
      <Header /> 

      {/* 💡 ADDED SPACING DIV FOR FIXED HEADER */}
      <div className="hidden md:block h-[90px]" /> 
      
      {/* HERO SECTION */}
      {/* Reduced min-h-[60vh] to min-h-[55vh] */}
      <div className="relative min-h-[55vh] flex items-center justify-center text-center px-4 sm:px-8">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/images/feature-one.png"
            alt="Abstract thoughtful"
            className="w-full h-full object-cover object-center grayscale blur-sm"
            fill
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-[80vw] max-w-md h-auto text-blue-500/20 animate-spin-slow"
          >
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <path
              d="M100 100 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40 A60 60 0 1 1 40 100 A60 60 0 1 0 100 160 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              className="stroke-blue-400/20"
            />
          </svg>
        </div>
        <div className="relative z-20 text-center max-w-3xl mx-auto space-y-6 animate-hero-title-fade">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Built for Every Mind
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            Discover mental health solutions that meet you where you are — and guide you forward with clarity.
          </p>
        </div>
      </div>

      {/* SERVICES SECTION */}
      {/* Reduced py-16 to py-12 for less vertical space */}
      <div className="bg-[#0a122a] py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <BrainCircuit className="w-10 h-10 text-cyan-400 mx-auto" />
          <h2 className="mt-3 text-4xl font-serif font-bold text-white">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Explore assessments, recovery tools, and coaching programs designed to support your growth.
          </p>
        </div>

        <div className="mt-12 max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <div key={s.name} className="group rounded-2xl overflow-hidden border border-white/10 bg-[#101b3d] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div className="relative w-full aspect-[4/3] bg-[#0a122a] flex items-center justify-center overflow-hidden">
                <Image
                  src={s.imageUrl}
                  alt={s.name}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i === 0}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">{s.name}</h3>
                <p className="mt-2 text-gray-400">{s.description}</p>
                <button
                  onClick={() => handleExploreClick(s.name, s.dest)}
                  className="mt-4 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors"
                >
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DAILY PLAN SECTION */}
      <div className="bg-gray-50 py-20 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-blue-600 font-bold uppercase tracking-widest">
              The Core Experience
            </p>
            <h2 className="mt-4 text-4xl font-serif font-bold">
              Your Daily Recovery Plan
            </h2>
            <p className="mt-6 text-lg text-gray-700">
              A five-part daily plan that blends meditation, mindful habits, cognitive care, and real mental health recovery science.
            </p>
            <button
              onClick={() => router.push("/how-it-works")}
              className="mt-6 inline-flex items-center font-semibold text-blue-600 hover:underline"
            >
              See how it works <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
          <div className="text-center">
            <Image
              src="/images/feature-two.png"
              alt="Yoga calm"
              className="rounded-2xl shadow-xl mx-auto w-full max-w-lg"
              width={700}
              height={500}
            />
          </div>
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="bg-[#0a122a] py-24 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif">
          Ready to Build the Life You Deserve?
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Your mental health journey doesn’t have to be chaotic. Recovery is possible — and we’ll guide you globally.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button
            onClick={() => router.push("/how-it-works")}
            className="glow-on-hover w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-10 rounded-full transition-all duration-300 shadow-xl"
          >
            The Steps →
          </button>
          <button
            onClick={() => router.push("/how-it-works")}
            className="border border-blue-400/30 text-blue-300 hover:bg-blue-400/10 text-lg font-semibold py-4 px-10 rounded-full transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .animate-hero-title-fade {
          animation: hero-title-fade 1.5s ease-out forwards;
        }
        @keyframes hero-title-fade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
          animation: spin 80s linear infinite;
          transform-origin: center;
        }
        .animate-spin-slow-reverse {
          animation: spin-reverse 80s linear infinite;
          transform-origin: center;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spiral-spin {
          animation: spiral-spin 4s linear infinite;
        }
        @keyframes spiral-spin {
          from { transform: rotate(0deg) scale(1); }
          to { transform: rotate(360deg) scale(1); }
        }
      `}</style>

      <ComingSoonModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}