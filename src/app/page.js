"use client"; // <-- Must be the absolute first line

import { useEffect, useRef, useState } from "react";
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

// FIX APPLIED HERE: Corrected the path from "../../components/home/Footer" to "../components/home/Footer"
import Footer from "../components/home/Footer";


// =========================================================================
// HERO COMPONENT (Kept as is for context)
// =========================================================================

export function Hero() {
  // We use window.location.href for the navigation since Next.js 'useRouter' 
  // is not used in this component, matching your requested code block's logic.
  const startJourneyRoute = "/services"; 

  // Function to handle navigation using standard browser method
  const handleNavigation = (route) => {
    // Simulates navigation
    window.location.href = route;
  };

  return (
    <section className="relative min-h-[calc(100vh-72px)] bg-[#0a122a] text-white flex items-center justify-center px-6 sm:px-10 overflow-hidden">
      {/* Background Image Container - Replaced Next.js <Image> with standard <img> */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-new.png"
          alt="A person meditating, symbolizing focus and calm"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a122a] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a122a] to-transparent" />
      </div>

      {/* Main Content */}
      <div className={`relative z-20 max-w-4xl text-center space-y-8 py-24 px-4 sm:px-0 animate-fade-in-up`}>
        
        <p className="font-sans text-blue-300 uppercase text-sm tracking-widest font-semibold">
          MENTAL HEALTH MADE HUMAN
        </p>

        <h1 className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Your health matters. <br className="hidden sm:block" />
          It’s time to take charge — <span className="text-blue-400">your way.</span>
        </h1>

        <p className="font-sans text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-2xl mx-auto">
          Screening, evaluation, and recovery made simple. With psychiatrist-led coaching and tools designed to help you crush your goals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
          <button
            onClick={() => handleNavigation(startJourneyRoute)}
            className="relative group inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-10 rounded-full shadow-xl transition-all duration-300"
          >
            <span className="mr-2">Start Your Journey</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            <span className="absolute -inset-px rounded-full group-hover:ring-2 group-hover:ring-blue-400 transition-all duration-300"></span>
          </button>

          <button
            onClick={() => handleNavigation("/pricing-mental-health-recovery-tools")} 
            className="text-blue-300 hover:text-blue-200 border border-blue-400/30 hover:bg-blue-400/10 text-lg font-medium py-4 px-10 rounded-full transition-all duration-300"
          >
            Explore Recovery Tools
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-blue-400/50 animate-bounce z-30">
        ↓ Scroll to learn more
      </div>

      {/* Animations - Note: Animations for this component are added to the global style block below */}
      <div className="absolute bottom-0 left-0 w-full h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </div>
    </section>
  );
}


// -------------------------------------------------------------------------
// NEW ANIMATION COMPONENT FOR ASSESSMENT SECTION (Kept for Music/Sounds section)
// -------------------------------------------------------------------------

const AssessmentAnimation = ({ className }) => (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        {/*
            This SVG recreates the style from the uploaded image.
            The 'currentColor' is set by the parent's text-color utility class (e.g., text-blue-500)
        */}
        <svg viewBox="0 0 500 500" className="w-full h-full max-w-lg text-blue-500/50 animate-spin-assessment-circle" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Circle */}
            <circle cx="250" cy="250" r="240" stroke="currentColor" strokeWidth="1" opacity="0.4" />
            {/* Middle Circle */}
            <circle cx="250" cy="250" r="180" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            {/* Inner Circle */}
            <circle cx="250" cy="250" r="120" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
            
            {/* The abstract, overlapping, hand-drawn-like lines (similar to the image) */}
            <path 
                d="M 100 250 C 50 150, 450 150, 400 250 C 450 350, 50 350, 100 250" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                opacity="0.8" 
                className="animate-pulse-slow" 
            />
            
            <path 
                d="M 250 50 A 150 150 0 1 0 250 450 A 100 100 0 1 1 250 50" 
                stroke="currentColor" 
                strokeWidth="0.8" 
                opacity="0.6" 
                className="animate-path-dash"
            />

            {/* A subtle center highlight */}
            <circle cx="250" cy="250" r="5" fill="currentColor" opacity="0.5" />
        </svg>
    </div>
);


// -------------------------------------------------------------------------
// REUSABLE COMPONENTS, CONSTANTS, AND MAIN PAGE
// -------------------------------------------------------------------------


/**
 * AnimatedSpiralCircle Component
 * Renders a simple, rotating spiral circle icon.
 */
const AnimatedSpiralCircle = ({ className }) => (
  <div
    className={`w-10 h-10 flex items-center justify-center ${className}`}
  >
    {/* The SVG for the spiral effect */}
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

    {/* Custom CSS for the spiral spin animation is added at the bottom */}
  </div>
);

// ----------------- Data Constants -----------------

/**
 * Services Data
 * Defines the main offerings with navigation details.
 */
const services = [
  {
    name: "ADHD Assessment",
    description:
      "A complete ADHD test built on DSM-5 standards to help you understand your mind better.",
    imageUrl: "/images/blockstack.png",
    dest: "/pricing-adhd-assessment", // ✅ goes straight to pricing page
    isAdhd: true,
  },
  {
    name: "Mental Health Recovery Tools",
    description:
      "Daily trackers and science-based exercises for resilience, focus, and calm.",
    imageUrl: "/images/trailmuncher.png",
    dest: "/pricing-mental-health-recovery-tools", // ⬅ UPDATED DESTINATION
    isAdhd: false,
  },
  {
    name: "Psychiatrist-Led Coaching",
    description:
      "Work directly with licensed professionals for personalized guidance and strategies.",
    imageUrl: "/images/neuralbounds.png",
    dest: "/book-a-coach", // ⬅ UPDATED DESTINATION
    isAdhd: false,
  },
];

/**
 * Music/Sound Tiles Data
 * Defines the sound-related features.
 */
const musicTiles = [
  {
    name: "ADHD CLINICAL ASSESSMENT",
    description:
      "DSM-5 aligned, comprehensive clinical assessment for a clear ADHD diagnosis.",
    imageUrl: "/images/music.png",
    dest: "/pricing-adhd-clinical-assessment",
    isAdhd: true,
  },
  // REMOVED: The Mindhelpa institute card was here
];

// ----------------- Reusable Components -----------------


/**
 * ComingSoonModal Component
 * A modal that informs the user that a feature is under development.
 */
function ComingSoonModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#101b3d] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative text-center">
        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* Spinner */}
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

// ----------------- Main Page Component -----------------

/**
 * FeaturesPage Component
 * The main component for displaying all features and services.
 */
export default function FeaturesPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Handles the click event for exploring a service or feature.
   */
  const handleExploreClick = (serviceName, dest) => {
    if (
      serviceName === "ADHD Assessment" ||
      serviceName === "Mental Health Recovery Tools" ||
      serviceName === "Psychiatrist-Led Coaching" ||
      serviceName === "ADHD CLINICAL ASSESSMENT" 
      // REMOVED: || serviceName === "Mindhelpa institute"
    ) {
      router.push(dest);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <div className="bg-[#0a122a] text-white overflow-hidden">
      
      {/* RENDER THE NEW HERO COMPONENT */}
      <Hero /> 

      {/* --- */}

      {/* SERVICES SECTION */}
      <div className="bg-[#0a122a] py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <BrainCircuit className="w-10 h-10 text-cyan-400 mx-auto" />
          <h2 className="mt-3 text-4xl font-serif font-bold text-white">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Explore assessments, recovery tools, and coaching programs designed
            to support your growth.
          </p>
        </div>

        <div className="mt-12 max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <div
              key={s.name}
              className="group rounded-2xl overflow-hidden border border-white/10 bg-[#101b3d] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
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

      {/* --- */}

      {/* MUSIC/SOUNDS SECTION */}
      <div className="bg-[#0a122a] py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSpiralCircle className="mx-auto" />

          <h2 className="mt-3 text-4xl font-serif font-bold text-white">
            Specialized Assessments
          </h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Access our in-depth ADHD clinical assessment for a clear diagnosis.
          </p>
        </div>

        {/* UPDATED: Two-column layout for the card and the new animation */}
        <div className="mt-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          
          {/* Assessment Card (Left Side) */}
          <div className="md:col-span-1 max-w-md mx-auto w-full">
            {musicTiles.map((m, idx) => (
              <div
                key={m.name}
                className="group rounded-2xl overflow-hidden border border-white/10 bg-[#101b3d] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative w-full aspect-[16/9] bg-[#0a122a] overflow-hidden">
                  <Image
                    src={m.imageUrl}
                    alt={m.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={idx === 0}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{m.name}</h3>
                  <p className="mt-2 text-gray-400">{m.description}</p>
                  <button
                    onClick={() => handleExploreClick(m.name, m.dest)}
                    className="mt-4 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors"
                  >
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* New Animation (Right Side) */}
          <div className="hidden md:flex md:col-span-1 max-w-md mx-auto w-full h-80 justify-center items-center">
              <AssessmentAnimation className="w-full h-full text-blue-400" />
          </div>

        </div>
      </div>

      {/* --- */}

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
              A five-part daily plan that blends meditation, mindful habits,
              cognitive care, and real mental health recovery science.
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

      {/* --- */}

      {/* CALL TO ACTION (CTA) SECTION - REMOVED */}

      {/* --- */}

      <Footer />

      {/* Animations (Global Styles) - CLEANED UP */}
      <style jsx global>{`
        /* Floating Background Glows (No longer needed without CTA, but keeping just in case) */
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
        
        /* The spin animation for the Assessment Animation circle */
        @keyframes spin-assessment-circle {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-assessment-circle { animation: spin-assessment-circle 40s linear infinite; transform-origin: center; }

        /* General UI animations */
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-bounce {
          animation: bounce 2s infinite;
        }

        .animate-hero-title-fade {
          animation: hero-title-fade 1.5s ease-out forwards;
        }
        @keyframes hero-title-fade {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* The spin animation used in the ComingSoonModal */
        .animate-spin-slow {
          animation: spin 2s linear infinite; /* Kept the existing fast spin */
          transform-origin: center;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Custom animation for the spiral icon */
        .animate-spiral-spin {
          animation: spiral-spin 4s linear infinite;
        }
        @keyframes spiral-spin {
          from {
            transform: rotate(0deg) scale(1);
          }
          to {
            transform: rotate(360deg) scale(1);
          }
        }

        /* Subtle path animation for the new assessment circle */
        @keyframes path-dash {
            0% { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
            50% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -1000; }
        }
        .animate-path-dash { 
            stroke-dasharray: 200; /* Define dash pattern */
            stroke-dashoffset: 200; /* Start offset */
            animation: path-dash 20s linear infinite; 
        }
        @keyframes pulse-slow {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 0.4; }
        }
        .animate-pulse-slow {
            animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>

      <ComingSoonModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}