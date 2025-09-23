"use client";

import { useState, useEffect } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // In production → fetch from your API: /api/bookings?coachId=dr-kelvin
    setBookings([
      {
        id: "b1",
        client: "Jane Doe",
        date: "2025-09-10T14:00:00Z",
        status: "Confirmed",
        price: 100,
      },
      {
        id: "b2",
        client: "Michael Smith",
        date: "2025-09-11T10:00:00Z",
        status: "Pending",
        price: 120,
      },
      {
        id: "b3",
        client: "Amina Bello",
        date: "2025-09-12T16:30:00Z",
        status: "Completed",
        price: 90,
      },
    ]);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Client</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="px-6 py-4">{b.client}</td>
                <td className="px-6 py-4">
                  {new Date(b.date).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : b.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4">${b.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
