"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  DollarSign,
  Users,
  Zap,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Star,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import Footer from "../../components/home/Footer";

// ----------------- Curriculum Data -----------------
const curriculumData = [
  {
    week: "Week 1: Foundational Pillars – The Coach’s Identity & Core Science",
    theme: "Laying the Ethical and Neurobiological Groundwork",
    modules: [
      {
        id: 1,
        title: "Module 1: The Mandate & Ethics of Coaching",
        content:
          "Defining the scope of a Mental Health Coach (vs. Therapist/Counsellor). Establishing strict ethical boundaries, confidentiality, and duty of care.",
      },
      {
        id: 2,
        title: "Module 2: Core Mental Health Concepts (The Landscape)",
        content:
          "Understanding common conditions (Anxiety, Depression, Bipolar, ADHD) and basic symptomology. Focusing on supportive, non-diagnostic language.",
      },
      {
        id: 3,
        title: "Module 3: Neurobiology & The Brain (The Inner Sanctuary)",
        content:
          "Understanding the nervous system (ANS), the stress response (cortisol/adrenaline), and basic brain plasticity. Applying psychoeducation effectively.",
      },
      {
        id: 4,
        title: "Module 4: Deep Listening & Rapport Building",
        content:
          "Mastering Level 3 (Deep) listening. Techniques for building immediate, unconditional positive regard and trust with diverse clients.",
      },
      {
        id: 5,
        title: "Module 5: The Power of Motivational Interviewing (MI)",
        content:
          "Introduction to MI principles (OARS) to elicit change talk and resolve ambivalence. Moving clients from contemplation to action.",
      },
    ],
  },
  {
    week: "Week 2: Diagnostic Rituals – Assessment & Proven Tools",
    theme: "Acquiring Structured Frameworks for Client Progress",
    modules: [
      {
        id: 6,
        title: "Module 6: CBT & DBT Basics for Coaches",
        content:
          "Practical application of Cognitive Behavioral Therapy (CBT) and Dialectical Behavior Therapy (DBT) skills (e.g., thought records, distress tolerance) within a coaching context.",
      },
      {
        id: 7,
        title: "Module 7: Trauma-Informed Coaching Principles",
        content:
          "Recognizing signs of trauma (without diagnosing). Prioritizing safety, transparency, and collaboration to avoid re-traumatization.",
      },
      {
        id: 8,
        title: "Module 8: Screening Tools & DSM-5 Context",
        content:
          "Using validated self-report screening tools (e.g., PHQ-9, GAD-7) and understanding when and how to refer a client for formal psychiatric diagnosis.",
      },
      {
        id: 9,
        title: "Module 9: Goal Setting (SMART & Beyond)",
        content:
          "Mastering collaborative goal-setting techniques that are sustainable, aligned with client values, and adaptive to mental health challenges.",
      },
      {
        id: 10,
        title: "Module 10: Psychoeducation Masterclass",
        content:
          "Developing scripts and resources to educate clients on topics like sleep hygiene, emotional regulation, and executive function.",
      },
    ],
  },
  {
    week: "Week 3: Pastoral Care Techniques – Intervention & Practice",
    theme: "Hands-On Coaching, Specialization, and Deep Client Work",
    modules: [
      {
        id: 11,
        title: "Module 11: Crisis Management and Safety Planning",
        content:
          "Recognizing high-risk indicators (suicidality, self-harm). Implementing practical crisis plans and activating external emergency resources.",
      },
      {
        id: 12,
        title: "Module 12: Group Coaching Dynamics & Facilitation",
        content:
          "Designing effective group sessions, managing challenging group members, and leveraging the power of peer support for exponential growth.",
      },
      {
        id: 13,
        title: "Module 13: Coaching the ADHD Client",
        content:
          "Specialized tools and strategies for executive function challenges, time blindness, and emotional dysregulation common in ADHD.",
      },
      {
        id: 14,
        title: "Module 14: Boundary Setting for Coach & Client",
        content:
          "Establishing firm professional and personal boundaries, managing client expectations, and addressing requests outside the scope of coaching.",
      },
      {
        id: 15,
        title: "Module 15: Self-Care, Supervision & Burnout Prevention",
        content:
          "Mandatory curriculum on sustaining your career. Developing a robust supervision network and personalized self-care plan.",
      },
    ],
  },
  {
    week: "Week 4: Seminary to Sanctuary – Business & Launch",
    theme: "Certified Business Models for a Thriving Coaching Practice",
    modules: [
      {
        id: 16,
        title: "Module 16: Legal, Insurance & Administrative Setup",
        content:
          "The non-negotiables: registering your business, professional liability insurance, GDPR/data protection compliance, and basic bookkeeping.",
      },
      {
        id: 17,
        title: "Module 17: Proven Pricing Models & Packaging",
        content:
          "Analysis of profitable coaching models (per-session, package, retainer). Strategies for communicating your value and handling fee resistance.",
      },
      {
        id: 18,
        title: "Module 18: Client Acquisition: The Ethical Funnel",
        content:
          "Building a trust-based marketing system. Using content creation and professional networking to attract your ideal clients without hype.",
      },
      {
        id: 19,
        title: "Module 19: Digital Presence & Telehealth Setup",
        content:
          "Optimizing your website/social media. Choosing secure, compliant telehealth platforms and setting up scheduling systems.",
      },
      {
        id: 20,
        title: "Module 20: Final Project: The Practice Launch Plan",
        content:
          "Submitting a complete business plan, mock coaching session recording, and final ethics quiz to receive your MIMH Professional Coach Certification.",
      },
    ],
  },
];

// Accordion Component
const ModuleAccordion = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-700/50 last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-4 px-6 text-left transition duration-200 hover:bg-blue-900/40"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-start space-x-4">
          <span className="text-2xl font-black text-cyan-400 opacity-80 mt-[-2px]">
            {item.id}.
          </span>
          <span className="text-white font-semibold flex-1 leading-snug">
            {item.title}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-blue-300 flex-shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
            {isOpen ? "Minimize" : "View Details"}
          </span>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 pt-3 text-gray-300 bg-blue-900/20 border-t border-gray-700/50 text-base leading-relaxed">
          {item.content}
        </div>
      )}
    </div>
  );
};

// Animated background
const AnimatedNebula = () => (
  <div className="absolute inset-0 z-10 overflow-hidden">
    <div
      className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl opacity-50 animate-glow-slow"
      style={{ transform: "translate(-50%, -50%)", animationDelay: "1s" }}
    ></div>
    <div
      className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-700/10 rounded-full blur-3xl opacity-50 animate-glow-slow-reverse"
      style={{ transform: "translate(-50%, -50%)", animationDelay: "0s" }}
    ></div>
  </div>
);

// ----------------- Main Component -----------------
export default function MindhelpaInstitutePricing() {
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const price = 1500;
  const discountedPrice = 0;
  const displayPrice = discountApplied ? discountedPrice : price;

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: couponCode.trim().toUpperCase(),
          product: "institute",
          mode: "payment",
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session.");
      }
      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError(err.message || "Could not connect to payment provider.");
      setLoading(false);
    }
  };

  const handleCouponChange = (val) => {
    setCouponCode(val);
    if (val.trim().toUpperCase() === "DRKELVIN100") {
      setDiscountApplied(true);
    } else {
      setDiscountApplied(false);
    }
  };

  return (
    <div className="bg-[#020617] text-white min-h-screen pt-16 font-sans overflow-hidden">
      {/* HERO */}
      <div className="relative py-24 sm:py-32 overflow-hidden">
        <AnimatedNebula />
        <div className="relative z-20 max-w-6xl mx-auto text-center px-4 animate-hero-title-fade">
          <p className="font-sans text-base font-semibold leading-7 text-cyan-400 uppercase flex justify-center items-center mb-3">
            <GraduationCap className="w-6 h-6 mr-2 text-blue-400" />
            PROFESSIONAL COACH CERTIFICATION
          </p>
          <h1 className="text-5xl sm:text-7xl font-extrabold font-serif text-white leading-tight drop-shadow-2xl">
            Mindhelpa Institute of Mental Health
          </h1>
          <h2 className="text-xl sm:text-3xl font-light bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-200 mt-4 italic">
            The Seminary for Professional Mental Health Coaches
          </h2>
          <p className="mt-8 max-w-4xl mx-auto text-lg text-gray-400">
            An intensive, 4-week, 20-module certification program designed to
            equip you with <strong>deep clinical understanding</strong>,{" "}
            <strong>ethical mastery</strong>, and a{" "}
            <strong>proven, immediately deployable business model</strong>.
          </p>
        </div>
      </div>

      {/* PRICING */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 pb-20">
        <div className="lg:col-span-1 p-8 rounded-3xl bg-gradient-to-br from-blue-900 to-blue-950 border-4 border-blue-600/50 h-fit shadow-xl">
          <p className="text-sm uppercase font-bold text-blue-200 mb-2">
            Total Program Investment
          </p>
          <div className="flex items-center justify-between border-b border-blue-600/50 pb-4 mb-6">
            <h3 className="text-6xl font-black text-white">
              £{displayPrice}
            </h3>
            {discountApplied && (
              <span className="text-lg text-green-400 ml-2">
                🎉 Coupon applied
              </span>
            )}
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400/30" />
          </div>
          {displayPrice < price && (
            <p className="text-red-400 line-through mb-2">£{price}</p>
          )}
          <input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => handleCouponChange(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white mb-4"
          />
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-teal-400 py-4 text-lg font-bold text-gray-900 rounded-xl hover:from-cyan-500 hover:to-teal-500 transition"
          >
            {loading ? "Redirecting..." : "Secure Your Spot →"}
          </button>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>

        {/* CURRICULUM */}
        <div className="lg:col-span-2 bg-blue-900/40 p-8 rounded-3xl border border-blue-700/50 shadow-inner">
          <h3 className="text-3xl font-bold mb-8 text-cyan-200">
            The 20-Module Curriculum Breakdown
          </h3>
          {curriculumData.map((week, i) => (
            <div
              key={i}
              className="mb-6 rounded-xl border border-blue-800 bg-blue-900/60"
            >
              <div className="p-4 border-b border-blue-800">
                <h4 className="text-xl font-bold text-white">{week.week}</h4>
                <p className="text-sm text-blue-300 italic">{week.theme}</p>
              </div>
              <div>
                {week.modules.map((m) => (
                  <ModuleAccordion key={m.id} item={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      <style jsx global>{`
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
        .animate-glow-slow {
          animation: glow-pulse 15s ease-in-out infinite alternate;
        }
        .animate-glow-slow-reverse {
          animation: glow-pulse 15s ease-in-out infinite alternate-reverse;
        }
        @keyframes glow-pulse {
          0% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.5;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
