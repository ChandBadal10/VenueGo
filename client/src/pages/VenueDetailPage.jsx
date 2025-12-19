import React, { useState } from "react";

const VenueDetails = () => {
  const [selectedDay, setSelectedDay] = useState("Sun");
  const [selectedSlot, setSelectedSlot] = useState("");

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const slots = [
    { time: "7-8 AM", status: "available" },
    { time: "8-9 AM", status: "available" },
    { time: "10-11 AM", status: "available" },
    { time: "12-1 PM", status: "available" },
    { time: "3-4 PM", status: "available" },
    { time: "5-6 PM", status: "booked" },
    { time: "7-8 PM", status: "available" },
  ];

  const handleBookNow = () => {
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    alert(`Booking confirmed!\nDay: ${selectedDay}\nTime: ${selectedSlot}`);
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-6xl rounded-xl shadow p-6">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Image */}
          <img
            src="https://images.unsplash.com/photo-1600679472829-3044539ce8ed"
            alt="Venue"
            className="w-full h-[280px] object-cover rounded-lg"
          />

          {/* Venue Info */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-blue-600">
                Velocity Futsal
              </h1>

              <p className="text-sm text-gray-500 mb-4">
                Rato-put, Kathmandu
              </p>

              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-sm text-gray-600 leading-snug">
                Velocity Futsal is a modern indoor sports facility with
                high-quality turf and lighting, perfect for fast-paced
                matches, training sessions, and tournaments.
              </p>
            </div>

            <p className="mt-4 font-medium">
              Booking Fee: <span className="text-blue-600">$10</span>
            </p>
          </div>
        </div>

        {/* BOOKING SECTION */}
        <div className="mt-6">

          <h3 className="font-semibold mb-3">Booking Slots</h3>

          {/* DAYS */}
          <div className="flex gap-2 mb-5">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition
                  ${
                    selectedDay === day
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* TIME SLOTS */}
          <div className="flex gap-3 flex-wrap mb-6">
            {slots.map((slot) => (
              <button
                key={slot.time}
                disabled={slot.status === "booked"}
                onClick={() => setSelectedSlot(slot.time)}
                className={`px-4 py-1 rounded-full text-sm border transition
                  ${
                    slot.status === "booked"
                      ? "bg-red-200 border-red-300 text-red-700 cursor-not-allowed"
                      : selectedSlot === slot.time
                      ? "bg-green-200 border-green-300"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {slot.time}
              </button>
            ))}
          </div>

          {/* BOOK BUTTON */}
          <button
            onClick={handleBookNow}
            className="bg-blue-600 text-white px-8 py-2 rounded-full font-medium hover:bg-blue-700 transition"
          >
            Book Now
          </button>

        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
