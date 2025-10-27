// ✅ PURE SERVER-SIDE VERSION — NO HYDRATION, SAFARI SAFE
import Image from "next/image";
import Footer from "../components/home/Footer";
import Header from "../components/Header";

// ---------------------------------------------------------
// PAGE METADATA (SSR)
// ---------------------------------------------------------
export const metadata = {
  title: "Psychiatrist-Led Coaching | Mindhelpa",
  description:
    "Screening, evaluation, and recovery made simple. With psychiatrist-led coaching and tools designed to help you crush your goals.",
};

// ---------------------------------------------------------
// SERVICES DATA
// ---------------------------------------------------------
const services = [
  {
    name: "ADHD Assessment",
    description:
      "A complete ADHD test built on DSM-5 standards to help you understand your mind better.",
    imageUrl: "/images/blockstack.png",
    dest: "/pricing-adhd-assessment",
  },
  {
    name: "ADHD CLINICAL ASSESSMENT",
    description:
      "DSM-5 aligned, comprehensive clinical assessment for a clear ADHD diagnosis.",
    imageUrl: "/images/music.png",
    dest: "/pricing-adhd-clinical-assessment",
  },
  {
    name: "Psychiatrist-Led Coaching",
    description:
      "Work directly with licensed professionals for personalized guidance and strategies.",
    imageUrl: "/images/neuralbounds.png",
    dest: "/book-a-coach",
  },
];

// ---------------------------------------------------------
// HERO SECTION
// ---------------------------------------------------------
function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] bg-[#0a122a] text-white flex items-center justify-center px-6 sm:px-10 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-new.png"
          alt="A person meditating, symbolizing focus and calm"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a122a] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a122a] to-transparent" />
      </div>

      <div className="relative z-20 max-w-4xl text-center space-y-8 py-16 sm:py-20 px-4">
        <p className="font-sans text-blue-300 uppercase text-sm tracking-widest font-semibold">
          FORTIFY YOUR MIND
        </p>
        <h1 className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Your mental health matters. <br className="hidden sm:block" />
          It’s time to take charge —{" "}
          <span className="text-blue-400">your way.</span>
        </h1>
        <p className="font-sans text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
          Enjoy Psychiatrist-Led Coaching and master tools designed to help you
          crush your goals.
        </p>

        {/* ✅ STATIC LINKS instead of onClick navigation */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
          <a
            href="/services"
            className="group inline-flex items-center justify-center w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-10 rounded-full shadow-xl transition-all duration-300"
          >
            <span className="mr-2">Start Your Journey</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm text-blue-400/50 animate-bounce z-30">
        ↓ Scroll to learn more
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// SERVICES SECTION
// ---------------------------------------------------------
function ServicesSection() {
  return (
    <section className="bg-[#0a122a] py-24 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 text-cyan-400 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 3v18M3 12h18" />
        </svg>
        <h2 className="mt-3 text-4xl font-serif font-bold text-white">
          Our Services
        </h2>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Explore assessments, recovery tools, and coaching programs designed to
          support your growth.
        </p>
      </div>

      <div className="mt-12 max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((s) => (
          <a
            key={s.name}
            href={s.dest}
            className="group rounded-2xl overflow-hidden border border-white/10 bg-[#101b3d] shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="relative w-full aspect-[4/3] bg-[#0a122a] flex items-center justify-center">
              <Image
                src={s.imageUrl}
                alt={s.name}
                fill
                className="object-contain p-4 group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold">{s.name}</h3>
              <p className="mt-2 text-gray-400">{s.description}</p>
              <div className="mt-4 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-center">
                Explore
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// CTA SECTION
// ---------------------------------------------------------
function CallToAction() {
  return (
    <section className="bg-[#0a122a] py-24 text-center px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold font-serif">
        Ready to Build the Life You Deserve?
      </h2>
      <p className="mt-4 text-lg text-gray-300">
        Your mental health journey doesn’t have to be chaotic. Recovery is
        possible — and we’ll guide you globally.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        <a
          href="/how-it-works"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-4 px-10 rounded-full shadow-xl"
        >
          The Steps →
        </a>
        <a
          href="/how-it-works"
          className="border border-blue-400/30 text-blue-300 hover:bg-blue-400/10 text-lg font-semibold py-4 px-10 rounded-full"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}

// ---------------------------------------------------------
// MAIN EXPORT
// ---------------------------------------------------------
export default async function HomePage() {
  return (
    <main className="bg-[#0a122a] text-white overflow-hidden">
      <Header />
      <Hero />
      <ServicesSection />
      <CallToAction />
      <Footer />
    </main>
  );
}
