"use client";

import { useRouter } from "next/navigation";

// This is the complete, redesigned Hero component for your homepage.
// It incorporates a more sophisticated design with custom animations and SVGs.
export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-72px)] text-charcoal overflow-hidden bg-[#0a122a] p-4 sm:p-8">
      
      {/* Background SVG - A dynamic, animated pattern for a sophisticated look */}
      <div className="absolute inset-0 z-0 opacity-20 flex items-center justify-center animate-[fade-in_1.5s_ease-out]">
        <div className="w-full h-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              className="text-blue-500/20 max-w-md w-full h-auto mx-auto"
            >
              {/* Main circle with a subtle glow animation */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" className="animate-[pulse_4s_infinite_ease-in-out]"/>
              
              {/* Inner pulsating circle */}
              <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="animate-[pulse_6s_infinite_ease-in-out_2s]"/>

              {/* Swirling spiral path for a sense of movement and focus */}
              <path d="M100 100 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40 A60 60 0 1 1 40 100 A60 60 0 1 0 100 160 A60 60 0 1 1 160 100 A60 60 0 1 0 100 40" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="stroke-blue-500/30 animate-[spin_40s_linear_infinite]"
                style={{ transformOrigin: 'center' }}
              />
            </svg>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 text-center px-4 md:px-8 space-y-6 md:space-y-8 animate-[fade-in_1s_ease-out] max-w-5xl mx-auto py-16">
        
        {/* Main Heading */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight md:leading-snug max-w-4xl text-white">
          Navigate Your <span className="text-blue-400 block sm:inline">Mind's Path.</span>
          <br className="sm:hidden" />
          Find Your Focus.
        </h1>
        
        {/* Subtitle */}
        <p className="font-sans mt-6 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-gray-300">
          A personalized approach to understanding and thriving with ADHD. Rediscover your unique potential and create a life of intention.
        </p>
        
        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push('/assessment')}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 text-white font-sans font-semibold py-4 px-10 rounded-full text-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 glow-on-hover"
          >
            Start Your Journey
          </button>
          <button
            onClick={() => router.push('/pricing')}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border border-blue-400/30 text-blue-300 font-sans font-semibold py-4 px-10 rounded-full text-lg hover:bg-blue-400/10 transition-all duration-300 active:scale-95"
          >
            Explore Options
          </button>
        </div>
      </div>
      
      {/* Custom CSS for Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        .glow-on-hover {
          position: relative;
          z-index: 0;
          transition: all 0.3s ease;
        }
        .glow-on-hover:before {
          content: '';
          background: linear-gradient(45deg, #1d4ed8, #3b82f6, #60a5fa, #3b82f6, #1d4ed8);
          position: absolute;
          top: -2px;
          left:-2px;
          background-size: 400%;
          z-index: -1;
          filter: blur(5px);
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          animation: glowing 20s linear infinite;
          opacity: 0;
          transition: opacity .3s ease-in-out;
          border-radius: 9999px; /* Tailwind's rounded-full */
        }
        .glow-on-hover:hover:before {
          opacity: 1;
        }
        .glow-on-hover:active {
          color: #fff;
        }
        .glow-on-hover:active:after {
          background: transparent;
        }
        .glow-on-hover:after {
          z-index: -1;
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: #2563eb;
          left: 0;
          top: 0;
          border-radius: 9999px;
        }
        @keyframes glowing {
          0% { background-position: 0 0; }
          50% { background-position: 400% 0; }
          100% { background-position: 0 0; }
        }
      `}</style>
    </div>
  );
}
