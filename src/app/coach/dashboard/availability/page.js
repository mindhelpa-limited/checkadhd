"use client";

import { useState } from "react";

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState({
    monday: ["10:00", "14:00"],
    tuesday: [],
    wednesday: ["09:00", "11:00"],
    thursday: [],
    friday: ["15:00"],
  });

  const toggleSlot = (day, time) => {
    setAvailability((prev) => {
      const slots = prev[day] || [];
      return {
        ...prev,
        [day]: slots.includes(time)
          ? slots.filter((s) => s !== time)
          : [...slots, time],
      };
    });
  };

  const saveAvailability = () => {
    console.log("Saved availability:", availability);
    // TODO: Call your API: POST /api/availability
  };

  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Set Your Availability</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {Object.keys(availability).map((day) => (
          <div key={day} className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 capitalize">{day}</h2>
            <div className="flex flex-wrap gap-2">
              {times.map((time) => {
                const isSelected = availability[day]?.includes(time);
                return (
                  <button
                    key={time}
                    onClick={() => toggleSlot(day, time)}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      isSelected
                        ? "bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] text-white"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button
          onClick={saveAvailability}
          className="px-6 py-3 bg-gradient-to-r from-[#4AE3C1] to-[#6E6AFB] text-white rounded-lg shadow font-semibold hover:scale-105 transition"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
}
