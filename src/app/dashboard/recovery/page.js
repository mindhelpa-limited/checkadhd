'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
// Used a more standard, smaller size for icons in tabs for better mobile look
import { Target, Video, Music, Volume2, Gamepad } from 'lucide-react'; 

const games = [
  {
    name: 'MoneyStack',
    description: 'Stack the blocks with focus and precision. Great for improving attention.',
    link: '/dashboard/recovery/moneystack',
    imageUrl: '/images/block.png',
  },
  {
    name: 'Snakegame',
    description: 'Eat all the dots while navigating obstacles. Helps with timing and control.',
    link: '/dashboard/recovery/snakegame',
    imageUrl: '/images/snakegame.png',
  },
  {
    name: 'Pingmoney game',
    description: 'Bounce within the bounds. Supports quick decision making.',
    link: '/dashboard/recovery/pingmoneygame',
    imageUrl: '/images/neural.png',
  },
];

// Helper component to render the icon for a given tab
const TabIcon = ({ tabName, size = 18 }) => { // Slightly smaller icon for elegance
  switch (tabName) {
    case 'goal-tracker':
      return <Target size={size} className="mr-2" />;
    case 'videos':
      return <Video size={size} className="mr-2" />;
    case 'therapy-music':
      return <Music size={size} className="mr-2" />;
    case 'healing-sounds':
      return <Volume2 size={size} className="mr-2" />;
    case 'games':
      return <Gamepad size={size} className="mr-2" />;
    default:
      return null;
  }
};

export default function RecoveryGameSelectionPage() {
  const [activeTab, setActiveTab] = useState('goal-tracker');
  const backgroundAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    backgroundAudioRef.current = new Audio('/meditation.mp3');
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = 0.5;

    clickAudioRef.current = new Audio('/sounds/click.mp3');
    clickAudioRef.current.volume = 0.7;

    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
      if (clickAudioRef.current) {
        clickAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (backgroundAudioRef.current) {
      if (activeTab === 'therapy-music' || activeTab === 'healing-sounds') {
        backgroundAudioRef.current.play().catch((error) => {
          console.log('Audio play failed, user interaction required.', error);
        });
      } else {
        backgroundAudioRef.current.pause();
      }
    }
  }, [activeTab]);

  const playClickSound = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch((e) => console.error('Click sound playback failed:', e));
    }
  };

  const handleTabClick = (tabName) => {
    playClickSound();
    setActiveTab(tabName);
  };

  const handleGameClick = () => {
    playClickSound();
  };
  
  // Refined Button Styles
  const ContentLinkButton = ({ href, text, bgColor, shadowColor }) => (
    <Link href={href}>
        <motion.button
            whileHover={{ scale: 1.05, rotate: 0.5, boxShadow: `0 14px 40px ${shadowColor}` }}
            whileTap={{ scale: 0.95 }}
            onClick={playClickSound}
            className="text-white font-bold py-3 px-10 sm:py-4 sm:px-12 rounded-full shadow-xl focus:outline-none focus-visible:ring-2 flex items-center gap-2 transition-all duration-300"
            style={{
                background: bgColor,
                boxShadow: `0 8px 20px ${shadowColor}`,
            }}
        >
            {text}
        </motion.button>
    </Link>
  );

  // --- Goal Tracker Tab Content ---
  const GoalTrackerTabContent = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-[#111827] p-6 sm:p-8 mt-6 sm:mt-10 shadow-xl border border-[#E5E7EB] transform hover:scale-[1.01] transition-transform duration-500"
        style={{
            // Softer, more elegant inner background
            backgroundImage: `
                radial-gradient(80% 50% at 20% 100%, rgba(16,185,129,0.15), transparent 70%),
                radial-gradient(70% 40% at 80% 0%, rgba(59,130,246,0.15), transparent 70%),
                linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 50%, #F5F7F9 100%)
            `,
            boxShadow: '0 12px 40px rgba(17,24,39,0.08), inset 0 0 1px #FFFFFF',
        }}
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4 font-display text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(90deg, #10B981, #3B82F6)' }}
        >
          Growth Flow Tracker
        </motion.h2>
        <p className="text-lg sm:text-xl text-[#111827]/70 mb-8 sm:mb-10 max-w-lg font-light">
          Set, visualize, and achieve your personal growth milestones. Every step is elegantly tracked.
        </p>
        <ContentLinkButton 
            href="/dashboard/recovery/goal-tracker" 
            text="Start Tracking Goals" 
            bgColor="linear-gradient(135deg, #10B981, #059669)" 
            shadowColor="rgba(16, 185, 129, 0.4)" 
        />
      </div>
    </motion.div>
  );

  // --- Videos Tab Content ---
  const VideosTabContent = () => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      className="relative overflow-hidden rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-[#111827] p-6 sm:p-8 mt-6 sm:mt-10 shadow-xl border border-[#E5E7EB] transform hover:scale-[1.01] transition-transform duration-500"
      style={{
        backgroundImage: `
          radial-gradient(60% 40% at 20% 0%, rgba(251,191,36,0.15), transparent 70%),
          radial-gradient(50% 30% at 80% 15%, rgba(249,115,22,0.15), transparent 70%),
          linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 50%, #F5F7F9 100%)
        `,
        boxShadow: '0 12px 40px rgba(17,24,39,0.08), inset 0 0 1px #FFFFFF',
      }}
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4 font-display text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(90deg, #F59E0B, #F97316)' }}
        >
          Mindful Viewing Library
        </motion.h2>
        <p className="text-lg sm:text-xl text-[#111827]/70 mb-8 sm:mb-10 max-w-lg font-light">
          Discover curated videos for deep meditation, positive affirmation, and strong motivation.
        </p>
        <ContentLinkButton 
            href="/dashboard/recovery/videos" 
            text="Watch Now" 
            bgColor="linear-gradient(135deg, #F59E0B, #F97316)" 
            shadowColor="rgba(245, 158, 11, 0.4)" 
        />
      </div>
    </motion.div>
  );

  // --- Music Tab Content (Used for Therapy Music & Healing Sounds) ---
  const MusicTabContent = ({ title, link, primaryColor, secondaryColor, icon }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-[#111827] p-6 sm:p-8 mt-6 sm:mt-10 shadow-xl border border-[#E5E7EB] transform hover:scale-[1.01] transition-transform duration-500"
        style={{
            backgroundImage: `
                radial-gradient(60% 40% at 20% 0%, ${primaryColor}1A, transparent 70%),
                radial-gradient(50% 30% at 80% 15%, ${secondaryColor}1A, transparent 70%),
                linear-gradient(180deg, #FFFFFF 0%, #FAFBFD 50%, #F5F7F9 100%)
            `,
            boxShadow: '0 12px 40px rgba(17,24,39,0.08), inset 0 0 1px #FFFFFF',
        }}
    >
      {/* Subtle, animated glow effect for Music/Sound tabs */}
      <motion.div
        className="absolute inset-0 z-0 opacity-40 mix-blend-multiply"
        animate={{ 
            scale: [1, 1.05, 1], 
            rotate: [0, 1, 0],
            opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        style={{ 
            background: `radial-gradient(circle at 50% 50%, ${primaryColor}30, transparent 70%)` 
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4 font-display text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})` }}
        >
          {title}
        </motion.h2>
        <p className="text-lg sm:text-xl text-[#111827]/70 mb-8 max-w-lg font-light">
          Immerse yourself in calming melodies and nature sounds designed for deep focus and relaxation.
        </p>
        <ContentLinkButton 
            href={link} 
            text="Explore Library" 
            bgColor={`linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`} 
            shadowColor={`${primaryColor}50`}
        />
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'goal-tracker':
        return <GoalTrackerTabContent />;
      case 'videos':
        return <VideosTabContent />;
      case 'therapy-music':
        return <MusicTabContent 
                    title="Therapy Music" 
                    link="/dashboard/recovery/therapymusic" 
                    primaryColor="#3B82F6" // Blue
                    secondaryColor="#A78BFA" // Violet
                />;
      case 'healing-sounds':
        return <MusicTabContent 
                    title="Healing Sounds" 
                    link="/dashboard/recovery/healingsounds"
                    primaryColor="#06B6D4" // Cyan
                    secondaryColor="#10B981" // Green
                />;
      case 'games':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mt-6 sm:mt-10">
            {games.map((game, index) => (
              <Link href={game.link} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 10px 30px rgba(17,24,39,0.12), 0 0 10px rgba(59,130,246,0.3)' // Added subtle blue glow on hover
                  }}
                  onClick={handleGameClick}
                  className="group cursor-pointer relative overflow-hidden rounded-3xl transition-all duration-300"
                  style={{ filter: 'drop-shadow(0 6px 24px rgba(17,24,39,0.06))' }}
                >
                  <div 
                    className="relative p-5 sm:p-6 rounded-3xl border overflow-hidden"
                    style={{
                      borderColor: '#E5E7EB', // Lighter border
                      // Softened Game Card Background
                      backgroundImage: `
                        radial-gradient(35% 60% at 15% 0%, rgba(59,130,246,0.06), transparent 70%),
                        radial-gradient(30% 50% at 85% 10%, rgba(20,184,166,0.06), transparent 70%),
                        linear-gradient(160deg, #FFFFFF, #FAFBFD 45%, #F5F7F9 100%)
                      `,
                      boxShadow: 'inset 0 0 1px rgba(255,255,255,0.8)',
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-4 aspect-w-16 aspect-h-9">
                      <Image
                        src={game.imageUrl}
                        alt={game.name}
                        width={500}
                        height={300}
                        className="rounded-xl sm:rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[#111827]">
                        {game.name}
                      </h2>
                      <p className="text-sm sm:text-base font-light text-[#111827]/70">
                        {game.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  // Function to determine the text color of the inactive tabs
  const getTabTextColor = (tabName) => {
    switch (tabName) {
      case 'goal-tracker':
        return 'text-[#10B981]'; // Green
      case 'videos':
        return 'text-[#F59E0B]'; // Amber/Orange
      case 'therapy-music':
        return 'text-[#3B82F6]'; // Blue
      case 'games':
        return 'text-[#A78BFA]'; // Violet
      case 'healing-sounds':
        return 'text-[#06B6D4]'; // Cyan
      default:
        return 'text-[#111827]/70'; 
    }
  };

  // Enhanced beautiful tab button class
  const getButtonClass = (tabName) => `
    relative px-3 md:px-5 py-2 md:py-3 font-semibold text-xs md:text-sm rounded-full transition-all duration-300 z-10
    focus:outline-none focus-visible:ring-2 flex items-center flex-shrink-0
    ${activeTab === tabName
      ? 'text-[#111827] bg-white shadow-lg'
      : `${getTabTextColor(tabName)} hover:text-[#111827] hover:bg-white/70`}
  `;

  // Function to render the Motion Pill inside the active tab
  const ActivePill = ({ color = '#3B82F6' }) => (
    <motion.div
      layoutId="underline-pill"
      className="absolute inset-0 rounded-full"
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        // Sharper, premium shadow for the active pill
        boxShadow: `0 2px 10px ${color}33, 0 4px 18px rgba(17, 24, 39, 0.08)`, 
        background: 'rgba(255, 255, 255, 0.98)', // Nearly opaque white for a crisp look
      }}
    />
  );

  return (
    <div
      className="py-0 px-0 font-sans min-h-screen"
      style={{
        // 1. GLOBAL BACKGROUND ENHANCEMENT: Softer, more complex, beautiful background
        backgroundImage: `
          radial-gradient(60% 40% at 20% 0%, rgba(59,130,246,0.12), transparent 60%),
          radial-gradient(50% 30% at 80% 12%, rgba(20,184,166,0.12), transparent 60%),
          radial-gradient(40% 30% at 50% 100%, rgba(167,139,250,0.12), transparent 60%),
          linear-gradient(to bottom, #FEFEFE, #F7F9FC 40%, #EFF2F5 100%)
        `,
        color: '#111827',
      }}
    >
      {/* STICKY HEADER WRAPPER */}
      <div 
        className="sticky top-0 z-50 py-4 sm:py-6 border-b border-[#E5E7EB]/50"
        style={{
          // 2. STICKY BAR POLISH: Glass-morphism with a distinct floating shadow
          background: 'rgba(255, 255, 255, 0.75)', // More transparent for better background blend
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 16px rgba(17, 24, 39, 0.04)', // Subtle drop shadow
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-2 md:gap-4 overflow-x-auto whitespace-nowrap rounded-full border p-1 w-full" 
            style={{ 
                borderColor: '#E5E7EB', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)' // Make the track slightly brighter
            }} 
          >
            {/* Tab 1: Goal Tracker */}
            <motion.div className="relative flex-shrink-0">
              <button onClick={() => handleTabClick('goal-tracker')} className={getButtonClass('goal-tracker')}>
                <TabIcon tabName="goal-tracker" />
                Tracker
              </button>
              {activeTab === 'goal-tracker' && <ActivePill color="#10B981" />}
            </motion.div>


            {/* Tab 2: Videos */}
            <motion.div className="relative flex-shrink-0">
              <button onClick={() => handleTabClick('videos')} className={getButtonClass('videos')}>
                <TabIcon tabName="videos" />
                Videos
              </button>
              {activeTab === 'videos' && <ActivePill color="#F59E0B" />}
            </motion.div>

            {/* Tab 3: Therapy Music */}
            <motion.div className="relative flex-shrink-0">
              <button onClick={() => handleTabClick('therapy-music')} className={getButtonClass('therapy-music')}>
                <TabIcon tabName="therapy-music" />
                Music
              </button>
              {activeTab === 'therapy-music' && <ActivePill color="#3B82F6" />}
            </motion.div>

            {/* Tab 4: Games */}
            <motion.div className="relative flex-shrink-0">
              <button onClick={() => handleTabClick('games')} className={getButtonClass('games')}>
                <TabIcon tabName="games" />
                Games
              </button>
              {activeTab === 'games' && <ActivePill color="#A78BFA" />}
            </motion.div>

            {/* Tab 5: Healing Sounds */}
            <motion.div className="relative flex-shrink-0">
              <button onClick={() => handleTabClick('healing-sounds')} className={getButtonClass('healing-sounds')}>
                <TabIcon tabName="healing-sounds" />
                Sounds
              </button>
              {activeTab === 'healing-sounds' && <ActivePill color="#06B6D4" />}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">{renderContent()}</div>
    </div>
  );
}