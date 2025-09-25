// src/app/dashboard/coachee/page.js

'use client';

import { motion } from 'framer-motion';
import { UserCheck, Zap, Heart, Calendar } from 'lucide-react'; // Changed icon for heart/wellness

// --- Shared Utility Components (defined locally for this page) ---

const GradientBlob = ({ className, delay }) => (
  <motion.div
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{
      scale: [0.5, 1, 0.8, 1.2],
      opacity: [0.1, 0.4, 0.2, 0.5],
      rotate: [0, 90, 180, 270],
    }}
    transition={{
      duration: 30 + delay * 5,
      repeat: Infinity,
      ease: 'easeInOut',
      repeatType: 'reverse',
    }}
    className={`absolute rounded-full mix-blend-screen filter blur-3xl ${className}`}
  />
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.9 },
  visible: { y: 0, opacity: 1, scale: 1 },
};

// --- Main Page Component ---
export default function CoacheeComingSoonPage() {
  
  const glowStyle = {
    // Purple to blue gradient for the text
    textShadow: '0 0 10px #4f46e5, 0 0 20px #a78bfa', 
    backgroundImage: 'linear-gradient(45deg, #a78bfa, #818cf8)', 
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const features = [
    { title: "Daily Mood & Progress Check-ins", description: "A simple and private space to log your emotional state and track progress.", icon: <Heart size={18} /> },
    { title: "Therapy Session Scheduler", description: "Securely view, book, and manage your one-on-one virtual or in-person sessions.", icon: <Calendar size={18} /> },
    { title: "Personalized Wellness Plan", description: "Access exercises and tools designed by your coach to meet your specific mental health goals.", icon: <Zap size={18} /> },
  ];

  const renderFeatureCard = (feature, index) => (
    <motion.div
      key={index}
      variants={itemVariants}
      className="p-6 border border-indigo-900/50 rounded-xl bg-gray-900/50 backdrop-blur-sm shadow-2xl transition-all duration-300 hover:border-indigo-500/80 hover:bg-gray-800/70"
    >
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-indigo-400 p-1.5 rounded-full bg-indigo-900/70">
          {feature.icon}
        </span>
        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
      </div>
      <p className="text-gray-400 text-sm">{feature.description}</p>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A] flex items-center justify-center p-4">
      {/* Background Blobs and Glows */}
      <GradientBlob className="w-96 h-96 top-1/4 left-1/4 bg-indigo-500/70" delay={0} />
      <GradientBlob className="w-80 h-80 bottom-1/4 right-1/4 bg-purple-500/70" delay={1} />
      
      {/* Animated Star/Grid Pattern (Subtle) */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1a1a 1px, transparent 0)',
        backgroundSize: '20px 20px',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)'
      }}></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto text-center py-20"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <UserCheck size={72} className="text-indigo-400 p-3 rounded-full border-2 border-indigo-600/50 shadow-lg" />
        </motion.div>
        
        <motion.h1
          variants={itemVariants}
          className="text-7xl md:text-8xl font-extrabold mb-4 font-display leading-tight"
          style={glowStyle}
        >
          Coachee Portal
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light"
        >
          Your personalized **Coachee Portal** is almost ready. We're building a dashboard dedicated entirely to your mental health and well-being.
        </motion.p>
        
        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 mt-16"
        >
          {features.map(renderFeatureCard)}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          variants={itemVariants} 
          className="mt-12 p-4 bg-indigo-900/30 border border-indigo-700/50 rounded-xl inline-block"
        >
          <p className="text-indigo-300 font-medium">Expected Launch: Q4 2025</p>
        </motion.div>
      </motion.div>
    </div>
  );
}