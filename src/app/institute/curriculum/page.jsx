"use client";

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <h1 className="text-4xl font-bold mb-6">Mindhelpa Institute Curriculum</h1>
      <p className="text-lg text-gray-600 mb-4">
        Explore the structured 4-week program designed to certify you as a Mental Health Coach.
        Each week includes modules, self-paced lessons, and live Zoom sessions.
      </p>

      <div className="space-y-6">
        <div className="p-6 bg-gray-100 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">Week 1: Foundations</h2>
          <p>Introduction to Mental Health, coaching ethics, and understanding ADHD, PTSD, and other key conditions.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">Week 2: Tools & Techniques</h2>
          <p>Behavioral assessments, goal setting, guided meditation, and motivational interviewing methods.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">Week 3: Applied Practice</h2>
          <p>Role-play sessions, supervised coaching practice, and AI-powered module quizzes.</p>
        </div>
        <div className="p-6 bg-gray-100 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-2">Week 4: Certification Prep</h2>
          <p>Review of all modules, 100-question final exam, and preparation for your Mindhelpa certification.</p>
        </div>
      </div>
    </div>
  );
}
