import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";

const normalize = (val) => val?.toString().trim().toLowerCase();

const getPriceRange = (slots) => {
  if (!slots || slots.length === 0) return "Rs 0/hr";
  const prices = slots.map((s) => Number(s.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `Rs ${min}/hr` : `Rs ${min} - Rs ${max}/hr`;
};

const StarDisplay = ({ rating, totalReviews }) => {
  if (!rating || rating === 0) {
    return (
      <span className="text-xs text-gray-400 dark:text-gray-500">No reviews yet</span>
    );
  }
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs font-semibold text-yellow-500 ml-0.5">{rating}</span>
      <span className="text-xs text-gray-400 dark:text-gray-500">({totalReviews})</span>
    </div>
  );
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden animate-pulse">
    <div className="h-44 w-full bg-gray-200 dark:bg-gray-700" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);

// ── Animated venue card ───────────────────────────────────────────────────────
const AnimatedVenueCard = ({ venue, index, navigate }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  const venueImage =
    venue.image || (venue.slots.length > 0 && venue.slots[0].image) || null;

  return (
    <div
      onClick={() => navigate(`/venue-details/${venue._id}`)}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl cursor-pointer overflow-hidden
        hover:-translate-y-2 hover:border-blue-300 dark:hover:border-blue-500 border border-transparent"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      {venueImage ? (
        <div className="relative overflow-hidden">
          <img
            src={venueImage}
            className="h-44 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            alt={venue.venueName}
          />
          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300" />
          {venue.averageRating > 0 && (
            <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-2.5 py-1 flex items-center gap-1 shadow-md
              transition-transform duration-300 group-hover:scale-110">
              <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{venue.averageRating}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-44 w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center
          transition-transform duration-500 ease-out group-hover:scale-110 overflow-hidden">
          <div className="text-center text-white">
            <div className="text-6xl mb-2">🏟️</div>
            <p className="text-sm font-medium">No Image Available</p>
          </div>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1
          group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {venue.venueName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3" />
          {venue.location}
        </p>
        <div className="mb-2">
          <StarDisplay rating={venue.averageRating} totalReviews={venue.totalReviews} />
        </div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-blue-600 font-semibold text-sm">{getPriceRange(venue.slots)}</p>
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full
            transition-transform duration-300 group-hover:scale-105">
            {venue.venueType}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {venue.slots.length} slot{venue.slots.length !== 1 ? "s" : ""} available
        </p>
      </div>
    </div>
  );
};

export default function VenueSection() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(false);
  const navigate = useNavigate();

  const filters = ["All", "Futsal", "Cricket", "Basketball", "Table Tennis", "GYM"];

  useEffect(() => {
    const timer = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/api/addvenue/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVenues(data.venues);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ── Skeleton loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full bg-slate-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="rounded-2xl p-8 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg mb-10 animate-pulse">
            <div className="h-7 bg-white/30 rounded w-48 mb-2" />
            <div className="h-4 bg-white/30 rounded w-64 mb-6" />
            <div className="h-12 bg-white/30 rounded-full mb-5" />
            <div className="flex gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-9 w-20 bg-white/30 rounded-full" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const activeVenues = venues.filter((v) => v.isActive === true);

  const filteredVenues = activeVenues.filter((v) => {
    const matchSearch =
      normalize(v.venueName).includes(normalize(search)) ||
      normalize(v.location).includes(normalize(search));
    const matchFilter =
      activeFilter === "All" ||
      normalize(v.venueType) === normalize(activeFilter) ||
      normalize(v.category) === normalize(activeFilter);
    return matchSearch && matchFilter;
  });

  const groupedVenues = Object.values(
    filteredVenues.reduce((acc, v) => {
      const key = normalize(v.venueName) + "_" + normalize(v.location);
      if (!acc[key]) {
        acc[key] = {
          _id: v._id,
          venueName: v.venueName,
          location: v.location,
          venueType: v.venueType || v.category,
          image: v.image || "",
          averageRating: v.averageRating || 0,
          totalReviews: v.totalReviews || 0,
          slots: [],
        };
      }
      acc[key].slots.push({ _id: v._id, date: v.date, startTime: v.startTime, endTime: v.endTime, price: v.price, image: v.image });
      if (!acc[key].image && v.image) acc[key].image = v.image;
      if ((v.averageRating || 0) > acc[key].averageRating) {
        acc[key].averageRating = v.averageRating;
        acc[key].totalReviews = v.totalReviews;
      }
      return acc;
    }, {})
  );

  return (
    <div className="w-full bg-slate-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div
          className="mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="rounded-2xl p-8 text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg">
            <h2 className="text-2xl font-bold mb-1">Available Venues</h2>
            <p className="text-sm opacity-90 mb-6">Browse our selection of premium venues</p>

            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-full px-5 py-3 flex items-center gap-3
                transition-shadow duration-300 focus-within:shadow-lg focus-within:shadow-blue-700/30">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or location..."
                  className="w-full outline-none text-gray-700 dark:text-gray-200 bg-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200
                    active:scale-95 ${
                    activeFilter === filter
                      ? "bg-white text-blue-600 border-white shadow-md"
                      : "border-white/40 text-white hover:bg-white/20 hover:border-white/70"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <p
            className="mt-6 text-sm text-gray-600 dark:text-gray-300"
            style={{ animation: "fadeIn 0.4s ease 0.3s both" }}
          >
            Showing <span className="font-semibold">{groupedVenues.length}</span> venues
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groupedVenues.length === 0 && (
            <div
              className="col-span-full text-center py-12"
              style={{ animation: "fadeIn 0.4s ease" }}
            >
              <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No venues found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {search || activeFilter !== "All"
                  ? "Try adjusting your search or filters"
                  : "No venues available right now"}
              </p>
            </div>
          )}

          {groupedVenues.map((venue, index) => (
            <AnimatedVenueCard key={venue._id} venue={venue} index={index} navigate={navigate} />
          ))}
        </div>
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
}