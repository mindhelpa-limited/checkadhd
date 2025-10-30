import React from 'react';

// ===================================================================
// SIMPLE MAINTENANCE MESSAGE PAGE (STATIC, WHITE BACKGROUND)
// ===================================================================

export default function App() {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center 
                 bg-white text-center font-sans p-8"
    >
      <div 
        className="max-w-xl mx-auto text-gray-800"
      >
        {/* Simple Clock Icon (Using inline SVG for zero dependencies) */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="mx-auto mb-8 text-indigo-500"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>

        {/* The Core Message */}
        <h1
          className="text-6xl sm:text-7xl font-extrabold mb-4 tracking-tight text-gray-900"
        >
          We'll Be Back Soon
        </h1>

        {/* Supporting Text */}
        <p 
          className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed mt-4"
        >
          We are performing essential system updates. Thank you for your patience as we work to bring the service back online.
        </p>
      </div>
    </div>
  );
}
