import React, { useState } from "react";
import Footer from "../components/Footer";

// Simple dummy data
const BOOKINGS = [
  {
    id: "BKG-001",
    sport: "Futsal",
    venue: "Shantinagar Futsal Arena",
    date: "2025-12-12",
    time: "4 pm - 5 pm",
    location: "Shantinagar, Kathmandu",
    price: "Rs 1600",
    status: "Pending",
  },
  {
    id: "BKG-002",
    sport: "Cricket",
    venue: "Baneshwor Indoor Nets",
    date: "2025-02-22",
    time: "2 pm - 4 pm",
    location: "Baneshwor, Kathmandu",
    price: "Rs 2200",
    status: "Completed",
  },
  {
    id: "BKG-003",
    sport: "Basketball",
    venue: "Velocity Hoops Court",
    date: "2025-01-05",
    time: "6 pm - 7:30 pm",
    location: "Ratopul, Kathmandu",
    price: "Rs 1200",
    status: "Completed",
  },
  {
    id: "BKG-004",
    sport: "Table Tennis",
    venue: "SpinPoint TT Club",
    date: "2024-12-18",
    time: "5:30 pm - 6:30 pm",
    location: "New Baneshwor, Kathmandu",
    price: "Rs 400",
    status: "Completed",
  },
  {
    id: "BKG-005",
    sport: "Futsal",
    venue: "Velocity Futsal",
    date: "2024-11-02",
    time: "7 pm - 8 pm",
    location: "Tinkune, Kathmandu",
    price: "Rs 1500",
    status: "Completed",
  },
];

const FILTERS = ["All", "Futsal", "Cricket", "Basketball", "Table Tennis"];

function StatusBadge({ status }) {
  let classes = "text-xs px-2 py-1 rounded ";
  if (status === "Completed") classes += "bg-green-100 text-green-700";
  else if (status === "Pending") classes += "bg-yellow-100 text-yellow-700";
  else classes += "bg-red-100 text-red-700";

  return <span className={classes}>{status}</span>;
}

export default function MyBookings() {
  const [activeSport, setActiveSport] = useState("All");

  const filtered = BOOKINGS.filter((e) =>
    activeSport === "All" ? true : e.sport === activeSport
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900">My Past Bookings</h1>
        <p className="text-sm text-gray-600 mb-4">
          All your previous sports bookings.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveSport(sport)}
              className={`px-3 py-1 text-sm rounded border ${
                activeSport === sport
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Booking list */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow border p-4"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {booking.venue}
                  </h3>
                  <StatusBadge status={booking.status} />
                </div>

                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Sport:</span>{" "}
                  {booking.sport}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Date:</span>{" "}
                  {booking.date}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Time:</span>{" "}
                  {booking.time}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Location:</span>{" "}
                  {booking.location}
                </p>
                <p className="text-sm text-gray-900 mt-1">
                  <span className="font-semibold">Price:</span>{" "}
                  {booking.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    <Footer />
    </div>

  );
}
