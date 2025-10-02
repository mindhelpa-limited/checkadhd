// This component is designed to be the default export for your Next.js page 
// located at /dashboard/resources.

import React from 'react';
// Import necessary icons from lucide-react for visual flair
import { Music3, Clock, Film } from 'lucide-react'; 

const ComingSoonPage = () => {
  return (
    // Outer container for centering and full screen height
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-950">
      <div className="text-center max-w-xl lg:max-w-3xl w-full 
                    bg-white dark:bg-gray-800 
                    shadow-2xl hover:shadow-indigo-500/50 dark:hover:shadow-indigo-500/30 
                    rounded-2xl p-8 sm:p-12 lg:p-16
                    transform hover:scale-[1.02] transition-all duration-500 ease-in-out 
                    ring-4 ring-indigo-500/10 dark:ring-indigo-500/5 hover:ring-indigo-500/30">
        
        {/* Large Central Icon Group */}
        <div className="mb-8 flex justify-center space-x-6">
          {/* Main icon with a subtle glow and bounce animation */}
          <Music3 
            className="w-16 h-16 lg:w-20 lg:h-20 text-indigo-600 dark:text-indigo-400 
                       animate-bounce transition-all duration-300 drop-shadow-lg" 
            style={{ animationDuration: '3s' }} // Make the bounce slower and more noticeable
          />
          {/* Secondary icon with a solid vibrant color */}
          <Film className="w-16 h-16 lg:w-20 lg:h-20 text-pink-600 dark:text-pink-400 drop-shadow-lg" />
        </div>

        {/* Main Title - Applied Text Gradient for better visual appeal */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight 
                       bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500 
                       dark:from-indigo-400 dark:to-pink-300">
          Music Videos
        </h1>

        {/* Subtitle/Primary Message */}
        <p className="text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 font-medium mb-10">
          Ready to enhance your focus.
        </p>

        {/* Anticipation Message Block - More prominent and cleaner design */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 
                    text-base sm:text-lg text-indigo-800 dark:text-indigo-100 
                    bg-indigo-50/70 dark:bg-indigo-900/50 p-6 rounded-xl shadow-lg border border-indigo-200 dark:border-indigo-700">
          <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
          <span className="text-center sm:text-left font-medium">We're preparing the final mix. Check back soon for unique soundtracks designed to help you focus and relax!</span>
        </div>

        {/* Signature/Team Message - Updated Team Name */}
        <div className="mt-12 text-sm text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-widest">
          — A Project by the mindhelpa Team —
        </div>

      </div>
    </div>
  );
};

export default ComingSoonPage;
