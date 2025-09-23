"use client";

import { useState, useEffect } from "react";

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState([
    {
      id: "p1",
      amount: 1200,
      date: "2025-09-01",
      status: "Paid",
    },
    {
      id: "p2",
      amount: 850,
      date: "2025-08-01",
      status: "Paid",
    },
    {
      id: "p3",
      amount: 1200,
      date: "2025-07-01",
      status: "Paid",
    },
    {
      id: "p4",
      amount: 900,
      date: "2025-09-15",
      status: "Pending",
    },
  ]);

  useEffect(() => {
    // TODO: Fetch from API (/api/payouts?coachId=dr-kelvin)
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payout History</h1>

      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
              <th className="px-6 py-3 text-left font-semibold">Amount</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-6 py-4">{p.date}</td>
                <td className="px-6 py-4">${p.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Next scheduled payout */}
      <div className="mt-8 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Next Payout</h2>
        <p className="text-2xl font-bold text-[#4AE3C1]">
          Sept 15, 2025 — $900
        </p>
        <p className="text-gray-600 mt-2">
          Funds will be transferred automatically on the scheduled payout date.
        </p>
      </div>
    </div>
  );
}
