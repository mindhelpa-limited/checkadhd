"use client";

import { useState, useEffect } from "react";

export default function EarningsPage() {
  const [earnings, setEarnings] = useState({
    total: 3250,
    monthly: [
      { month: "June", amount: 1200 },
      { month: "July", amount: 850 },
      { month: "August", amount: 1200 },
    ],
  });

  useEffect(() => {
    // TODO: Fetch from API (/api/earnings?coachId=dr-kelvin)
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Earnings Overview</h1>

      {/* Total */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">Total Earnings</h2>
        <p className="text-3xl font-bold text-[#6E6AFB]">${earnings.total}</p>
      </div>

      {/* Monthly breakdown */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Breakdown</h2>
        <ul className="space-y-3">
          {earnings.monthly.map((m, i) => (
            <li
              key={i}
              className="flex justify-between border-b last:border-b-0 pb-2"
            >
              <span>{m.month}</span>
              <span className="font-semibold">${m.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
