import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, SlidersHorizontal, Clock } from "lucide-react";
import axios from "axios";

const normalize = (v) => v?.toString().trim().toLowerCase();

const formatTime = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes || "00"} ${ampm}`;
};

const getPriceRange = (slots) => {
  if (!slots || slots.length === 0) return "Rs 0/hr";
  const prices = slots.map((s) => Number(s.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `Rs ${min}/hr` : `Rs ${min} – Rs ${max}/hr`;
};

// ── Skeleton loader card ──────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-52 w-full bg-gray-200 dark:bg-gray-700" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="flex justify-between mt-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl mt-4" />
    </div>
  </div>
);

// ── Animated trainer card ─────────────────────────────────────────────────────
const AnimatedTrainerCard = ({ trainer, index, navigate }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const slots = trainer.slots || [];
  const availableSlots = slots.filter((s) => !s.isBooked);
  const firstSlot = availableSlots[0] || slots[0];

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg border dark:border-gray-700 overflow-hidden cursor-pointer
        hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300 dark:hover:border-blue-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
      onClick={() => navigate(`/trainer-details/${trainer._id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {trainer.image ? (
          <img
            src={trainer.image}
            className="h-52 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            alt={trainer.name}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="h-52 w-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
            <div className="text-center text-white">
              <div className="text-6xl mb-2">💪</div>
              <p className="text-sm font-medium">No Image Available</p>
            </div>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300" />
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {trainer.name}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1 mt-1">
          <SlidersHorizontal className="w-4 h-4" />
          {trainer.specialization}
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1 mt-1">
          <MapPin className="w-4 h-4" />
          {trainer.venueName}
        </p>

        {firstSlot && (
          <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1 mt-1">
            <Clock className="w-4 h-4" />
            {formatTime(firstSlot.startTime)} – {formatTime(firstSlot.endTime)}
            {availableSlots.length > 1 && (
              <span className="text-gray-400 dark:text-gray-500 ml-1">+{availableSlots.length - 1} more</span>
            )}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <p className="text-blue-600 dark:text-blue-400 font-semibold">{getPriceRange(slots)}</p>
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded-full
            transition-transform duration-300 group-hover:scale-105">
            {availableSlots.length} slot{availableSlots.length !== 1 ? "s" : ""}
          </span>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
          {slots.length} slot{slots.length !== 1 ? "s" : ""} available
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/trainer-details/${trainer._id}`); }}
          className="mt-4 w-full bg-blue-600 dark:bg-blue-500 text-white py-2.5 rounded-xl font-medium
            transition-all duration-300
            hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30
            active:scale-95
            dark:hover:bg-blue-600"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const TrainerCard = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [venueFilter, setVenueFilter] = useState("all");

  const [headerVisible, setHeaderVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeaderVisible(true), 100);
    setTimeout(() => setFilterVisible(true), 250);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/trainers/all")
      .then((res) => { if (res.data.success) setTrainers(res.data.trainers); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Skeleton loading state ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="px-6 pb-20 max-w-7xl mx-auto mt-20">
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-56 mx-auto mb-3 animate-pulse" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-72 mx-auto mb-8 animate-pulse" />
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-16 mb-8 animate-pulse" />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!trainers.length) return null;

  const uniqueSpecializations = ["all", ...new Set(trainers.map((t) => t.specialization).filter(Boolean))];
  const uniqueVenues = ["all", ...new Set(trainers.map((t) => t.venueName).filter(Boolean))];

  const filtered = trainers.filter((t) => {
    const matchesSearch =
      normalize(t.name)?.includes(normalize(searchQuery)) ||
      normalize(t.specialization)?.includes(normalize(searchQuery)) ||
      normalize(t.venueName)?.includes(normalize(searchQuery));

    const matchesSpec = specializationFilter === "all" || t.specialization === specializationFilter;
    const matchesVenue = venueFilter === "all" || t.venueName === venueFilter;

    return matchesSearch && matchesSpec && matchesVenue;
  });

  const isFiltering = searchQuery || specializationFilter !== "all" || venueFilter !== "all";

  return (
    <div className="px-6 pb-20 max-w-7xl mx-auto mt-20">

      {/* ── Animated header ── */}
      <div
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-3 dark:text-gray-100">Meet Our Trainers</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Expert trainers to help you achieve your fitness goals
        </p>
      </div>

      {/* ── Animated filter bar ── */}
      <div
        style={{
          opacity: filterVisible ? 1 : 0,
          transform: filterVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
        }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, specialization, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-300"
            />
          </div>

          {/* Specialization Filter */}
          <div className="relative min-w-[200px]">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5 pointer-events-none" />
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer transition-all duration-300"
            >
              {uniqueSpecializations.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Specializations" : s}
                </option>
              ))}
            </select>
          </div>

          {/* Venue Filter */}
          <div className="relative min-w-[200px]">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5 pointer-events-none" />
            <select
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer transition-all duration-300"
            >
              {uniqueVenues.map((v) => (
                <option key={v} value={v}>
                  {v === "all" ? "All Venues" : v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isFiltering && (
          <div
            className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            style={{ animation: "fadeIn 0.3s ease" }}
          >
            <span>Showing {filtered.length} of {trainers.length} trainers</span>
            <button
              onClick={() => { setSearchQuery(""); setSpecializationFilter("all"); setVenueFilter("all"); }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium ml-2 transition-colors duration-200 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ── Trainer Grid ── */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {filtered.length === 0 && (
          <div
            className="col-span-full text-center py-12"
            style={{ animation: "fadeIn 0.4s ease" }}
          >
            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No trainers found</h3>
            <p className="text-gray-500 dark:text-gray-300">
              {isFiltering ? "Try adjusting your search or filters" : "No trainers available right now"}
            </p>
          </div>
        )}

        {filtered.slice(0, 6).map((trainer, index) => (
          <AnimatedTrainerCard key={trainer._id} trainer={trainer} index={index} navigate={navigate} />
        ))}
      </div>

      {/* View All Button */}
      <div
        className="text-center mt-10"
        style={{ animation: "fadeIn 0.5s ease 0.6s both" }}
      >
        <button
          onClick={() => navigate("/trainer")}
          className="px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-medium
            transition-all duration-300
            hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5
            active:scale-95
            dark:hover:bg-blue-600"
        >
          View All Trainers
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TrainerCard;