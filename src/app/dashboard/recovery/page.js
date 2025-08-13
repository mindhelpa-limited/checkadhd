'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

const games = [
  {
    name: 'MoneyStack',
    description: 'Stack the blocks with focus and precision. Great for improving attention.',
    link: '/dashboard/recovery/moneystack',
    imageUrl: '/images/blockstack.png',
  },
  {
    name: 'Snakegame',
    description: 'Eat all the dots while navigating obstacles. Helps with timing and control.',
    link: '/dashboard/recovery/snakegame',
    imageUrl: '/images/trailmuncher.png',
  },
  {
    name: 'Pingmoney game',
    description: 'Bounce within the bounds. Supports quick decision making.',
    link: '/dashboard/recovery/pingmoneygame',
    imageUrl: '/images/neuralbounds.png',
  },
];

export default function RecoveryGameSelectionPage() {
  const [activeTab, setActiveTab] = useState('games');
  const backgroundAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    backgroundAudioRef.current = new Audio('/meditation.mp3');
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = 0.5;

    clickAudioRef.current = new Audio('/click.mp3');
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
      clickAudioRef.current.play().catch(e => console.error("Click sound playback failed:", e));
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    playClickSound();
  };

  const handleGameClick = () => {
    playClickSound();
  };

  const MusicTabContent = ({ title, link }) => (
    <div className="relative overflow-hidden rounded-3xl h-[450px] flex flex-col items-center justify-center text-white p-8 mt-10 shadow-2xl bg-gray-800 border border-gray-700">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="w-full h-full"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage:
              'linear-gradient(270deg, #1b0a3a, #23115c, #2a186b, #23115c, #1b0a3a)',
            backgroundSize: '400% 400%',
          }}
        ></motion.div>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/2 bg-blue-400/20 filter blur-3xl opacity-50"
          initial={{ scaleX: 0.5, y: '50%', rotate: 15 }}
          animate={{
            scaleX: [0.5, 1, 0.5],
            y: ['50%', '40%', '50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        ></motion.div>
      </motion.div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold mb-4 font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400"
        >
          {title}
        </motion.h2>
        <p className="text-xl text-white/80 mb-8 max-w-lg font-light">
          Immerse yourself in a world of calming melodies and sounds designed for deep focus and relaxation.
        </p>
        <Link href={link}>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#3b82f6', color: '#ffffff' }}
            whileTap={{ scale: 0.95 }}
            onClick={playClickSound}
            className="bg-blue-500 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:rotate-2 hover:scale-110"
          >
            Explore Library 🎵
          </motion.button>
        </Link>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'games':
        return (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-10">
            {games.map((game, index) => (
              <Link href={game.link} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 1, boxShadow: '0 10px 40px rgba(76, 175, 230, 0.3)' }}
                  onClick={handleGameClick}
                  className="group cursor-pointer relative overflow-hidden rounded-3xl transition-all duration-300 transform hover:z-10"
                >
                  <div className="absolute inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition duration-500 blur-md"></div>
                  <div className="relative p-6 rounded-[calc(1.5rem+0.5px)] shadow-2xl transition-all overflow-hidden bg-gray-900 border border-gray-700">
                    <div className="relative overflow-hidden rounded-2xl mb-4 aspect-w-16 aspect-h-9">
                      <Image
                        src={game.imageUrl}
                        alt={game.name}
                        width={500}
                        height={300}
                        className="rounded-2xl transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <h2 className="text-3xl font-bold text-white mb-2">{game.name}</h2>
                      <p className="text-white/70 text-base font-light">{game.description}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        );
      case 'therapy-music':
        return <MusicTabContent title="Therapy Music" link="/dashboard/recovery/therapymusic" />;
      case 'healing-sounds':
        return <MusicTabContent title="Healing Sounds" link="/dashboard/recovery/healingsounds" />;
      default:
        return null;
    }
  };

  const getButtonClass = (tabName) => `
    px-8 py-4 font-semibold text-xl transition-colors duration-200 relative
    ${activeTab === tabName
      ? 'text-cyan-400'
      : 'text-gray-400 hover:text-white'
    }
  `;

  return (
    <div className="py-8 px-0 text-white font-sans">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold mb-4 font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 drop-shadow-lg"
        >
          Recovery & Growth
        </motion.h1>
        <p className="text-xl text-white/60 max-w-lg mx-auto font-light">
          Choose a path to enhance your focus, control, and relaxation.
        </p>
      </div>

      <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-700 max-w-6xl mx-auto mb-10 md:justify-center">
        <button onClick={() => handleTabClick('games')} className={getButtonClass('games')}>
          Games
          {activeTab === 'games' && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 w-full h-1 bg-cyan-400 rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
        <button onClick={() => handleTabClick('therapy-music')} className={`${getButtonClass('therapy-music')} ml-8`}>
          Therapy Music
          {activeTab === 'therapy-music' && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 w-full h-1 bg-cyan-400 rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
        <button onClick={() => handleTabClick('healing-sounds')} className={`${getButtonClass('healing-sounds')} ml-8`}>
          Healing Sounds
          {activeTab === 'healing-sounds' && (
            <motion.div
              layoutId="underline"
              className="absolute bottom-0 left-0 w-full h-1 bg-cyan-400 rounded-full"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}