import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const FILTERS = ["All", "Futsal", "Cricket", "Basketball", "Table Tennis"];

function StatusBadge({ status }) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded font-medium ${
        status === "confirmed"
          ? "bg-green-100 text-green-700"
          : status === "cancelled"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeSport, setActiveSport] = useState("All");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/bookings/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  //  Filter logic
  const filteredBookings = bookings.filter((b) =>
    activeSport === "All" ? true : b.sport === activeSport
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-600 mb-4">
          View all your past and upcoming bookings
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveSport(sport)}
              className={`px-3 py-1 text-sm rounded border transition ${
                activeSport === sport
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500 mt-10">
            Loading bookings...
          </p>
        )}

        {/* Empty */}
        {!loading && filteredBookings.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No bookings found.
          </p>
        )}

        {/* Booking Cards */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow border p-4"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-gray-900">
                  {booking.venueName}
                </h3>
                <StatusBadge status={booking.status} />
              </div>

              <p className="text-sm text-gray-700">
                <span className="font-semibold">Sport:</span> {booking.sport}
              </p>

              <p className="text-sm text-gray-700">
                <span className="font-semibold">Date:</span> {booking.date}
              </p>

              <p className="text-sm text-gray-700">
                <span className="font-semibold">Time:</span>{" "}
                {booking.startTime} - {booking.endTime}
              </p>

              <p className="text-sm text-gray-700">
                <span className="font-semibold">Location:</span>{" "}
                {booking.location}
              </p>

              <p className="text-sm text-gray-900 mt-1">
                <span className="font-semibold">Price:</span> Rs{" "}
                {booking.price}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyBookings;
