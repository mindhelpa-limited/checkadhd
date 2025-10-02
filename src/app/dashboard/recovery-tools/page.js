'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

// ===================================================================
// I. UTILITY & CONSTANTS
// ===================================================================

const games = [
    {
        name: 'GoalTracker',
        description: 'Track your personal growth milestones and maintain focus on your objectives.',
        link: '/dashboard/goal-tracker', 
        imageUrl: '/goals.jpg', 
    },
    {
        name: 'Music and Videos',
        description: 'Access curated music and guided videos for relaxation and mindful viewing.',
        link: '/dashboard/resources',
        imageUrl: '/resources.jpg',
    },
];

// UTILITY: Color Mapping
const tabColors = {
    'games': { primary: '#9333EA', secondary: '#EC4899', text: '#9333EA' },
};

// Dark Mode base colors
const DARK_BG_COLOR = '#0A0A0A';
const DARK_CARD_COLOR = '#1A1A1A';
const DARK_BORDER_COLOR = '#2A2A2A';
const LIGHT_TEXT_COLOR = '#F5F5F5';
const MUTED_TEXT_COLOR = '#A3A3A3';

// ===================================================================
// II. SHARED UI COMPONENTS
// ===================================================================

/**
 * Component: Game Card for the selection grid.
 */
const GameCard = ({ game, index }) => {
    const glowColor = tabColors['games'].secondary;

    return (
        <Link href={game.link} key={index} passHref>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: index * 0.15, ease: [0.17, 0.67, 0.83, 0.98] }} 
                whileHover={{
                    scale: 1.05,
                    boxShadow: `0 0 70px ${glowColor}70, 0 10px 40px #000000c0`,
                    transition: { duration: 0.4 }
                }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer relative overflow-hidden rounded-3xl transition-all duration-300 transform-gpu"
                style={{
                    boxShadow: '0 8px 20px rgba(0,0,0,0.7), 0 0 10px rgba(0,0,0,0.3)',
                }}
            >
                <motion.div
                    className="absolute inset-0 rounded-3xl z-10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        boxShadow: `inset 0 0 15px 1px ${glowColor}80, inset 0 0 8px 1px #ffffff20`,
                        border: `2px solid ${glowColor}50`,
                    }}
                />

                <div
                    className="relative p-5 sm:p-7 rounded-3xl border overflow-hidden min-h-[350px] flex flex-col justify-start z-20"
                    style={{
                        borderColor: DARK_BORDER_COLOR,
                        backgroundImage: `
                            radial-gradient(40% 70% at 10% 0%, ${tabColors['games'].primary}15, transparent 70%),
                            radial-gradient(35% 65% at 90% 15%, ${tabColors['games'].secondary}15, transparent 70%),
                            linear-gradient(160deg, ${DARK_CARD_COLOR} 0%, #111111 100%)
                        `,
                        boxShadow: 'inset 0 0 3px rgba(255,255,255,0.08)', 
                    }}
                >
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-5 aspect-video border border-gray-800/50"> 
                        <Image
                            src={game.imageUrl}
                            alt={game.name}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                            fill={true} 
                            className="rounded-xl sm:rounded-2xl transform group-hover:scale-115 transition-transform duration-[800ms] ease-in-out object-cover"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-start text-left">
                        <h2
                            className={`text-2xl sm:text-3xl font-extrabold mb-2 leading-snug`}
                            style={{
                                backgroundImage: `linear-gradient(90deg, ${tabColors['games'].primary}, ${tabColors['games'].secondary})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: `0 0 8px ${tabColors['games'].primary}80`,
                            }}
                        >
                            {game.name} ✨
                        </h2>
                        <p className={`text-base sm:text-lg font-normal ${MUTED_TEXT_COLOR}`}>
                            {game.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};


// ===================================================================
// III. CONTENT COMPONENT (Games/Tools Grid)
// ===================================================================

const GamesTabContent = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative pt-8"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
                {games.map((game, index) => (
                    <GameCard game={game} index={index} key={game.name} />
                ))}
            </div>
        </motion.div>
    );
};


// ===================================================================
// IV. MAIN COMPONENT (Beautiful Layout)
// ===================================================================

// NEW COMPONENT: Animated background element
const AnimatedRadialGlow = () => (
    <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ 
            scale: [1.0, 1.05, 1.0], // Subtle breathing/pulsing
            opacity: [0.5, 0.4, 0.5], 
            rotate: [0, 5, 0] // Gentle, slow rotation
        }}
        transition={{
            duration: 15, // Very slow animation
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
        }}
        style={{
            // A large, soft radial gradient covering a wide area
            background: `radial-gradient(circle at 50% 50%, ${tabColors.games.primary}10 0%, transparent 60%)`,
            // This ensures the animation doesn't stretch the gradient but moves the element itself
            transformOrigin: '50% 50%',
        }}
    />
);


export default function RecoveryGameSelectionPage() {
    
    const clickAudioRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            clickAudioRef.current = new Audio('/sounds/click.mp3');
            clickAudioRef.current.volume = 0.7;
        }

        return () => {
            if (clickAudioRef.current) {
                clickAudioRef.current.pause();
                clickAudioRef.current = null;
            }
        };
    }, []);

    return (
        <div
            className="py-0 px-0 font-sans min-h-screen relative overflow-hidden pt-12 pb-16 sm:pt-0 sm:pb-0" 
            style={{
                // IMPORTANT: Removed the multiple radial gradients from the main div background 
                // to allow the separate AnimatedRadialGlow component to handle the dynamic effect.
                backgroundImage: `linear-gradient(to bottom, ${DARK_BG_COLOR} 0%, #000000 100%)`,
                color: LIGHT_TEXT_COLOR,
            }}
        >
            {/* NEW: The Animated Radial Glow Component */}
            <AnimatedRadialGlow />
            
            {/* Kept Noise Overlay for Texture, moved to z-index 1 for subtlety */}
             <div 
                className="absolute inset-0 pointer-events-none z-[1] opacity-[0.08]"
                style={{
                    backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjQiIG51bU9jdGF2ZXM9IjIiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZGRkZGIi8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzAwMDAwMCIgZmlsdGVyPSJ1cmwjYSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==")',
                    backgroundSize: '400px 400px',
                }}
            />

            <motion.div 
                // Main content is now Z-index 20
                className="relative z-20 max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pb-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2 }}
            >
                {/* --- BEAUTIFUL HEADING --- */}
                <h1 
                    className="text-4xl sm:text-6xl lg:text-7xl font-extrabold pt-12 pb-10 text-center tracking-tight" 
                    style={{
                        backgroundImage: 'linear-gradient(90deg, #FFFFFF, #E0E0E0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(147, 51, 234, 0.6)',
                        letterSpacing: '-0.03em',
                    }}
                >
                    Your Journey Begins Here
                </h1>
                
                {/* Subtitle/Lead-in */}
                <p className={`text-lg sm:text-xl text-center mb-16 font-light ${MUTED_TEXT_COLOR} max-w-2xl mx-auto`}>
                    Select a tool to track your progress and access exclusive resources.
                </p>
                
                <GamesTabContent />
            </motion.div>
        </div>
    );
}