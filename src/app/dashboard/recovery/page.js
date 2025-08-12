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
    // Initialize background music
    backgroundAudioRef.current = new Audio('/meditation.mp3');
    backgroundAudioRef.current.loop = true;
    backgroundAudioRef.current.volume = 0.5;

    // Initialize click sound
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
      clickAudioRef.current.currentTime = 0; // Rewind to the start
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
    <div className="relative overflow-hidden rounded-xl h-[400px] flex flex-col items-center justify-center text-white p-6 mt-10">
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
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundImage:
              'linear-gradient(270deg, #3a0ca3, #4361ee, #4cc9f0, #4361ee, #3a0ca3)',
            backgroundSize: '400% 400%',
          }}
        ></motion.div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/2 bg-white/10 filter blur-3xl opacity-50"
          initial={{ scaleX: 0.5, y: '50%', rotate: 15 }}
          animate={{
            scaleX: [0.5, 1, 0.5],
            y: ['50%', '40%', '50%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        ></motion.div>
      </motion.div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold mb-4 font-display"
        >
          {title}
        </motion.h2>
        <p className="text-lg mb-8 max-w-lg">
          Dive into a world of calming melodies and sounds designed to help you relax and focus.
        </p>
        <Link href={link}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={playClickSound} // Added onClick handler
            className="bg-white text-blue-800 font-bold py-3 px-8 rounded-full shadow-lg transition-all"
          >
            Explore Library
          </motion.button>
        </Link>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'games':
        return (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto mt-10 p-6">
            {games.map((game, index) => (
              <Link href={game.link} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(129, 140, 248, 0.5)' }}
                  onClick={handleGameClick} // Added onClick handler
                  className="group cursor-pointer rounded-2xl transition-all relative overflow-hidden"
                >
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                  <div className="relative p-6 rounded-[calc(1rem+0.5px)] shadow-xl transition-all overflow-hidden bg-gray-900 border border-white/20">
                    <Image
                      src={game.imageUrl}
                      alt={game.name}
                      width={500}
                      height={300}
                      className="rounded-lg mb-4 transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <h2 className="text-2xl font-bold text-white mb-2">{game.name}</h2>
                      <p className="text-white/80 text-sm">{game.description}</p>
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
    px-6 py-3 font-semibold text-lg transition-colors duration-200
    ${activeTab === tabName
      ? 'text-white border-b-2 border-blue-500'
      : 'text-gray-400 hover:text-white'
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a122a] to-[#1a233b] py-20 px-6 text-white">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold mb-4 font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
        >
          Recovery & Growth
        </motion.h1>
      </div>

      <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-700 max-w-6xl mx-auto mb-10 md:justify-center">
        <button
          onClick={() => handleTabClick('games')}
          className={getButtonClass('games')}
        >
          Games
        </button>
        <button
          onClick={() => handleTabClick('therapy-music')}
          className={`${getButtonClass('therapy-music')} ml-6`}
        >
          Therapy Music
        </button>
        <button
          onClick={() => handleTabClick('healing-sounds')}
          className={`${getButtonClass('healing-sounds')} ml-6`}
        >
          Healing Sounds
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}