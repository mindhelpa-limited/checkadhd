'use client';

import React, { useState } from 'react';
import { Mail, BookOpen, Music, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

// --- Gift Card Component (Optimized for Large Image) ---------------------------
/**
 * A reusable card component to display a gift/resource with a title, description,
 * icon, and a large image placeholder.
 * @param {object} props - Component props.
 * @param {string} props.title - The title of the gift.
 * @param {string} props.description - A brief description of the gift.
 * @param {React.ReactNode} props.icon - The Lucide icon component.
 * @param {string} props.imageUrl - The URL for the gift image.
 * @param {string} props.colorClass - Tailwind class for custom styling/hover effects.
 */
const GiftCard = ({ title, description, icon, imageUrl, colorClass }) => (
  <div className={`p-6 border border-opacity-20 rounded-xl shadow-2xl transition duration-300 transform hover:scale-[1.02] ${colorClass}`}>
    <div className="flex items-start space-x-4 mb-4">
      <div className="p-3 rounded-full bg-opacity-20 backdrop-blur-sm flex-shrink-0">
        {icon}
      </div>
      <h3 className="text-2xl font-bold leading-tight mt-1">{title}</h3>
    </div>
    <p className="text-gray-400 mb-6 text-sm">{description}</p>
    {/* CHANGE: Increased height significantly from h-64 to h-96 (24rem) for a large image */}
    <div className="w-full h-96 bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center p-2">
      <img
        src={imageUrl}
        alt={title}
        className="object-cover w-full h-full rounded-md shadow-xl transition duration-500 hover:scale-105"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://placehold.co/250x384/374151/ffffff?text=LARGE+GIFT'; // Fallback text updated
        }}
      />
    </div>
  </div>
);

// --- Main App Component --------------------------------------------------------
const App = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated API call for email capture
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      console.log(`Email captured: ${email}`);
      setIsLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen text-white bg-gray-900 font-sans flex flex-col items-center p-4 sm:p-8 relative overflow-hidden">

      {/* Background Blur Gradient (The "Blur Gradient" effect) */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Tailwind Animation CSS for the background blobs */}
      <style>{`
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.9);
          }
        }
      `}</style>

      {/* Main Content Card (Frosted Glass Effect) */}
      <div className="relative z-10 w-full max-w-5xl bg-gray-800 bg-opacity-80 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 sm:p-12 shadow-[0_0_80px_rgba(30,215,96,0.2)] mt-10 mb-10">

        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-blue-300">
            The Free Mind Toolkit
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Unlock instant access to two powerful resources designed to inspire, uplift, and center your spirit. Just tell us where to send your gifts!
          </p>
        </header>

        {/* Gifts Section */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-200">Your Exclusive Bundle</h2>
          <div className="grid lg:grid-cols-2 gap-10">
            <GiftCard
              title="Ebook: Fortify Your Mind"
              description="A curated collection of motivational writings—powerful lessons on life, living, and personal strength, distilled into a quick-read format."
              icon={<BookOpen className="w-7 h-7 text-emerald-400" />}
              imageUrl="/2ofall.jpeg"
              colorClass="bg-gray-800/60 hover:border-emerald-500/80"
            />
            <GiftCard
              title="Music Therapy Catalogue"
              description="Access the links to 6 of our acclaimed Afromusic Therapy Albums, scientifically designed to promote relaxation and focus."
              icon={<Music className="w-7 h-7 text-blue-400" />}
              imageUrl="/mymusic.jpeg"
              colorClass="bg-gray-800/60 hover:border-blue-500/80"
            />
          </div>
        </section>

        {/* Email Capture Form */}
        <section className="mt-10 p-8 bg-gray-900/70 rounded-2xl shadow-inner border border-gray-700/50">
          <h2 className="text-3xl font-extrabold text-center mb-6">Claim Your Gifts Instantly</h2>
          {isSubmitted ? (
            <div className="text-center p-10 bg-emerald-900/40 border border-emerald-500/60 rounded-xl">
              <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
              <p className="text-2xl font-bold text-emerald-200">Success! Check your Inbox.</p>
              <p className="text-gray-400 mt-3 max-w-lg mx-auto">Your **Free Mind Toolkit** has been successfully sent to **{email}**. Enjoy the Ebook and the Music Catalogue!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-center max-w-2xl mx-auto">
              <div className="flex items-center gap-3 flex-grow w-full">
                <Mail className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your best email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-50 text-white placeholder-gray-400 transition"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className={`w-full md:w-auto flex items-center justify-center px-10 py-3 font-bold rounded-xl text-lg transition duration-300 transform active:scale-95 whitespace-nowrap ${
                  isLoading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-xl shadow-emerald-500/30'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                ) : (
                  <>
                    Send My Gifts <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>We respect your privacy. Your email is safe with us and will only be used to send you your free gifts and future updates.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;