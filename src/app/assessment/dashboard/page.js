"use client";

import Link from "next/link";
import {
  ClipboardList,
  FileBarChart,
  FileText,
  ShieldCheck,
} from "lucide-react";

export default function AssessmentDashboardHome() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          Assessment Dashboard
        </h1>
        <p className="text-gray-600 max-w-2xl">
          Understand what your mind has been trying to tell you. This
          clinically-informed experience mirrors your patterns back to you —
          clearly, gently, and without judgment.
        </p>
      </header>

      {/* Trust/clinical note */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex items-start gap-3">
        <div className="rounded-full p-2 bg-gradient-to-br from-[#4AE3C1]/20 to-[#6E6AFB]/20">
          <ShieldCheck className="text-[#0f172a]" size={18} />
        </div>
        <div>
          <p className="text-sm text-gray-700">
            Built around{" "}
            <span className="font-medium">ASRS + DSM-5</span> screening
            standards. Your results are personalized and form the foundation for
            next steps in Recovery and Coaching.
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Start / Resume Test */}
        <ActionCard
          title="Take / Resume Assessment"
          desc="Complete the ADHD screening (approx 5–7 mins). You can pause and resume anytime."
          href="/assessment/dashboard/adhd-test"
          icon={ClipboardList}
          cta="Begin / Continue"
        />

        {/* Results */}
        <ActionCard
          title="View Results & History"
          desc="See your score timeline and compare changes over time."
          href="/assessment/dashboard/results"
          icon={FileBarChart}
          cta="Open Results"
        />

        {/* Report */}
        <ActionCard
          title="Report & Export"
          desc="Generate a shareable summary for your records or clinician."
          href="/assessment/dashboard/report"
          icon={FileText}
          cta="Generate Report"
        />
      </section>

      {/* Guidance */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">What happens next?</h3>
        <ol className="mt-3 space-y-2 list-decimal list-inside text-gray-700">
          <li>
            Take the ASRS-based screening and receive an instant, personalized
            summary.
          </li>
          <li>
            Use your results to unlock tailored tools in{" "}
            <Link href="/recovery" className="underline decoration-[#6E6AFB] underline-offset-2">
              Recovery
            </Link>{" "}
            (meditations, journaling, goal tracker) and book{" "}
            <Link href="/book-a-coach" className="underline decoration-[#4AE3C1] underline-offset-2">
              Coaching
            </Link>{" "}
            if needed.
          </li>
          <li>
            You can revisit this dashboard anytime to track changes and export
            reports.
          </li>
        </ol>
      </section>
    </div>
  );
}

/* ------------------------------- Subcomponents ------------------------------ */

function ActionCard({ title, desc, href, icon: Icon, cta }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-3">
        <div className="rounded-xl p-2 bg-gradient-to-br from-[#4AE3C1]/20 to-[#6E6AFB]/20">
          <Icon className="text-[#0f172a]" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <p className="text-gray-600 mt-3 flex-1">{desc}</p>

      <Link
        href={href}
        className="mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2
          text-white font-semibold shadow-sm
          bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] hover:opacity-90 transition"
      >
        {cta}
      </Link>
    </div>
  );
}
