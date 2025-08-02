"use client";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* The video source is now pointing to a local file in your project */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
          // This path assumes the video is in your `public/videos` folder
          src="/videos/hero-background.mp4"
        />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      <div className="relative z-10 px-4 animate-fadeInUp">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight">
          Find Your Focus. Reclaim Your Day.
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-200">
          A science-backed, personalized plan to help you manage ADHD, build better habits, and thrive.
        </p>
        <button 
          onClick={() => router.push('/pricing')} 
          className="mt-10 bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );
}
