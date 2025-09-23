"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import { getIdToken } from "firebase/auth";

/* ---------- Pricing Data ---------- */
const PRICES = {
  individual: [
    { key: "monthly", name: "Monthly", sessions: 4, price: 1000 },
    { key: "quarterly", name: "Quarterly", sessions: 12, price: 2900 },
    { key: "sixMonths", name: "6 Months", sessions: 24, price: 5650 },
    { key: "yearly", name: "Yearly", sessions: 48, price: 10000 },
  ],
  groupSmall: [
    { key: "monthly", name: "Monthly", sessions: 4, price: 2000 },
    { key: "quarterly", name: "Quarterly", sessions: 12, price: 5800 },
    { key: "sixMonths", name: "6 Months", sessions: 24, price: 10300 },
    { key: "yearly", name: "Yearly", sessions: 48, price: 20000 },
  ],
  groupLarge: [
    { key: "monthly", name: "Monthly", sessions: 4, price: 4000 },
    { key: "quarterly", name: "Quarterly", sessions: 12, price: 11000 },
    { key: "sixMonths", name: "6 Months", sessions: 24, price: 21000 },
    { key: "yearly", name: "Yearly", sessions: 48, price: 40000 },
  ],
};

const CATEGORY_META = {
  individual: {
    title: "Individual Coaching",
    subtitle:
      "One-on-one sessions designed for deep, focused personal progress with a consistent clinician.",
  },
  groupSmall: {
    title: "Group Coaching (1–5 persons)",
    subtitle:
      "Perfect for families and small teams seeking shared tools, accountability, and guided practice.",
  },
  groupLarge: {
    title: "Group Coaching (5–10 persons)",
    subtitle:
      "Ideal for schools and organizations—structured facilitation with measurable outcomes.",
  },
};

/* ---------- Availability Helpers ---------- */
// Weekdays: Mon–Fri → 19:00–23:00 (7–11pm)
// Weekends: Sat–Sun → 09:00–23:00 (9am–11pm)
const WEEKDAY_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const WEEKEND_DAYS = ["Sat", "Sun"];

function genHourLabels(start24, end24) {
  const out = [];
  for (let h = start24; h < end24; h++)
    out.push(`${fmtHour(h)} – ${fmtHour(h + 1)}`);
  return out;
}
function fmtHour(h24) {
  const h = ((h24 + 11) % 12) + 1;
  return `${h}${h24 < 12 ? "am" : "pm"}`;
}
const WEEKDAY_SLOTS = genHourLabels(19, 23);
const WEEKEND_SLOTS = genHourLabels(9, 23);

/* ---------- Details per Plan (no placeholders) ---------- */
function planDetails(categoryKey) {
  const common = [
    "60-minute live session(s) with Dr. Kelvin Alaneme.",
    "Evidence-based coaching focused on clarity, routines, and sustainable habit change.",
    "Session recap with action steps to keep you consistent.",
    "Private client portal for goals, journaling, and progress tracking.",
  ];
  if (categoryKey === "individual") {
    return [
      ...common,
      "Full attention on your personal goals and challenges.",
      "Flexible cadence aligned to your energy and schedule.",
      "Optional accountability check-ins between sessions.",
    ];
  }
  if (categoryKey === "groupSmall") {
    return [
      ...common,
      "Intimate group dynamics (1–5) for shared learning and mutual accountability.",
      "Family/small team goal-setting with measurable milestones.",
      "Guided reflection to normalize challenges and celebrate progress.",
    ];
  }
  return [
    ...common,
    "Scaffolded facilitation for larger cohorts (5–10).",
    "Structured curriculum with measurable outcomes for schools/businesses.",
    "Light breakout formats for participation without pressure.",
  ];
}

/* ---------- Small UI Components ---------- */
function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-full text-sm font-semibold transition",
        active
          ? "text-white bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] shadow"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function PlanCard({ plan, currency = "£", onDetails, onSelect, expanded, bullets }) {
  return (
    <div className="border rounded-xl p-5 shadow-sm hover:shadow transition bg-white">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-lg font-bold text-gray-900">{plan.name}</h4>
          <p className="text-sm text-gray-600">{plan.sessions} session(s)</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-gray-900">
            {currency}
            {plan.price.toLocaleString("en-GB")}
          </div>
          <div className="text-xs text-gray-500">incl. all features</div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onDetails}
          className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
        >
          {expanded ? "Hide details" : "View details"}
        </button>
        <button
          onClick={onSelect}
          className="ml-auto px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] hover:opacity-90"
        >
          Select Plan
        </button>
      </div>

      {expanded && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SlotBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-sm border rounded-lg px-3 py-2 transition",
        active
          ? "bg-indigo-600 border-indigo-600 text-white"
          : "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ---------- Drawer (Selected Slots Sidebar) ---------- */
function Drawer({
  open,
  onClose,
  coachName,
  title,
  plan,
  selected,
  required,
  onRemove,
  onClear,
  onConfirm,
}) {
  const pct = required
    ? Math.min(100, Math.round((selected.length / required) * 100))
    : 0;
  const ready = required > 0 && selected.length === required;

  return (
    <>
      {/* Overlay */}
      <div
        className={[
          "fixed inset-0 bg-black/40 transition-opacity z-40",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
        onClick={onClose}
      />
      {/* Drawer */}
      <aside
        className={[
          "fixed z-50 top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">Your Selection</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 rounded-lg px-2 py-1"
          >
            Close
          </button>
        </div>

        <div className="p-5 space-y-4 h-[calc(100%-64px)] overflow-y-auto">
          {/* Summary */}
          <div className="rounded-xl border p-4">
            <p className="text-sm text-gray-500">Coach</p>
            <p className="font-semibold text-gray-900">{coachName}</p>

            <div className="mt-3">
              <p className="text-sm text-gray-500">Category / Plan</p>
              <p className="font-semibold text-gray-900">
                {title} — {plan?.name}
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Selected <strong>{selected.length}</strong> / {required}
                </span>
                <span className="text-gray-600">{pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 mt-1 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="mt-4 text-2xl font-extrabold text-gray-900">
              £{plan?.price?.toLocaleString("en-GB")}
            </div>
          </div>

          {/* Selected list */}
          <div className="rounded-xl border p-4">
            <p className="font-semibold text-gray-900 mb-2">Chosen Slots</p>
            {selected.length === 0 ? (
              <p className="text-sm text-gray-500">No slots selected yet.</p>
            ) : (
              <ul className="space-y-2">
                {selected.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-gray-800">
                      {s.day} — {s.time}
                    </span>
                    <button
                      onClick={() => onRemove(s.id)}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={onClear}
                className="px-4 py-2 rounded-lg border bg-white text-gray-800 hover:bg-gray-50 text-sm font-semibold"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* CTA appears only when ready */}
          <div className={ready ? "block" : "hidden"}>
            <button
              onClick={onConfirm}
              className="w-full px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] hover:opacity-90"
            >
              Confirm & Pay
            </button>
            <p className="mt-2 text-xs text-gray-500 text-center">
              You’ll be redirected to checkout after confirming.
            </p>
          </div>

          {!ready && (
            <p className="text-center text-sm text-gray-600">
              Select{" "}
              <strong>{Math.max(0, (required || 0) - selected.length)}</strong>{" "}
              more slot
              {Math.max(0, (required || 0) - selected.length) === 1 ? "" : "s"}{" "}
              to enable checkout.
            </p>
          )}
        </div>
      </aside>
    </>
  );
}

/* ---------- Main Page ---------- */
export default function BookACoach() {
  const [category, setCategory] = useState("individual"); // individual | groupSmall | groupLarge
  const [expandedKey, setExpandedKey] = useState(null); // which plan's details are open
  const [selectedPlan, setSelectedPlan] = useState(null); // { key, name, sessions, price }
  const [selected, setSelected] = useState([]); // [{day, time, id}]
  const [drawerOpen, setDrawerOpen] = useState(false);

  const meta = CATEGORY_META[category];
  const plans = PRICES[category];
  const bullets = useMemo(() => planDetails(category), [category]);

  const requiredCount = selectedPlan?.sessions ?? 0;
  const coach = { id: "dr_kelvin", name: "Dr. Kelvin Alaneme", photo: "/kelvin.png" };

  const isSelected = (id) => selected.some((s) => s.id === id);
  const openDrawerIfNeeded = () => {
    if (!drawerOpen) setDrawerOpen(true);
  };

  const toggleSlot = (dayLabel, timeLabel) => {
    const id = `${dayLabel}__${timeLabel}`;
    if (isSelected(id)) {
      setSelected((prev) => prev.filter((s) => s.id !== id));
    } else {
      if (selected.length >= requiredCount) return;
      setSelected((prev) => [...prev, { day: dayLabel, time: timeLabel, id }]);
      openDrawerIfNeeded();
    }
  };

  const removeSlot = (id) =>
    setSelected((prev) => prev.filter((s) => s.id !== id));
  const clearSelection = () => setSelected([]);

  const onConfirm = async () => {
    try {
      const user = auth.currentUser;
      let idToken = null;
      let email = "";

      if (user) {
        idToken = await getIdToken(user);
        email = user.email; // 👈 auto populate with logged in email
      }

      const res = await fetch("/api/create-booking-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          coachId: coach.id,
          coachName: coach.name,
          category,
          plan: selectedPlan,
          slots: selected,
          email, // 👈 pass email if logged in
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error creating checkout session");
      }
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  // Auto-close drawer if plan changes or selection cleared
  useEffect(() => {
    if (selected.length === 0) setDrawerOpen(false);
  }, [selected.length]);

  return (
    <main className="min-h-screen bg-gray-50 py-10 md:py-14 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Coach Header */}
        <section className="bg-white shadow-lg rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center mb-10">
          <Image
            src={coach.photo}
            alt={coach.name}
            width={140}
            height={140}
            className="rounded-full object-cover"
            priority
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Book {coach.name}
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Mental Health Coaching with a clear, structured path: set goals,
              build habits, and keep momentum. Choose your category and plan,
              then pick your session times.
              <br />
              <span className="text-gray-500 text-sm">
                Weekdays: 7–11pm • Weekends: 9am–11pm • One-hour per session
              </span>
            </p>
          </div>
        </section>

        {/* Category Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Pill
            active={category === "individual"}
            onClick={() => {
              setCategory("individual");
              setExpandedKey(null);
              setSelectedPlan(null);
              setSelected([]);
              setDrawerOpen(false);
            }}
          >
            Individual
          </Pill>
          <Pill
            active={category === "groupSmall"}
            onClick={() => {
              setCategory("groupSmall");
              setExpandedKey(null);
              setSelectedPlan(null);
              setSelected([]);
              setDrawerOpen(false);
            }}
          >
            Group (1–5)
          </Pill>
          <Pill
            active={category === "groupLarge"}
            onClick={() => {
              setCategory("groupLarge");
              setExpandedKey(null);
              setSelectedPlan(null);
              setSelected([]);
              setDrawerOpen(false);
            }}
          >
            Group (5–10)
          </Pill>
        </div>

        {/* Meta */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{meta.title}</h2>
          <p className="text-gray-600 mt-2">{meta.subtitle}</p>
        </div>

        {/* Plan Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((p) => (
            <PlanCard
              key={p.key}
              plan={p}
              expanded={expandedKey === p.key}
              bullets={bullets}
              onDetails={() => setExpandedKey(expandedKey === p.key ? null : p.key)}
              onSelect={() => {
                setSelectedPlan(p);
                setSelected([]);
                setDrawerOpen(false);
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }}
            />
          ))}
        </section>

        {/* Booking Form */}
        {selectedPlan && (
          <section className="mt-10 bg-white shadow-lg rounded-3xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900">
                  {meta.title} — {selectedPlan.name}
                </h3>
                <p className="text-gray-600">
                  Select exactly <strong>{selectedPlan.sessions}</strong>{" "}
                  one-hour slot
                  {selectedPlan.sessions > 1 ? "s" : ""}.
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-gray-900">
                  £{selectedPlan.price.toLocaleString("en-GB")}
                </div>
                <div className="text-xs text-gray-500">inclusive</div>
              </div>
            </div>

            {/* Weekdays */}
            <div className="mt-6">
              <h4 className="text-lg font-bold text-gray-800 mb-3">
                Weekdays (Mon–Fri) — 7pm to 11pm
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {WEEKDAY_DAYS.map((day) => (
                  <div key={day} className="border rounded-xl p-3">
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      {day}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {WEEKDAY_SLOTS.map((time) => {
                        const id = `${day}__${time}`;
                        const active = isSelected(id);
                        return (
                          <SlotBtn
                            key={id}
                            active={active}
                            onClick={() => {
                              if (!active && selected.length >= selectedPlan.sessions)
                                return;
                              toggleSlot(day, time);
                            }}
                          >
                            {time}
                          </SlotBtn>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekends */}
            <div className="mt-8">
              <h4 className="text-lg font-bold text-gray-800 mb-3">
                Weekends (Sat–Sun) — 9am to 11pm
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WEEKEND_DAYS.map((day) => (
                  <div key={day} className="border rounded-xl p-3">
                    <div className="text-sm font-semibold text-gray-800 mb-2">
                      {day}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {WEEKEND_SLOTS.map((time) => {
                        const id = `${day}__${time}`;
                        const active = isSelected(id);
                        return (
                          <SlotBtn
                            key={id}
                            active={active}
                            onClick={() => {
                              if (!active && selected.length >= selectedPlan.sessions)
                                return;
                              toggleSlot(day, time);
                            }}
                          >
                            {time}
                          </SlotBtn>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inline summary (still keep for context) */}
            <div className="mt-8 border-t pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Selected <strong>{selected.length}</strong> /{" "}
                    {selectedPlan.sessions} required
                  </p>
                  {selected.length > 0 ? (
                    <ul className="mt-2 text-sm text-gray-800 list-disc list-inside space-y-1 max-h-36 overflow-auto">
                      {selected.map((s) => (
                        <li key={s.id}>
                          {s.day} — {s.time}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      No slots selected yet.
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={clearSelection}
                    className="px-4 py-2 rounded-lg border text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    Clear
                  </button>
                  {/* Open the drawer manually if user wants */}
                  <button
                    onClick={() => setDrawerOpen(true)}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] hover:opacity-90"
                  >
                    Review Selection
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Side Drawer */}
      {selectedPlan && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          coachName={coach.name}
          title={meta.title}
          plan={selectedPlan}
          selected={selected}
          required={selectedPlan.sessions}
          onRemove={removeSlot}
          onClear={clearSelection}
          onConfirm={onConfirm}
        />
      )}
    </main>
  );
}