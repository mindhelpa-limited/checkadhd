'use client'; // <-- ADDED THIS DIRECTIVE

import React, { useState, useEffect } from 'react';
import { Mail, BookOpen, Music, CheckCircle, Loader2, ArrowRight } from 'lucide-react';

// Main component must be named App and be the default export.
const App = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated API call for email capture
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);

    // Simulate network delay for a realistic loading experience
    setTimeout(() => {
      console.log(`Email captured: ${email}`);
      setIsLoading(false);
      setIsSubmitted(true);
      // In a real application, you would make your actual API call here
    }, 2000);
  };

  // Helper component for the gift cards
  const GiftCard = ({ title, description, icon, imageUrl, colorClass }) => (
    <div className={`p-6 border border-opacity-20 rounded-xl shadow-lg transition duration-300 hover:shadow-2xl ${colorClass}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="p-3 rounded-full bg-opacity-20 backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-gray-400 mb-4">{description}</p>
      <div className="w-full h-40 bg-black rounded-lg overflow-hidden flex items-center justify-center">
        {/* The object-contain class ensures the entire image is visible without cropping. */}
        <img
          src={imageUrl}
          alt={title}
          className="object-contain w-full h-full transform transition duration-500 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null; // prevents infinite loop
            e.target.src = 'https://placehold.co/150x200/374151/ffffff?text=Gift'; // Fallback
          }}
        />
      </div>
    </div>
  );

  // Main Landing Page Content
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

      {/* Main Content Card (using backdrop-blur for a frosted glass effect) */}
      <div className="relative z-10 w-full max-w-4xl bg-gray-800 bg-opacity-70 backdrop-blur-md border border-gray-700 rounded-3xl p-6 sm:p-10 shadow-2xl mt-10 mb-10">

        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400">
            Unlock Your Free Mind Toolkit
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
            Get instant access to two powerful resources designed to inspire, uplift, and center your spirit. Just tell us where to send them!
          </p>
        </header>

        {/* Gifts Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-200">What's Inside Your Free Gift Bundle?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <GiftCard
              title="Ebook: Fortify Your Mind"
              description="A curated collection of motivational writings—powerful lessons on life, living, and personal strength, distilled into a quick-read format."
              icon={<BookOpen className="w-6 h-6 text-emerald-400" />}
              imageUrl="/2ofall.jpeg"
              colorClass="bg-gray-800 hover:border-emerald-500"
            />
            <GiftCard
              title="Music Therapy Catalogue"
              description="Access the links to 6 of our acclaimed Afromusic Therapy Albums, scientifically designed to promote relaxation and focus."
              icon={<Music className="w-6 h-6 text-blue-400" />}
              imageUrl="https://placehold.co/150x200/3b82f6/ffffff?text=Music+Links"
              colorClass="bg-gray-800 hover:border-blue-500"
            />
          </div>
        </section>

        {/* Email Capture Form */}
        <section className="mt-10 p-6 bg-gray-900 rounded-xl shadow-inner border border-gray-700">
          <h2 className="text-3xl font-bold text-center mb-6">Claim Your Gifts Instantly</h2>
          {isSubmitted ? (
            <div className="text-center p-8 bg-emerald-900/30 border border-emerald-500/50 rounded-lg">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-xl font-semibold text-emerald-200">Success! Check your inbox.</p>
              <p className="text-gray-400 mt-2">Your **Free Mind Toolkit** has been successfully sent to **{email}**. Enjoy the Ebook and the Music Catalogue!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your best email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl focus:border-emerald-400 focus:ring focus:ring-emerald-400 focus:ring-opacity-50 text-white placeholder-gray-400 transition"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                className={`flex items-center justify-center px-8 py-3 font-semibold rounded-xl text-lg transition duration-300 transform active:scale-95 ${
                  isLoading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-lg hover:shadow-emerald-500/50'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
        <footer className="mt-10 text-center text-xs text-gray-500">
          <p>We respect your privacy. Your email is safe with us and will only be used to send you your free gifts and future updates.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
