import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Assessment from "../components/home/Assessment";
import Pricing from "../components/home/Pricing";
import FAQ from "../components/home/FAQ";
import CTA from "../components/home/CTA";
import Footer from "../components/home/Footer"; // ✅ Footer now inside home folder

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Assessment />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer /> {/* ✅ Footer added here */}
    </>
  );
}
