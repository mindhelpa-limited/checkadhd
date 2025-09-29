// src/app/adhdcheck/page.js

// Components are generally imported using the absolute alias: '@/components/home/ComponentName'

import Hero from "@/components/home/Hero";               // 🆕 Added Hero
import Features from "@/components/home/Features";

// ✅ FIXED: Added 'home/' to the path
import HowItWorks from "@/components/home/HowItWorks"; 

// ✅ FIXED: Corrected path for Assessment
import Assessment from "@/components/home/Assessment"; 

import Pricing from "@/components/home/Pricing";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import Footer from "@/components/home/Footer";           // 🆕 Added Footer


export default function ADHDCheckPage() {
  return (
    <main>
      {/* Page Layout */}
      <Hero /> 
      <Assessment />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}