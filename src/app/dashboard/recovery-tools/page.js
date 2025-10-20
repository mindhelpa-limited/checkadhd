'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

// ===================================================================
// MOBILE RESPONSIVE CYBER-AESTHETIC COMING SOON PAGE
// ===================================================================

export default function RecoveryGameSelectionPage() {
  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center 
                 bg-[#030718] 
                 text-center text-white font-sans px-4 sm:px-6 py-16 relative overflow-hidden"
      // Added px-4 for better padding on extra small screens
    >
      {/* 1. Nebula Background Glow & Animation (No change needed - covers viewport) */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.3, 0.5],
          rotate: [0, 2, -2, 0], 
        }}
        transition={{
          duration: 20,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          background:
            'radial-gradient(circle at 50% 50%, #10B9811A 0%, transparent 60%), radial-gradient(circle at 10% 90%, #6366F110 0%, transparent 80%)',
        }}
      />
      
      {/* 2. Grid Overlay (No change needed) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 3. Main Content Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: 'easeOut' }}
        className="relative z-20 max-w-xl mx-auto p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] 
                   backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
        // Reduced max-width to 'xl' for better control, adjusted padding and border radius for small screens
        style={{
            boxShadow: '0 0 80px rgba(99, 102, 241, 0.2), 0 0 20px rgba(16, 185, 129, 0.2)'
        }}
      >
        
        {/* Animated Clock Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 100 }}
          className="mb-6 sm:mb-8"
        >
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-[#10B981] drop-shadow-lg" />
            {/* Adjusted icon size */}
        </motion.div>

        {/* Title: We’re Coming Soon */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-4xl sm:text-7xl font-black mb-4 sm:mb-6 tracking-tighter leading-tight"
          // Adjusted font size from 5xl to 4xl for mobile, and 7xl for sm+
          style={{
            backgroundImage: 'linear-gradient(90deg, #FFFFFF, #A7F3D0, #6366F1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow:
              '0 0 10px rgba(167,243,208,0.5), 0 0 25px rgba(99,102,241,0.4)',
          }}
        >
          We’re Coming Soon
        </motion.h1>

        {/* Subtitle: Our Goal Tracker tool... */}
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="text-lg sm:text-2xl text-[#BEE3F8] font-light leading-relaxed max-w-full mx-auto mb-6 sm:mb-8"
            // Adjusted font size from xl to lg for mobile, and 2xl for sm+
        >
            Our Goal Tracker tool and Videos & Music are almost ready.
        </motion.p>
        
        {/* Final line: Stay tuned... */}
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-4 sm:mt-6 text-xl sm:text-2xl font-semibold text-[#A7F3D0]"
             // Adjusted font size from 2xl to xl for mobile, and 2xl for sm+
        >
            Stay tuned — your personalized MindHelpa experience launches soon.
        </motion.p>
        

      </motion.div>

      {/* 4. Footer Message */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 2.0 }}
        className="absolute bottom-4 sm:bottom-6 text-xs sm:text-sm text-[#4A5568] z-20"
         // Adjusted position and font size for mobile
      >
        MindHelpa © {new Date().getFullYear()} — Empowering clarity and calm.
      </motion.p>
    </section>
  );
}