"use client";

import { CheckCircle2, BrainCircuit, BarChart3, ArrowRight, Gamepad2, Music2 } from "lucide-react";
import Footer from "../../components/home/Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { auth } from "@/lib/firebase";

/* ----------------- Games ----------------- */
const games = [
  {
    name: "MoneyStack",
    description: "Stack the blocks with focus and precision. Great for improving attention.",
    imageUrl: "/images/blockstack.png",
    dest: "/dashboard/recovery/moneystack",
  },
  {
    name: "Snakegame",
    description: "Eat all the dots while navigating obstacles. Helps with timing and control.",
    imageUrl: "/images/trailmuncher.png",
    dest: "/dashboard/recovery/snakegame",
  },
  {
    name: "Pingmoney Game",
    description: "Bounce within the bounds. Supports quick decision making.",
    imageUrl: "/images/neuralbounds.png",
    dest: "/dashboard/recovery/pingmoneygame",
  },
];

/* ----------------- Music ----------------- */
const musicTiles = [
  {
    name: "Therapy Music",
    description: "A curated library of guided, calming tracks to help you reset.",
    imageUrl: "/images/feature-two.png",
    dest: "/dashboard/recovery/therapymusic",
  },
  {
    name: "Healing Sounds",
    description: "Ambient sounds and soundscapes for deep relaxation and focus.",
    imageUrl: "/images/feature-three.png",
    dest: "/dashboard/recovery/healingsounds",
  },
];

/* ----------------- Reusable Feature Card ----------------- */
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-[#0a122a] border border-white/10 rounded-xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-400/20 group">
    <div className="w-16 h-16 flex items-center justify-center bg-blue-500/10 text-blue-400 rounded-full mx-auto transition-transform duration-300 group-hover:scale-110 group-hover:text-white">
      {icon}
    </div>
    <h3 className="mt-6 text-xl font-serif font-semibold text-white text-center">{title}</h3>
    <p className="mt-2 text-gray-400 text-center text-base">{description}</p>
  </div>
);

/* ----------------- Modal ----------------- */
function ProceedModal({ open, onClose, onProceed, title, loggedOut }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#101b3d] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        {!loggedOut ? (
          <p className="text-gray-300 mt-2">You’re signed in. Would you like to proceed?</p>
        ) : (
          <p className="text-gray-300 mt-2">
            You’re logged out. Log in if you’ve already subscribed, or view plans to subscribe.
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {!loggedOut ? (
            <>
              <button
                onClick={onProceed}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors"
              >
                Proceed
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-xl border border-white/20 text-white font-semibold py-3 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => (window.location.href = "/login")}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => (window.location.href = "/pricing")}
                className="w-full rounded-xl border border-white/20 text-white font-semibold py-3 hover:bg-white/5 transition-colors"
              >
                View Plans
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Proceed?");
  const [pendingDest, setPendingDest] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);

  const handleExploreClick = (label, dest) => {
    setModalTitle(`Proceed to ${label}?`);
    setPendingDest(dest);

    const user = auth.currentUser;
    if (!user) {
      setLoggedOut(true);
      setModalOpen(true);
      return;
    }
    setLoggedOut(false);
    setModalOpen(true);
  };

  const proceed = () => {
    setModalOpen(false);
    if (pendingDest) router.push(pendingDest);
  };

  return (
    <div className="bg-[#0a122a] text-white overflow-hidden">
      {/* ================= HERO (spiral restored) ================= */}
      <div className="relative min-h-[80vh] flex items-center justify-center text-center px-4 sm:px-8">
        {/* Background image */}
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/images/feature-one.png"
            alt="Abstract thoughtful"
            className="w-full h-full object-cover object-center grayscale blur-sm"
            fill
            sizes="100vw"
          />
        </div>

        {/* Spiral (original complex path) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-[80vw] max-w-md h-auto text-blue-500/20 animate-spin-slow">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path
              d="M100 100 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40 A60 60 0 1 1 40 100 A60 60 0 1 0 100 160 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              className="stroke-blue-400/20"
            />
          </svg>
        </div>

        {/* Hero text */}
        <div className="relative z-20 text-center max-w-3xl mx-auto space-y-6 animate-hero-title-fade">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Built for Your Mind’s Momentum
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            Discover ADHD tools that meet you where you are — and help you move forward with clarity.
          </p>
        </div>
      </div>

      {/* ================= FEATURES GRID ================= */}
      <div className="bg-[#0a122a] py-24 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<CheckCircle2 size={28} />}
            title="Clinically-Informed"
            description="Our framework uses DSM-5 and ASRS standards — carefully designed to support real-world ADHD recovery."
          />
          <FeatureCard
            icon={<BrainCircuit size={28} />}
            title="AI-Personalized"
            description="Every day, your dashboard adapts to your progress, sending nudges and tools that align with how your mind works."
          />
          <FeatureCard
            icon={<BarChart3 size={28} />}
            title="Visually Motivating"
            description="See your consistency come alive through a beautiful calendar, streak counters, and meaningful progress markers."
          />
        </div>
      </div>

      {/* ================= GAMES ================= */}
      <div className="bg-[#0a122a] py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Gamepad2 className="w-10 h-10 text-cyan-400 mx-auto" />
          <h2 className="mt-3 text-4xl font-serif font-bold text-white">Focus Games, Real Gains</h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Quick, fun, and engaging — sharpen focus, timing, and decision making.
          </p>
        </div>

        <div className="mt-12 max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {games.map((g, i) => (
            <div
              key={g.name}
              className="group rounded-2xl overflow-hidden border border-white/10 bg-[#101b3d] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Full image (no crop) */}
              <div className="relative w-full aspect-[4/3] bg-[#0a122a] flex items-center justify-center overflow-hidden">
                <Image
                  src={g.imageUrl}
                  alt={g.name}
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={i === 0}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white">{g.name}</h3>
                <p className="mt-2 text-gray-400">{g.description}</p>
                <button
                  onClick={() => handleExploreClick(g.name, g.dest)}
                  className="mt-4 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors"
                >
                  Explore Library
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MUSIC ================= */}
      <div className="bg-[#0a122a] py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Music2 className="w-10 h-10 text-purple-300 mx-auto" />
          <h2 className="mt-3 text-4xl font-serif font-bold text-white">Therapy Music & Healing Sounds</h2>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Immerse yourself in calming tracks and soundscapes for deep focus and relaxation.
          </p>
        </div>

        <div className="mt-12 max-w-7xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 gap-10">
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
                  Explore Library
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DAILY PLAN ================= */}
      <div className="bg-gray-50 py-20 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-blue-600 font-bold uppercase tracking-widest">The Core Experience</p>
            <h2 className="mt-4 text-4xl font-serif font-bold">Your Daily Recovery Plan</h2>
            <p className="mt-6 text-lg text-gray-700">
              A five-part daily plan that blends meditation, mindful habits, cognitive care, and real ADHD recovery science.
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

      {/* ================= PROGRESS ================= */}
      <div className="bg-[#0a122a] py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div className="text-center">
            <Image
              src="/images/feature-three.png"
              alt="Progress chart"
              className="rounded-2xl shadow-xl mx-auto w-full max-w-lg"
              width={700}
              height={500}
            />
          </div>
          <div>
            <p className="text-green-500 font-bold uppercase tracking-widest">Stay Motivated</p>
            <h2 className="mt-4 text-4xl font-serif font-bold">Visualize Your Progress</h2>
            <p className="mt-6 text-lg text-gray-300">
              Our progress dashboard turns consistency into confidence. See every step, every win — beautifully.
            </p>
            <button
              onClick={() => router.push("/dashboard/progress")}
              className="mt-6 inline-flex items-center font-semibold text-green-400 hover:underline"
            >
              Explore the dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="bg-[#0a122a] py-24 text-center px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold font-serif">
          Ready to Build the Life You Deserve?
        </h2>
        <p className="mt-4 text-lg text-gray-300">
          Your ADHD journey doesn’t have to be chaotic. You can heal — and we’ll guide the process.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button
            onClick={() => router.push("/pricing")}
            className="glow-on-hover w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-10 rounded-full transition-all duration-300 shadow-xl"
          >
            View Plans →
          </button>
          <button
            onClick={() => router.push("/assessment")}
            className="border border-blue-400/30 text-blue-300 hover:bg-blue-400/10 text-lg font-semibold py-4 px-10 rounded-full transition-all duration-300"
          >
            Take the ADHD Test
          </button>
        </div>
      </div>

      <Footer />

      {/* ================= Animations ================= */}
      <style jsx global>{`
        .animate-hero-title-fade { animation: hero-title-fade 1.5s ease-out forwards; }
        @keyframes hero-title-fade { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin-slow { animation: spin 80s linear infinite; transform-origin: center; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .glow-on-hover { position: relative; z-index: 0; }
        .glow-on-hover:before {
          content: '';
          position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px;
          border-radius: 9999px;
          background: linear-gradient(45deg, #3b82f6, #2563eb, #1d4ed8);
          background-size: 400%;
          z-index: -1; filter: blur(6px); opacity: 0; transition: opacity .3s ease-in-out;
        }
        .glow-on-hover:hover:before { opacity: 1; }
      `}</style>

      <ProceedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onProceed={proceed}
        title={modalTitle}
        loggedOut={loggedOut}
      />
    </div>
  );
}
