import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const FILTERS = ["All", "Futsal", "Cricket", "Basketball", "Table Tennis"];

function StatusBadge({ status }) {
  const styles = {
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${styles[status] || "bg-red-100 text-red-700"}`}>
      {status}
    </span>
  );
}

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeSport, setActiveSport] = useState("All");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => { if (res.data.success) setBookings(res.data.bookings); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter((b) =>
    activeSport === "All" ? true : b.sport === activeSport
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-sm text-gray-500 mb-6">View all your past and upcoming bookings</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveSport(sport)}
              className={`px-4 py-1.5 text-sm rounded-full border transition font-medium ${
                activeSport === sport
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && filteredBookings.length === 0 && (
          <p className="text-center text-gray-400 py-20">No bookings found.</p>
        )}

        {/* Cards */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-base">{booking.venueName}</h3>
                <StatusBadge status={booking.status} />
              </div>

              <div className="grid grid-cols-2 gap-y-1.5 text-sm text-gray-600">
                <p><span className="font-medium text-gray-700">Sport:</span> {booking.sport}</p>
                <p><span className="font-medium text-gray-700">Date:</span> {booking.date}</p>
                <p><span className="font-medium text-gray-700">Time:</span> {booking.startTime} - {booking.endTime}</p>
                <p><span className="font-medium text-gray-700">Location:</span> {booking.location}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">Total Price</p>
                <p className="text-blue-600 font-semibold">Rs {booking.price}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default MyBookings;