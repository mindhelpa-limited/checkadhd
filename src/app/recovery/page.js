"use client";

import Image from "next/image";
import Link from "next/link";

export default function RecoveryPage() {
  return (
    <main className="bg-white text-gray-900">
      {/* Section 1 – Hero */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] text-white">
        <div className="max-w-xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Recovery Tools for Everyday Healing
          </h1>
          <p className="text-lg md:text-xl">
            Daily practices that calm your mind, strengthen your spirit,  
            and help you move forward — one step at a time.
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-white text-gray-900 rounded-full font-semibold shadow hover:opacity-90 transition"
          >
            Start Your Recovery
          </Link>
        </div>
        <div className="mt-10 md:mt-0 md:ml-10">
          <Image
            src="/section1recovery.png"
            alt="Recovery Hero"
            width={500}
            height={500}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Section 2 – Journaling & Visualization */}
      <section className="px-6 md:px-20 py-16 grid md:grid-cols-2 gap-12 items-center">
        <Image
          src="/section2recovery.png"
          alt="Journaling"
          width={500}
          height={500}
          className="rounded-2xl shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4">Journaling & Visualization</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Write down how you feel. Capture your thoughts, your wins,  
            and your moments of clarity. Visualization guides you to see the  
            future you are working towards — steady, focused, and free.
          </p>
        </div>
      </section>

      {/* Section 3 – Daily Goal Tracker */}
      <section className="px-6 md:px-20 py-16 bg-gray-50 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Your Personal Goal Tracker</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Every day, set three main goals. Every week, set three priorities.  
            Our AI reminders keep you on track, celebrating your wins and  
            pushing you gently when needed. Growth becomes second nature.
          </p>
          <div className="mt-6">
            <Link
              href="/signup"
              className="px-6 py-3 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] text-white rounded-full font-semibold shadow hover:opacity-90"
            >
              Try the Goal Tracker
            </Link>
          </div>
        </div>
        <Image
          src="/section3recovery.png"
          alt="Goal Tracker"
          width={500}
          height={500}
          className="rounded-2xl shadow-lg"
        />
      </section>

      {/* Section 4 – Streaks & Motivation */}
      <section className="px-6 md:px-20 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Stay Motivated With Streaks</h2>
        <Image
          src="/section4recovery.png"
          alt="Streak Rewards"
          width={500}
          height={500}
          className="mx-auto rounded-2xl shadow-lg mb-6"
        />
        <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Consistency is power. The more you show up, the stronger you get.  
          At 3 days, you’re a Captain. At 7 days, a Major. One month — a Colonel.  
          One year of steady healing, and you rise as a Field Marshal of recovery.  
          Every streak tells your story of resilience.
        </p>
      </section>

      {/* Section 5 – Tools for Peace */}
      <section className="px-6 md:px-20 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold mb-12 text-center">Your Tools for Peace</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition text-center">
            <Image src="/section5recovery.png" alt="Music Therapy" width={100} height={100} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Music Therapy</h3>
            <p className="text-gray-600">Healing sounds to restore balance and focus.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition text-center">
            <Image src="/section6recovery.png" alt="Meditation" width={100} height={100} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Meditation</h3>
            <p className="text-gray-600">7-minute guided practices to center your mind daily.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition text-center">
            <Image src="/section7recovery.png" alt="Affirmations" width={100} height={100} className="mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Affirmations</h3>
            <p className="text-gray-600">Grounded truths that remind you of your worth and strength.</p>
          </div>
        </div>
      </section>

      {/* Section 6 – Call to Action */}
      <section className="px-6 md:px-20 py-20 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Your Recovery Starts Today</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Healing isn’t just possible — it’s within your reach.  
          With daily tools, guidance, and a community behind you,  
          you are never alone in this journey.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold shadow hover:opacity-90"
          >
            Start Recovery
          </Link>
          <Link
            href="/assessment"
            className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold shadow hover:opacity-90"
          >
            Take an Assessment
          </Link>
        </div>
      </section>
    </main>
  );
}
