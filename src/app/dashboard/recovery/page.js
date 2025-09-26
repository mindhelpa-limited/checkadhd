'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Target, Video, Music, Volume2, Gamepad, ChevronRight } from 'lucide-react'; // ⬅️ NEW: Import ChevronRight

// ===================================================================
// I. UTILITY & CONSTANTS
// ===================================================================

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

// Array defining the tab order
const TAB_ORDER = ['goal-tracker', 'videos', 'therapy-music', 'games', 'healing-sounds'];

// Helper component to render the icon for a given tab
const TabIcon = ({ tabName, size = 18 }) => {
  // All icons are white/light gray by default in dark mode
  const colorClass = 'text-white/80';
  switch (tabName) {
    case 'goal-tracker':
      return <Target size={size} className={`mr-2 ${colorClass}`} />;
    case 'videos':
      return <Video size={size} className={`mr-2 ${colorClass}`} />;
    case 'therapy-music':
      return <Music size={size} className={`mr-2 ${colorClass}`} />;
    case 'healing-sounds':
      return <Volume2 size={size} className={`mr-2 ${colorClass}`} />;
    case 'games':
      return <Gamepad size={size} className={`mr-2 ${colorClass}`} />;
    default:
      return null;
  }
};

// UTILITY: Color Mapping
const tabColors = {
  'goal-tracker': { primary: '#059669', secondary: '#3B82F6', text: '#059669' },
  'videos': { primary: '#D97706', secondary: '#F97316', text: '#D97706' },
  'therapy-music': { primary: '#1D4ED8', secondary: '#A78BFA', text: '#1D4ED8' },
  'games': { primary: '#9333EA', secondary: '#EC4899', text: '#9333EA' },
  'healing-sounds': { primary: '#0891B2', secondary: '#059669', text: '#0891B2' },
};

// Dark Mode base colors
const DARK_BG_COLOR = '#0A0A0A';
const DARK_CARD_COLOR = '#1A1A1A';
const DARK_BORDER_COLOR = '#2A2A2A';
const LIGHT_TEXT_COLOR = '#F5F5F5';
const MUTED_TEXT_COLOR = '#A3A3A3';

// ⬅️ NEW UTILITY FUNCTION: Get the next tab in the sequence
const getNextTab = (currentTab) => {
    const currentIndex = TAB_ORDER.indexOf(currentTab);
    // Cycle back to the first tab if currently on the last tab
    const nextIndex = (currentIndex + 1) % TAB_ORDER.length;
    return TAB_ORDER[nextIndex];
};


// ===================================================================
// II. SHARED UI COMPONENTS (Adapted for Beautiful Dark Mode)
// ===================================================================

// ⬅️ NEW COMPONENT: Mobile-only button to navigate to the next tab
const NextTabButton = ({ currentTab, onNextClick }) => {
    // Determine the descriptive name of the next tab for accessibility/label
    const nextTabName = getNextTab(currentTab).replace('-', ' ').toUpperCase();

    return (
        <motion.button
            onClick={onNextClick}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-20 sm:hidden" // ⬅️ sm:hidden ensures it only appears on mobile
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to next section: ${nextTabName}`}
            style={{
                background: 'rgba(255, 255, 255, 0.1)', // Light overlay for visibility
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                border: `1px solid ${DARK_BORDER_COLOR}`,
            }}
        >
            <ChevronRight size={30} className="text-white" />
        </motion.button>
    );
};


/**
 * Component: Call-to-Action Link Button with Gradient and Hover Effects
 */
const ContentLinkButton = ({ href, text, primaryColor, secondaryColor, shadowColor, onClick }) => (
  <Link href={href} passHref>
    <motion.button
      whileHover={{ scale: 1.05, rotate: 0.5, boxShadow: `0 15px 40px ${shadowColor}`, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="text-white font-extrabold py-3 px-10 sm:py-4 sm:px-14 rounded-full shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-opacity-70 flex items-center gap-2 transition-all duration-300 transform hover:z-20"
      style={{
        background: `linear-gradient(145deg, ${primaryColor}, ${secondaryColor})`,
        boxShadow: `0 8px 25px ${shadowColor}80`,
        textShadow: '0 1px 2px rgba(0,0,0,0.4)',
      }}
    >
      {text}
    </motion.button>
  </Link>
);

/**
 * Component: Motion Pill for Active Tab Indicator
 */
const ActivePill = () => (
  <motion.div
    layoutId="underline-pill"
    className="absolute inset-0 rounded-full"
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    style={{
      // Dark Glassmorphism Pill
      boxShadow: `
        0 4px 15px rgba(0, 0, 0, 0.4),
        inset 0 0 0 1px ${DARK_BORDER_COLOR},
        inset 0 2px 4px rgba(255, 255, 255, 0.05)
      `,
      background: 'rgba(35, 35, 35, 0.7)',
      backdropFilter: 'blur(10px)',
    }}
  />
);

// ===================================================================
// III. TAB CONTENT COMPONENTS (Incorporating NextTabButton)
// ===================================================================

/**
 * Content Wrapper with Dark Theme styling (Enhanced Dark Card Design)
 * NOTE: Added nextTab property to enable the mobile navigation button
 */
const DarkContentWrapper = ({ children, primary, secondary, nextTab }) => (
  <motion.div
    key={primary}
    initial={{ opacity: 0, y: 30, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: 'spring', damping: 20, stiffness: 150 }}
    className="relative overflow-hidden rounded-[2.5rem] min-h-[450px] flex flex-col items-center justify-center p-8 sm:p-14 mt-6 sm:mt-12 border transform hover:scale-[1.005] transition-transform duration-700 ease-out"
    style={{
      // DARK, RICH BACKGROUND GRADIENTS
      backgroundImage: `
        radial-gradient(100% 70% at 20% 100%, ${primary}15, transparent 70%),
        radial-gradient(90% 60% at 80% 0%, ${secondary}15, transparent 70%),
        linear-gradient(180deg, ${DARK_CARD_COLOR} 0%, ${DARK_CARD_COLOR} 40%, ${DARK_BG_COLOR} 100%)
      `,
      // BORDER & SHADOW: Subtle inner glow, deep outer shadow
      boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 0 2px rgba(255,255,255,0.05)',
      borderColor: DARK_BORDER_COLOR,
      color: LIGHT_TEXT_COLOR
    }}
  >
    <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
      {children}
    </div>
    {/* ⬅️ NEW: Conditionally render the mobile navigation button */}
    {nextTab && (
        <NextTabButton
            currentTab={nextTab.currentTab}
            onNextClick={nextTab.onNextClick}
        />
    )}
  </motion.div>
);


const GoalTrackerTabContent = ({ onNextClick }) => {
  const { primary, secondary } = tabColors['goal-tracker'];
  const shadowColor = tabColors['goal-tracker'].secondary;

  return (
    <DarkContentWrapper
        primary={primary}
        secondary={secondary}
        nextTab={{ currentTab: 'goal-tracker', onNextClick }} // ⬅️ Pass handler
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl sm:text-7xl font-black mb-6 font-display tracking-tighter"
        style={{
          backgroundImage: `linear-gradient(90deg, ${primary}, ${secondary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 3px 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        Growth Flow Tracker
      </motion.h2>
      <p className={`text-lg sm:text-2xl ${MUTED_TEXT_COLOR} mb-12 max-w-lg font-normal leading-relaxed`}>
        Set, visualize, and achieve your personal **growth milestones**. Every step is elegantly tracked and celebrated.
      </p>
      <ContentLinkButton
        href="/dashboard/recovery/goal-tracker"
        text="Start Tracking Goals"
        primaryColor={primary}
        secondaryColor={secondary}
        shadowColor={shadowColor}
      />
    </DarkContentWrapper>
  );
};

const VideosTabContent = ({ onNextClick }) => {
  const { primary, secondary } = tabColors['videos'];
  const shadowColor = tabColors['videos'].secondary;

  return (
    <DarkContentWrapper
        primary={primary}
        secondary={secondary}
        nextTab={{ currentTab: 'videos', onNextClick }} // ⬅️ Pass handler
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl sm:text-7xl font-black mb-6 font-display tracking-tighter"
        style={{
          backgroundImage: `linear-gradient(90deg, ${primary}, ${secondary})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 3px 10px rgba(0, 0, 0, 0.5)',
        }}
      >
        Mindful Viewing Library
      </motion.h2>
      <p className={`text-lg sm:text-2xl ${MUTED_TEXT_COLOR} mb-12 max-w-lg font-normal leading-relaxed`}>
        Discover curated videos for deep **meditation**, positive **affirmation**, and strong **motivation**.
      </p>
      <ContentLinkButton
        href="/dashboard/recovery/videos"
        text="Watch Now"
        primaryColor={primary}
        secondaryColor={secondary}
        shadowColor={shadowColor}
      />
    </DarkContentWrapper>
  );
};

const MusicTabContent = ({ title, link, primaryColor, secondaryColor, playClickSound, currentTab, onNextClick }) => (
  <DarkContentWrapper
        primary={primaryColor}
        secondary={secondaryColor}
        nextTab={{ currentTab, onNextClick }} // ⬅️ Pass handler
    >
    <motion.div
      className="absolute inset-0 z-0 opacity-50 mix-blend-color-dodge pointer-events-none rounded-[2.5rem]"
      animate={{
        scale: [1, 1.03, 1],
        opacity: [0.1, 0.3, 0.1]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        background: `radial-gradient(circle at 50% 50%, ${primaryColor}60, transparent 70%)`
      }}
    />

    <motion.h2
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-5xl sm:text-7xl font-black mb-6 font-display tracking-tighter"
      style={{
        backgroundImage: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 3px 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      {title}
    </motion.h2>
    <p className={`text-lg sm:text-2xl ${MUTED_TEXT_COLOR} mb-12 max-w-lg font-normal leading-relaxed`}>
      Immerse yourself in **calming melodies** and nature sounds designed for deep focus and **relaxation**.
    </p>
    <ContentLinkButton
      href={link}
      text="Explore Library"
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      shadowColor={`${primaryColor}60`}
      onClick={playClickSound}
    />
  </DarkContentWrapper>
);


const GamesTabContent = ({ onNextClick }) => {
    // This is the only component that doesn't use DarkContentWrapper as its root,
    // so we wrap it in a motion.div to contain the mobile-only arrow functionality.
    const currentTab = 'games';

    // Function to handle the click and move to the next tab (Healing Sounds)
    const handleNextClick = () => {
        const nextTab = getNextTab(currentTab);
        onNextClick(nextTab);
    };

    return (
      <motion.div
        // ⬅️ WRAPPER FOR MOBILE ARROW on the games grid
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative" // Relative position for the arrow
      >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mt-6 sm:mt-12">
              {games.map((game, index) => (
                  <Link href={game.link} key={index} passHref>
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{
                              scale: 1.05,
                              boxShadow: '0 18px 45px rgba(0,0,0,0.5)',
                              transition: { duration: 0.3 }
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNextClick} // This will just play sound and navigate on mobile
                          className="group cursor-pointer relative overflow-hidden rounded-3xl transition-all duration-300"
                      >
                          <div
                              className="relative p-5 sm:p-6 rounded-3xl border overflow-hidden min-h-[350px] flex flex-col justify-start"
                              style={{
                                  borderColor: DARK_BORDER_COLOR,
                                  backgroundImage: `
                                      radial-gradient(35% 60% at 15% 0%, ${tabColors['games'].primary}10, transparent 70%),
                                      radial-gradient(30% 50% at 85% 10%, ${tabColors['games'].secondary}10, transparent 70%),
                                      linear-gradient(160deg, ${DARK_CARD_COLOR}, ${DARK_CARD_COLOR} 45%, ${DARK_CARD_COLOR} 100%)
                                  `,
                                  boxShadow: '0 8px 20px rgba(0,0,0,0.4), inset 0 0 1px rgba(255,255,255,0.05)',
                              }}
                          >
                              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-4 aspect-video">
                                  <Image
                                      src={game.imageUrl}
                                      alt={game.name}
                                      width={500}
                                      height={300}
                                      className="rounded-xl sm:rounded-2xl transform group-hover:scale-105 transition-transform duration-700 ease-out object-cover"
                                  />
                              </div>

                              <div className="relative z-10 flex flex-col items-start text-left">
                                  <h2
                                      className={`text-2xl sm:text-3xl font-extrabold mb-1 ${LIGHT_TEXT_COLOR} leading-tight`}
                                      style={{
                                          backgroundImage: `linear-gradient(90deg, ${tabColors['games'].primary}, ${tabColors['games'].secondary})`,
                                          WebkitBackgroundClip: 'text',
                                          WebkitTextFillColor: 'transparent',
                                      }}
                                  >
                                      {game.name}
                                  </h2>
                                  <p className={`text-base sm:text-lg font-light ${MUTED_TEXT_COLOR}`}>
                                      {game.description}
                                  </p>
                              </div>
                          </div>
                      </motion.div>
                  </Link>
              ))}
          </div>
          {/* ⬅️ NEW: Mobile navigation button for the games grid */}
          <NextTabButton
              currentTab={currentTab}
              onNextClick={handleNextClick}
          />
      </motion.div>
    );
};


// ===================================================================
// IV. MAIN COMPONENT
// ===================================================================

export default function RecoveryGameSelectionPage() {
  const [activeTab, setActiveTab] = useState('goal-tracker');
  const [isScrolling, setIsScrolling] = useState(false);
  const backgroundAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  // --- AUDIO EFFECTS (Retained) ---
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

  // ⬅️ NEW: Unified Mobile Navigation Handler
  const handleNextTab = (currentTab) => {
    const nextTab = getNextTab(currentTab);
    handleTabClick(nextTab); // Use existing handler for sound/state update
  };


  // --- SCROLL REFINEMENT (Sticky header shadow) ---
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      // Check if scrolled down past a small threshold
      setIsScrolling(window.scrollY > 10);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Re-check when scroll stops
        setIsScrolling(window.scrollY > 10);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // --- RENDER CURRENT TAB CONTENT ---
  const renderContent = () => {
    switch (activeTab) {
      case 'goal-tracker':
        return <GoalTrackerTabContent onNextClick={() => handleNextTab('goal-tracker')} />;
      case 'videos':
        return <VideosTabContent onNextClick={() => handleNextTab('videos')} />;
      case 'therapy-music':
        return (
          <MusicTabContent
            title="Therapy Music"
            link="/dashboard/recovery/therapymusic"
            primaryColor={tabColors['therapy-music'].primary}
            secondaryColor={tabColors['therapy-music'].secondary}
            playClickSound={playClickSound}
            currentTab="therapy-music" // ⬅️ Pass current tab
            onNextClick={() => handleNextTab('therapy-music')} // ⬅️ Pass handler
          />
        );
      case 'healing-sounds':
        return (
          <MusicTabContent
            title="Healing Sounds"
            link="/dashboard/recovery/healingsounds"
            primaryColor={tabColors['healing-sounds'].primary}
            secondaryColor={tabColors['healing-sounds'].secondary}
            playClickSound={playClickSound}
            currentTab="healing-sounds" // ⬅️ Pass current tab
            onNextClick={() => handleNextTab('healing-sounds')} // ⬅️ Pass handler
          />
        );
      case 'games':
        return (
          <GamesTabContent onNextClick={handleNextTab} /> // ⬅️ Pass handler
        );
      default:
        return null;
    }
  };

  // Function to render the correct button class based on active state
  const getButtonClass = (tabName) => {
    const isActive = activeTab === tabName;
    // const tabColor = tabColors[tabName]?.primary || LIGHT_TEXT_COLOR; // tabColor unused
    return `
      relative px-4 md:px-6 py-2 md:py-3 font-bold text-sm rounded-full transition-all duration-300 z-10
      focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-opacity-70 flex items-center flex-shrink-0 whitespace-nowrap
      ${isActive
        ? 'text-white bg-transparent'
        : `text-white/80 hover:text-white/95 hover:bg-white/5`
      }
      ${!isActive ? `text-shadow-glow-${tabName}` : ''}
    `;
  };

  return (
    <div
      className="py-0 px-0 font-sans min-h-screen"
      style={{
        backgroundImage: `
          radial-gradient(90% 60% at 50% 10%, rgba(59,130,246,0.1), transparent 70%),
          radial-gradient(80% 50% at 80% 80%, rgba(167,139,250,0.08), transparent 70%),
          radial-gradient(70% 40% at 20% 90%, rgba(20,184,166,0.1), transparent 70%),
          linear-gradient(to bottom, ${DARK_BG_COLOR} 0%, #000000 100%)
        `,
        color: LIGHT_TEXT_COLOR,
      }}
    >
      {/* STICKY HEADER WRAPPER (Tabs) */}
      <div
        className={`sticky top-0 z-50 py-4 sm:py-6 border-b transition-all duration-300 ${isScrolling ? 'shadow-2xl' : 'shadow-none'}`}
        style={{
          background: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(20px)',
          borderColor: DARK_BORDER_COLOR,
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex items-center gap-2 md:gap-3 overflow-x-auto whitespace-nowrap rounded-full border p-1 w-full"
            style={{
              borderColor: DARK_BORDER_COLOR,
              backgroundColor: DARK_CARD_COLOR,
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Tab 1: Goal Tracker */}
            <motion.div className="relative flex-shrink-0">
              {activeTab === 'goal-tracker' && <ActivePill />}
              <button onClick={() => handleTabClick('goal-tracker')} className={getButtonClass('goal-tracker')}>
                <TabIcon tabName="goal-tracker" />
                Tracker
              </button>
            </motion.div>

            {/* Tab 2: Videos */}
            <motion.div className="relative flex-shrink-0">
              {activeTab === 'videos' && <ActivePill />}
              <button onClick={() => handleTabClick('videos')} className={getButtonClass('videos')}>
                <TabIcon tabName="videos" />
                Videos
              </button>
            </motion.div>

            {/* Tab 3: Therapy Music */}
            <motion.div className="relative flex-shrink-0">
              {activeTab === 'therapy-music' && <ActivePill />}
              <button onClick={() => handleTabClick('therapy-music')} className={getButtonClass('therapy-music')}>
                <TabIcon tabName="therapy-music" />
                Music
              </button>
            </motion.div>

            {/* Tab 4: Games */}
            <motion.div className="relative flex-shrink-0">
              {activeTab === 'games' && <ActivePill />}
              <button onClick={() => handleTabClick('games')} className={getButtonClass('games')}>
                <TabIcon tabName="games" />
                Games
              </button>
            </motion.div>

            {/* Tab 5: Healing Sounds */}
            <motion.div className="relative flex-shrink-0">
              {activeTab === 'healing-sounds' && <ActivePill />}
              <button onClick={() => handleTabClick('healing-sounds')} className={getButtonClass('healing-sounds')}>
                <TabIcon tabName="healing-sounds" />
                Sounds
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">{renderContent()}</div>
    </div>
  );
}