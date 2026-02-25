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

const TrainerCard = () => {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("all");
  const [venueFilter, setVenueFilter] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/trainers/all")
      .then((res) => { if (res.data.success) setTrainers(res.data.trainers); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
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
      <h2 className="text-3xl font-bold text-center mb-3">Meet Our Trainers</h2>
      <p className="text-center text-gray-600 mb-8">
        Expert trainers to help you achieve your fitness goals
      </p>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, specialization, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Specialization Filter */}
          <div className="relative min-w-[200px]">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
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
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
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
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span>Showing {filtered.length} of {trainers.length} trainers</span>
            <button
              onClick={() => { setSearchQuery(""); setSpecializationFilter("all"); setVenueFilter("all"); }}
              className="text-blue-600 hover:text-blue-700 font-medium ml-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Trainer Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trainers found</h3>
            <p className="text-gray-500">
              {isFiltering ? "Try adjusting your search or filters" : "No trainers available right now"}
            </p>
          </div>
        )}

        {filtered.slice(0, 6).map((trainer) => {
          const slots = trainer.slots || [];
          const availableSlots = slots.filter((s) => !s.isBooked);
          const firstSlot = availableSlots[0] || slots[0];

          return (
            <div
              key={trainer._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl border transition overflow-hidden cursor-pointer"
              onClick={() => navigate(`/trainer-details/${trainer._id}`)}
            >
              {/* Image */}
              {trainer.image ? (
                <img
                  src={trainer.image}
                  className="h-52 w-full object-cover"
                  alt={trainer.name}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="h-52 w-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-2">💪</div>
                    <p className="text-sm font-medium">No Image Available</p>
                  </div>
                </div>
              )}

              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900">{trainer.name}</h3>

                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <SlidersHorizontal className="w-4 h-4" />
                  {trainer.specialization}
                </p>

                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {trainer.venueName}
                </p>

                {firstSlot && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(firstSlot.startTime)} – {formatTime(firstSlot.endTime)}
                    {availableSlots.length > 1 && (
                      <span className="text-gray-400 ml-1">+{availableSlots.length - 1} more</span>
                    )}
                  </p>
                )}

                <div className="flex items-center justify-between mt-3">
                  <p className="text-blue-600 font-semibold">{getPriceRange(slots)}</p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {availableSlots.length} slot{availableSlots.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  {slots.length} slot{slots.length !== 1 ? "s" : ""} available
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/trainer-details/${trainer._id}`);
                  }}
                  className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-medium"
                >
                  Book Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/trainer")}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
        >
          View All Trainers
        </button>
      </div>
    </div>
  );
};

export default TrainerCard;