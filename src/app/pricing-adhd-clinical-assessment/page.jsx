"use client";

import { useState } from "react";
import {
  BrainCircuit,
  CheckCircle,
  Clock,
  Lightbulb,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Header from "../../components/Header"; // 💡 IMPORTED THE HEADER
import Footer from "../../components/home/Footer"; // 💡 IMPORTED THE FOOTER

// ----------------- Animated Hero -----------------
const AnimatedBrainCircuit = () => (
  <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
    <svg
      viewBox="0 0 200 200"
      className="w-[100vw] max-w-4xl h-auto text-blue-500/10 animate-spin-slow-reverse opacity-50"
      style={{ transformOrigin: "center" }}
    >
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <path
        d="M30 70 C50 30, 150 30, 170 70 S150 170, 100 170 S30 150, 30 70"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.3"
        className="stroke-cyan-300/30 animate-pulse-slow"
      />
      <path
        d="M50 50 L150 150 M150 50 L50 150"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.2"
        className="stroke-blue-400/30"
      />
      <circle
        cx="100"
        cy="100"
        r="5"
        fill="currentColor"
        className="text-cyan-400 animate-ping-slow"
      />
    </svg>
  </div>
);

// ----------------- Feature Item -----------------
const FeatureListItem = ({ icon, text }) => (
  <li className="flex items-start">
    <span className="flex-shrink-0 text-cyan-400 mt-1 mr-4">{icon}</span>
    <p className="text-gray-300 leading-relaxed text-lg">
      <strong className="text-white">{text}</strong>
    </p>
  </li>
);

// ----------------- Page -----------------
export default function ADHDClinicalAssessmentPricing() {
  // CHANGED: Set initial activeTab to "adult" instead of "child"
  const [activeTab, setActiveTab] = useState("adult");

  const features = [
    { text: "Consultant Psychiatrist-Led Diagnosis", icon: <BrainCircuit size={20} /> },
    { text: "90-Minute Comprehensive Virtual Consultation (via secure telehealth)", icon: <Clock size={20} /> },
    { text: "Comprehensive Evaluation using DSM-5 and ICD-11 criteria", icon: <CheckCircle size={20} /> },
    { text: "Formal, Medically Recognized Detailed Clinical Report", icon: <ShieldCheck size={20} /> },
    { text: "Differential Diagnosis Screening & Rule-Outs", icon: <CheckCircle size={20} /> },
    { text: "Personalised Next Steps & Expert-Guided Recommendations", icon: <BrainCircuit size={20} /> },
    { text: "Fast Access: Avoid NHS Waiting Times", icon: <Clock size={20} /> },
  ];

  const plans = {
    child: {
      name: "Child & Adolescent ADHD Assessment",
      price: "£1500",
      stripe: "https://buy.stripe.com/3cIeVdcZ8cKF2ED1MD2oE02",
      duration: "Assessment lasts 90 minutes",
    },
    adult: {
      name: "Adult ADHD Assessment",
      price: "£1000",
      stripe: "https://buy.stripe.com/eVq5kD4sC9yt0wvaj92oE01",
      duration: "Assessment lasts 90 minutes",
    },
  };

  const plan = plans[activeTab];

  return (
    <div className="bg-[#0a122a] text-white min-h-screen overflow-hidden">
      
      <Header />
      
      {/* 💡 ADDED SPACING DIV FOR FIXED HEADER */}
      <div className="hidden md:block h-[90px]" /> 
      
      {/* HERO */}
      <div className="relative py-24 sm:py-32 overflow-hidden">
        <AnimatedBrainCircuit />
        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center animate-hero-title-fade">
          <p className="font-serif text-base font-semibold leading-7 text-cyan-400 uppercase tracking-widest flex justify-center items-center">
            <Lightbulb size={20} className="mr-2 text-blue-400" />
            DEFINITIVE DIAGNOSIS
          </p>
          <h1 className="font-serif mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl leading-tight">
            The Gold Standard:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              ADHD Clinical Assessment
            </span>
          </h1>
          <p className="font-sans mt-6 text-xl leading-8 text-gray-300">
            Get definitive clarity with a <strong>psychiatrist-led diagnostic evaluation</strong>,
            built on DSM-5 and ICD-11 standards.
          </p>
        </div>
      </div>

      {/* TABS */}
      {/* CHANGED: Swapped the order of the two buttons */}
      <div className="flex justify-center -mt-6 mb-6 space-x-6">
        <button
          onClick={() => setActiveTab("adult")}
          className={`px-6 py-3 rounded-full text-lg font-semibold transition-all ${
            activeTab === "adult"
              ? "bg-gradient-to-r from-[#006D66] to-[#AD90F2] text-white shadow-lg shadow-purple-500/40"
              : "bg-gray-800 text-gray-300 hover:text-white"
          }`}
        >
          Adult
        </button>
        <button
          onClick={() => setActiveTab("child")}
          className={`px-6 py-3 rounded-full text-lg font-semibold transition-all ${
            activeTab === "child"
              ? "bg-gradient-to-r from-[#006D66] to-[#AD90F2] text-white shadow-lg shadow-purple-500/40"
              : "bg-gray-800 text-gray-300 hover:text-white"
          }`}
        >
          Child & Adolescent
        </button>
      </div>

      {/* CARD */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="max-w-2xl mx-auto bg-[#101b3d] rounded-3xl shadow-2xl border border-purple-400/20 overflow-hidden transform transition duration-500 hover:scale-[1.01] hover:shadow-purple-500/30">
          <div className="p-10 text-center bg-purple-600/10 border-b border-purple-400/30">
            <p className="text-sm uppercase tracking-widest font-semibold text-purple-300">
              {plan.name}
            </p>
            <h2 className="text-6xl font-extrabold text-white mt-2 flex items-center justify-center">
              {plan.price}
            </h2>
            <p className="text-lg text-green-300 mt-2">{plan.duration}</p>
            <p className="text-sm text-gray-400 mt-1">
              Full Clinical & Medico-Legal Standard Report Included
            </p>
          </div>

          <div className="p-10">
            <h3 className="text-3xl font-serif font-bold text-white mb-8">
              What Your Assessment Covers:
            </h3>
            <ul className="space-y-6">
              {features.map((f, i) => (
                <FeatureListItem key={i} text={f.text} icon={f.icon} />
              ))}
            </ul>

            <a
              href={plan.stripe}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 block w-full text-center bg-gradient-to-r from-[#006D66] to-[#AD90F2] hover:opacity-90 text-white text-xl font-bold py-5 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30"
            >
              {`Secure Your Assessment Slot — ${plan.price}`}
            </a>

            <p className="mt-4 text-center text-xs text-gray-500">
              Powered by Stripe for secure payment processing.
            </p>
          </div>
        </div>
      </div>

      {/* COMPARISON SECTION (Mentalwell Style) */}
      <div className="max-w-5xl mx-auto px-6 pb-24 text-center">
        <h2 className="text-4xl font-serif font-bold text-white mb-12">
          Making the Right Choice
        </h2>

        <div className="overflow-hidden rounded-[30px] border border-purple-400/20 shadow-xl">
          {/* Header */}
          <div className="grid grid-cols-2 text-white text-lg font-semibold">
            <div className="bg-gradient-to-r from-[#006D66] to-[#AD90F2] py-5 rounded-tl-[30px] text-center">
              MindHelpa
            </div>
            <div className="bg-[#E5E6EE] text-gray-800 py-5 rounded-tr-[30px] text-center">
              Competitors
            </div>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-2 divide-x divide-white bg-white text-gray-900 font-medium">
            <div className="py-4 px-4 text-center bg-white/5">All Inclusive Plans</div>
            <div className="py-4 px-4 text-center bg-white/5">All Inclusive Plans</div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-white text-lg">
            <div className="bg-[#0a122a] py-6 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <CheckCircle size={22} /> Complete Care Package
              </div>
            </div>
            <div className="bg-[#E5E6EE] py-6 flex flex-col items-center justify-center text-gray-700">
              <div className="flex items-center gap-2 text-red-500 font-medium">
                <XCircle size={22} /> Pay Extra on Each Step
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 divide-x divide-white bg-white text-gray-900 font-medium">
            <div className="py-4 px-4 text-center bg-white/5">Summary Letter Turnaround</div>
            <div className="py-4 px-4 text-center bg-white/5">Summary Letter Turnaround</div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-white text-lg">
            <div className="bg-[#0a122a] py-6 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <Clock size={22} /> 5 Days
              </div>
            </div>
            <div className="bg-[#E5E6EE] py-6 flex flex-col items-center justify-center text-gray-700">
              <div className="flex items-center gap-2 text-red-500 font-medium">
                <Clock size={22} /> Weeks–Months
              </div>
            </div>
          </div>

          {/* Row 3 - "Self-Assessment" */}
          <div className="grid grid-cols-2 divide-x divide-white bg-white text-gray-900 font-medium">
            <div className="py-4 px-4 text-center bg-white/5">Self-Assessment</div>
            <div className="py-4 px-4 text-center bg-white/5">Self-Assessment</div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-white text-lg">
            <div className="bg-[#0a122a] py-6 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <CheckCircle size={22} /> Included
              </div>
            </div>
            <div className="bg-[#E5E6EE] py-6 flex flex-col items-center justify-center text-gray-700">
              <div className="flex items-center gap-2 text-red-500 font-medium">
                <XCircle size={22} /> Extra Charge
              </div>
            </div>
          </div>
          
          {/* Row 4 */}
          <div className="grid grid-cols-2 divide-x divide-white bg-white text-gray-900 font-medium">
            <div className="py-4 px-4 text-center bg-white/5">Refer to Shared Care</div>
            <div className="py-4 px-4 text-center bg-white/5">Refer to Shared Care</div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-white text-lg rounded-b-[30px] overflow-hidden">
            <div className="bg-[#0a122a] py-6 flex flex-col items-center justify-center rounded-bl-[30px]">
              <div className="flex items-center gap-2 text-green-400 font-medium">
                <CheckCircle size={22} /> Included
              </div>
            </div>
            <div className="bg-[#E5E6EE] py-6 flex flex-col items-center justify-center text-gray-700 rounded-br-[30px]">
              <div className="flex items-center gap-2 text-red-500 font-medium">
                <XCircle size={22} /> Not Optional / Extra Charge
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* ANIMATIONS */}
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
        .animate-spin-slow-reverse {
          animation: spin-reverse 70s linear infinite;
          transform-origin: center;
        }
        @keyframes spin-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}