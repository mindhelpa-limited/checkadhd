'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
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
const TabIcon = ({ tabName, size = 20 }) => {
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

  // --- Goal Tracker Tab Content ---
  const GoalTrackerTabContent = () => (
    <div
      className="relative overflow-hidden rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-[#111827] p-6 sm:p-8 mt-6 sm:mt-10 shadow-xl border border-[#F3F4F6]"
      style={{
        backgroundImage: `
          radial-gradient(60% 40% at 20% 0%, rgba(16,185,129,0.10), transparent 60%),
          radial-gradient(50% 30% at 80% 15%, rgba(59,130,246,0.10), transparent 60%),
          linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 40%, #F3F4F6 100%)
        `,
        boxShadow: '0 10px 30px rgba(17,24,39,0.06)',
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
          General Growth Tracker
        </motion.h2>
        <p className="text-lg sm:text-xl text-[#111827]/70 mb-8 sm:mb-10 max-w-lg font-light">
          Set, monitor, and achieve your personal growth milestones. Maintain your streaks for continued progress.
        </p>
        <Link href="/dashboard/recovery/goal-tracker">
          <motion.button
            whileHover={{ scale: 1.06, rotate: 1 }}
            whileTap={{ scale: 0.97 }}
            onClick={playClickSound}
            className="text-white font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-full shadow-xl focus:outline-none focus-visible:ring-2 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 12px 30px rgba(16, 185, 129, 0.45)',
            }}
          >
            Start Tracking Goals
          </motion.button>
        </Link>
      </div>
    </div>
  );

  // --- Videos Tab Content ---
  const VideosTabContent = () => (
    <div
      className="relative overflow-hidden rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-[#111827] p-6 sm:p-8 mt-6 sm:mt-10 shadow-xl border border-[#F3F4F6]"
      style={{
        backgroundImage: `
          radial-gradient(60% 40% at 20% 0%, rgba(251,191,36,0.10), transparent 60%),
          radial-gradient(50% 30% at 80% 15%, rgba(249,115,22,0.10), transparent 60%),
          linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 40%, #F3F4F6 100%)
        `,
        boxShadow: '0 10px 30px rgba(17,24,39,0.06)',
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
          Inspirational Videos
        </motion.h2>
        <p className="text-lg sm:text-xl text-[#111827]/70 mb-8 sm:mb-10 max-w-lg font-light">
          Watch curated videos on Meditation, Affirmation, and Motivation to guide your journey.
        </p>
        <Link href="/dashboard/recovery/videos">
          <motion.button
            whileHover={{ scale: 1.06, rotate: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={playClickSound}
            className="text-white font-bold py-3 px-8 sm:py-4 sm:px-12 rounded-full shadow-xl focus:outline-none focus-visible:ring-2 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #F59E0B, #F97316)',
              boxShadow: '0 12px 30px rgba(245, 158, 11, 0.45)',
            }}
          >
            Watch Now
          </motion.button>
        </Link>
      </div>
    </div>
  );

  // --- Music Tab Content ---
  const MusicTabContent = ({ title, link }) => (
    <div
      className="relative overflow-hidden rounded-3xl min-h-[400px] flex flex-col items-center justify-center text-[#111827] p-6 sm:p-8 mt-6 sm:mt-10 shadow-xl border border-[#F3F4F6]"
      style={{
        backgroundImage: `
          radial-gradient(60% 40% at 20% 0%, rgba(59,130,246,0.10), transparent 60%),
          radial-gradient(50% 30% at 80% 15%, rgba(20,184,166,0.10), transparent 60%),
          radial-gradient(40% 30% at 50% 100%, rgba(167,139,250,0.10), transparent 60%),
          linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 40%, #F3F4F6 100%)
        `,
        boxShadow: '0 10px 30px rgba(17,24,39,0.06)',
      }}
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="w-full h-full"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage:
              'linear-gradient(270deg, rgba(59,130,246,0.06), rgba(20,184,166,0.06), rgba(167,139,250,0.06), rgba(59,130,246,0.06))',
            backgroundSize: '400% 400%',
          }}
        />
        <div className="absolute inset-0 bg-white/50"></div>
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/2 filter blur-3xl opacity-40"
          initial={{ scaleX: 0.6, y: '50%', rotate: 8 }}
          animate={{ scaleX: [0.6, 1, 0.6], y: ['50%', '42%', '50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.18), rgba(167,139,250,0.18))' }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold mb-4 font-display text-transparent bg-clip-text"
          style={{ backgroundImage: 'linear-gradient(90deg, #3B82F6, #A78BFA)' }}
        >
          {title}
        </motion.h2>
        <p className="text-lg sm:text-xl text-[#111827]/70 mb-8 max-w-lg font-light">
          Immerse yourself in calming melodies and nature sounds designed for deep focus and relaxation.
        </p>
        <Link href={link}>
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={playClickSound}
            className="text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-full shadow-lg focus:outline-none focus-visible:ring-2 flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #FB923C, #F87171)',
              boxShadow: '0 8px 24px rgba(248,113,113,0.35)',
            }}
          >
            Explore Library
          </motion.button>
        </Link>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'goal-tracker':
        return <GoalTrackerTabContent />;
      case 'videos':
        return <VideosTabContent />;
      case 'therapy-music':
        return <MusicTabContent title="Therapy Music" link="/dashboard/recovery/therapymusic" />;
      case 'healing-sounds':
        return <MusicTabContent title="Healing Sounds" link="/dashboard/recovery/healingsounds" />;
      case 'games':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mt-6 sm:mt-10">
            {games.map((game, index) => (
              <Link href={game.link} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  onClick={handleGameClick}
                  className="group cursor-pointer relative overflow-hidden rounded-3xl transition-all duration-300"
                  style={{ filter: 'drop-shadow(0 6px 24px rgba(17,24,39,0.06))' }}
                >
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"
                    style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.12), rgba(167,139,250,0.12))' }} />
                  <div
                    className="relative p-5 sm:p-6 rounded-3xl border overflow-hidden"
                    style={{
                      borderColor: '#F3F4F6',
                      backgroundImage: `
                        radial-gradient(35% 60% at 15% 0%, rgba(59,130,246,0.08), transparent 70%),
                        radial-gradient(30% 50% at 85% 10%, rgba(20,184,166,0.08), transparent 70%),
                        linear-gradient(160deg, #FFFFFF, #F9FAFB 45%, #F3F4F6 100%)
                      `,
                      boxShadow: 'inset 0 0 1px rgba(255,255,255,0.6)',
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
                      <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0))' }} />
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <h2 className="text-xl sm:text-2xl font-bold mb-2"
                        style={{ color: '#111827' }}>
                        {game.name}
                      </h2>
                      <p className="text-sm sm:text-base font-light" style={{ color: 'rgba(17,24,39,0.70)' }}>
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
        return 'text-[#20B8A6]'; // Teal
      default:
        return 'text-[#111827]/70'; // Default muted color
    }
  };

  // Enhanced beautiful tab button class
  const getButtonClass = (tabName) => `
    relative px-3 md:px-6 py-2 md:py-3 font-semibold text-xs md:text-sm rounded-full transition-all duration-300 z-10
    focus:outline-none focus-visible:ring-2 flex items-center flex-shrink-0 // 🚨 Added flex-shrink-0
    ${activeTab === tabName
      ? 'text-[#111827] bg-white shadow-lg'
      // 🚨 UPDATED: Apply unique color to inactive tabs
      : `${getTabTextColor(tabName)} hover:text-[#111827] hover:bg-white/70`}
  `;

  // Function to render the Motion Pill inside the active tab
  const ActivePill = ({ color = '#3B82F6' }) => (
    <motion.div
      layoutId="underline-pill"
      className="absolute inset-0 rounded-full"
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        boxShadow: `0 0 0 2px ${color}1A, 0 4px 12px rgba(17, 24, 39, 0.05)`,
        background: 'rgba(255, 255, 255, 0.95)',
      }}
    />
  );

  return (
    <div
      className="py-0 px-0 font-sans min-h-screen"
      style={{
        backgroundImage: `
          radial-gradient(60% 40% at 20% 0%, rgba(59,130,246,0.10), transparent 60%),
          radial-gradient(50% 30% at 80% 12%, rgba(20,184,166,0.10), transparent 60%),
          radial-gradient(40% 30% at 50% 100%, rgba(167,139,250,0.10), transparent 60%),
          linear-gradient(to bottom, #FFFFFF, #F9FAFB 40%, #F3F4F6 100%)
        `,
        color: '#111827',
      }}
    >
      {/* STICKY HEADER WRAPPER */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md py-4 sm:py-6 border-b border-[#E5E7EB]/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            // 🚨 FIX: Replaced w-fit with w-full and removed mx-auto to ensure tabs start at the edge.
            className="flex items-center gap-2 md:gap-4 overflow-x-auto whitespace-nowrap rounded-full border p-1 w-full" 
            style={{ borderColor: '#E5E7EB' }} 
          >
            {/* Tab 1: Goal Tracker */}
            <motion.div className="relative flex-shrink-0">
              <button onClick={() => handleTabClick('goal-tracker')} className={getButtonClass('goal-tracker')}>
                <TabIcon tabName="goal-tracker" size={16} />
                Goal Tracker
              </button>
              {activeTab === 'goal-tracker' && <ActivePill color="#10B981" />}
            </motion.div>


            {/* Tab 2: Videos */}
            <motion.div className="relative flex-shrink-0">
              <button onClick={() => handleTabClick('videos')} className={getButtonClass('videos')}>
                <TabIcon tabName="videos" size={16} />
                Videos
              </button>
              {activeTab === 'videos' && <ActivePill color="#F59E0B" />}
            </motion.div>

            {/* Tab 3: Therapy Music */}
            <motion.div className="relative flex-shrink-0">
              <button onClick={() => handleTabClick('therapy-music')} className={getButtonClass('therapy-music')}>
                <TabIcon tabName="therapy-music" size={16} />
                Therapy Music
              </button>
              {activeTab === 'therapy-music' && <ActivePill color="#3B82F6" />}
            </motion.div>

            {/* Tab 4: Games */}
            <motion.div className="relative flex-shrink-0">
              <button onClick={() => handleTabClick('games')} className={getButtonClass('games')}>
                <TabIcon tabName="games" size={16} />
                Games
              </button>
              {activeTab === 'games' && <ActivePill color="#A78BFA" />}
            </motion.div>

            {/* Tab 5: Healing Sounds */}
            <motion.div className="relative flex-shrink-0">
              <button onClick={() => handleTabClick('healing-sounds')} className={getButtonClass('healing-sounds')}>
                <TabIcon tabName="healing-sounds" size={16} />
                Healing Sounds
              </button>
              {activeTab === 'healing-sounds' && <ActivePill color="#20B8A6" />}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">{renderContent()}</div>
    </div>
  );
}