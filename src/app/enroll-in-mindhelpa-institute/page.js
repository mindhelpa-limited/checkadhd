"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function InstitutePage() {
  return (
    <main className="bg-white text-gray-900">
      {/* Section 1 – Hero */}
      <section className="relative px-6 md:px-20 py-24 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] text-white text-center md:text-left flex flex-col md:flex-row items-center justify-between">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Coaching That Changes the World — Starting With You
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Step into a purpose-driven career as a{" "}
            <strong>Certified Mental Health Coach</strong>. Transform lives,
            build a global practice, and create financial freedom while making
            impact.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              href="#benefits"
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              Discover Benefits
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-gray-900 transition"
            >
              Enroll Now
            </Link>
          </div>
        </div>
        <div className="mt-12 md:mt-0 md:ml-10">
          <Image
            src="/section1institute.png"
            alt="Mindhelpa Institute"
            width={500}
            height={500}
            className="rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* Section 2 – Benefits */}
      <section
        id="benefits"
        className="px-6 md:px-20 py-24 bg-gray-50 text-center"
      >
        <h2 className="text-4xl font-bold mb-12">
          Why Become a Mental Health Coach?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Transform Lives",
              desc: "Guide people into resilience and clarity. Prevent breakdowns before they happen and restore balance to homes, schools, and workplaces.",
              img: "/section3institute.png",
            },
            {
              title: "Global Career Potential",
              desc: "Coaching is borderless. Deliver sessions online, work with schools, families, or corporations — the world is your market.",
              img: "/section4institute.png",
            },
            {
              title: "Sustainable Income",
              desc: "Turn your calling into a career. With our Coachee platform, manage clients, accept payments, and scale your practice globally.",
              img: "/section5institute.png",
            },
          ].map((b, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-gradient-to-br from-[#4AE3C1]/90 to-[#6E6AFB]/90 text-white shadow-xl hover:scale-105 transition-transform"
            >
              <Image
                src={b.img}
                alt={b.title}
                width={80}
                height={80}
                className="mx-auto mb-4"
              />
              <h3 className="text-2xl font-semibold mb-3">{b.title}</h3>
              <p className="text-white/90">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3 – The Story */}
      <section className="px-6 md:px-20 py-24 bg-gray-900 text-white text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">
            Why Mindhelpa Exists — The Movement
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Mental health support often arrives when it’s too late. Our vision
            is different. We believe in{" "}
            <span className="font-semibold">prevention through coaching</span>.
          </p>
          <p className="mt-4 text-lg text-gray-300 leading-relaxed">
            Coaches are guides, motivators, and protectors of resilience. We’re
            training thousands who will carry this mission into homes,
            businesses, and communities worldwide. This is more than education —
            it’s a revolution in mental health.
          </p>
        </div>
        <Image
          src="/section2institute.png"
          alt="Why Coaching Matters"
          width={500}
          height={500}
          className="rounded-2xl shadow-2xl"
        />
      </section>

      {/* Section 4 – What You Get */}
      <section className="px-6 md:px-20 py-24 bg-gray-50">
        <h2 className="text-4xl font-bold mb-12 text-center">
          What’s Included When You Enroll
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <ul className="space-y-4 text-lg">
            {[
              "1-month training program with 20 modules",
              "Weekly 90-min live practice labs",
              "Certification as a Mental Health Coach",
              "1-year free access to Recovery Tools",
              "1-year free subscription to Coachee platform",
              "Listing in the Mindhelpa Global Coach Directory",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="text-[#4AE3C1] w-6 h-6 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <Image
            src="/section6institute.png"
            alt="What You Get"
            width={500}
            height={500}
            className="rounded-2xl shadow-lg"
          />
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/curriculum"
            className="px-8 py-4 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            View Full Curriculum
          </Link>
        </div>
      </section>

      {/* Section 5 – Tuition */}
      <section className="px-6 md:px-20 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6">Your Investment</h2>
        <div className="max-w-2xl mx-auto p-10 rounded-2xl shadow-2xl bg-gradient-to-br from-[#4AE3C1] to-[#6E6AFB] text-white">
          <p className="text-lg mb-4">Enroll today for</p>
          <p className="text-5xl font-extrabold mb-4">£1,500</p>
          <p className="text-lg mb-6">
            Includes training, certification, Recovery Tools, Coachee platform,
            and global listing. Everything you need to start strong.
          </p>
          <Link
            href="/signup"
            className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold shadow hover:scale-105 transition-transform"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      {/* Section 6 – Call to Action */}
      <section className="px-6 md:px-20 py-24 bg-gray-900 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">
          This Is More Than a Course. It’s a Calling.
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-10 text-gray-300">
          When you step into coaching, you step into leadership, healing, and
          opportunity. Join the global Mindhelpa movement and begin building a
          future where prevention is the new standard for mental health.
        </p>
        <Link
          href="/signup"
          className="px-8 py-4 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Begin Your Journey
        </Link>
      </section>
    </main>
  );
}
