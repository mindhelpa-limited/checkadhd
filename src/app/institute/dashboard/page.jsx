"use client";

import Link from "next/link";
import { CalendarDays, PlayCircle, BookOpenCheck, Trophy, ArrowRight, Clock } from "lucide-react";

export default function InstituteDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero / Greeting */}
      <section className="rounded-3xl border border-gray-100 bg-white overflow-hidden">
        <div className="relative isolate">
          <div className="absolute inset-0 -z-10 opacity-90">
            <div className="h-28 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB]" />
            <div className="h-28 bg-white" />
          </div>

          <div className="px-6 py-6 sm:px-8">
            <div className="bg-white/70 backdrop-blur rounded-2xl p-5 shadow-sm border border-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Welcome back to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB]">Mindhelpa Institute</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Continue your journey to becoming a <strong>Certified Mental Health Coach</strong>.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    href="/institute/curriculum"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium"
                  >
                    <BookOpenCheck className="w-4 h-4" />
                    View Curriculum
                  </Link>
                  <Link
                    href="/book-a-coach"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow
                               bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] hover:opacity-95"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Practice Coaching
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs / Progress */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Program Progress</p>
          <div className="mt-2 flex items-end justify-between">
            <h3 className="text-3xl font-bold">45%</h3>
            <Trophy className="w-5 h-5 text-[#6E6AFB]" />
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-[45%] bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB]" />
          </div>
          <p className="mt-3 text-sm text-gray-500">9/20 modules completed</p>
        </div>

        <div className="rounded-2xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Next Live Session</p>
          <div className="mt-2 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#4AE3C1]" />
            <h3 className="text-lg font-semibold">Friday, 7:00 PM (WAT)</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Week 3: Applied Practice & Supervision</p>
          <Link href="/institute/dashboard/sessions" className="mt-4 inline-flex items-center gap-1 text-[#6E6AFB] font-medium hover:underline">
            Join details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 p-6">
          <p className="text-sm text-gray-500">Your Pace</p>
          <div className="mt-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#6E6AFB]" />
            <h3 className="text-lg font-semibold">Average 45 mins/day</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">Great consistency. Keep your streak alive!</p>
          <Link href="/recovery/dashboard" className="mt-4 inline-flex items-center gap-1 text-[#6E6AFB] font-medium hover:underline">
            Open Recovery Tools <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Continue Learning */}
      <section className="rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <Link href="/institute/curriculum" className="text-sm text-[#6E6AFB] hover:underline">View all modules</Link>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Module card 1 */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB]" />
            <div className="p-5">
              <h3 className="font-semibold">Module 9: ADHD Coaching Techniques</h3>
              <p className="text-sm text-gray-600 mt-1">Goal setting, accountability rhythms, and cognitive restructuring.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">35% complete</span>
                <Link href="/institute/curriculum#module-9" className="text-sm text-[#6E6AFB] hover:underline">Resume</Link>
              </div>
            </div>
          </div>

          {/* Module card 2 */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB]" />
            <div className="p-5">
              <h3 className="font-semibold">Module 10: Motivational Interviewing</h3>
              <p className="text-sm text-gray-600 mt-1">Structure powerful, empathetic coaching conversations.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">0% complete</span>
                <Link href="/institute/curriculum#module-10" className="text-sm text-[#6E6AFB] hover:underline">Start</Link>
              </div>
            </div>
          </div>

          {/* Module card 3 */}
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB]" />
            <div className="p-5">
              <h3 className="font-semibold">Module 11: Ethics & Safeguarding</h3>
              <p className="text-sm text-gray-600 mt-1">Boundaries, referrals, documentation, and confidentiality.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">0% complete</span>
                <Link href="/institute/curriculum#module-11" className="text-sm text-[#6E6AFB] hover:underline">Start</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/institute/curriculum"
          className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition group"
        >
          <div className="text-sm text-gray-500">Jump back in</div>
          <div className="mt-2 flex items-center justify-between">
            <h3 className="font-semibold">Go to Curriculum</h3>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#6E6AFB]" />
          </div>
        </Link>

        <Link
          href="/coachee"
          className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition group"
        >
          <div className="text-sm text-gray-500">Launch your practice</div>
          <div className="mt-2 flex items-center justify-between">
            <h3 className="font-semibold">Set up Coachee</h3>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#6E6AFB]" />
          </div>
        </Link>

        <Link
          href="/recovery/dashboard"
          className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition group"
        >
          <div className="text-sm text-gray-500">Daily discipline</div>
          <div className="mt-2 flex items-center justify-between">
            <h3 className="font-semibold">Open Recovery Tools</h3>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#6E6AFB]" />
          </div>
        </Link>
      </section>

      {/* Recent Activity */}
      <section className="rounded-2xl border border-gray-100 p-6">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="mt-4 divide-y divide-gray-100">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">Completed Quiz – Module 8</p>
              <p className="text-sm text-gray-600">Score: 86/100</p>
            </div>
            <span className="text-sm text-gray-500">2 days ago</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">Watched Lecture – Module 9</p>
              <p className="text-sm text-gray-600">“Cognitive Restructuring Basics”</p>
            </div>
            <span className="text-sm text-gray-500">3 days ago</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">Joined Live Session</p>
              <p className="text-sm text-gray-600">Week 2 Q&A with Lecturer</p>
            </div>
            <span className="text-sm text-gray-500">1 week ago</span>
          </div>
        </div>
      </section>
    </div>
  );
}
