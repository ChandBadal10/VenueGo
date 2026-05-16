import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";

const FILTERS = ["All", "Futsal", "Cricket", "Basketball", "Table Tennis"];

function StatusBadge({ status }) {
  const styles = {
    confirmed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  };
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize transition-transform duration-200 hover:scale-105 inline-block ${
        styles[status] || "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      }`}
    >
      {status}
    </span>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
    </div>
    <div className="grid grid-cols-2 gap-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      ))}
    </div>
    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
    </div>
  </div>
);

// ── Animated booking card ─────────────────────────────────────────────────────
const BookingCard = ({ booking, index }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-600"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base
          transition-colors duration-200 group-hover:text-blue-600">
          {booking.venueName}
        </h3>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-2 gap-y-1.5 text-sm text-gray-600 dark:text-gray-300">
        <p><span className="font-medium text-gray-700 dark:text-gray-200">Sport:</span> {booking.sport}</p>
        <p><span className="font-medium text-gray-700 dark:text-gray-200">Date:</span> {booking.date}</p>
        <p><span className="font-medium text-gray-700 dark:text-gray-200">Time:</span> {booking.startTime} - {booking.endTime}</p>
        <p><span className="font-medium text-gray-700 dark:text-gray-200">Location:</span> {booking.location}</p>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Price</p>
        <p className="text-blue-600 font-semibold transition-transform duration-200 hover:scale-105 inline-block">
          Rs {booking.price}
        </p>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeSport, setActiveSport] = useState("All");
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const t1 = setTimeout(() => setHeaderVisible(true), 100);
    const t2 = setTimeout(() => setFiltersVisible(true), 250);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    axios
      .get("https://venuego-backend.onrender.com/api/bookings/user", {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">

        {/* ── Animated header ── */}
        <div
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            View all your past and upcoming bookings
          </p>
        </div>

        {/* ── Animated filters ── */}
        <div
          className="flex flex-wrap gap-2 mb-6"
          style={{
            opacity: filtersVisible ? 1 : 0,
            transform: filtersVisible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
          }}
        >
          {FILTERS.map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveSport(sport)}
              className={`px-4 py-1.5 text-sm rounded-full border font-medium
                transition-all duration-200 active:scale-95 ${
                activeSport === sport
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:-translate-y-0.5 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:border-blue-500"
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* ── Skeleton loading ── */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && filteredBookings.length === 0 && (
          <div
            className="text-center py-20"
            style={{ animation: "fadeIn 0.4s ease" }}
          >
            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-400 dark:text-gray-500 font-medium">No bookings found.</p>
            <p className="text-gray-300 dark:text-gray-600 text-sm mt-1">
              {activeSport !== "All" ? `No ${activeSport} bookings yet` : "You haven't made any bookings yet"}
            </p>
          </div>
        )}

        {/* ── Cards ── */}
        {!loading && (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <BookingCard key={booking._id} booking={booking} index={index} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Footer />
    </div>
  );
};

export default MyBookings;
