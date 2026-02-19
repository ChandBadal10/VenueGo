import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { Search, MapPin, Clock } from "lucide-react";

const normalize = (val) => val?.toString().trim().toLowerCase();
const FILTERS = ["All", "Futsal ", "Cricket", "BasketBall", "Swimming", "Gym", "Dance"];

const formatTime = (time24) => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes || "00"} ${ampm}`;
};

export default function Trainer() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/trainers/all")
      .then((res) => { if (res.data.success) setTrainers(res.data.trainers); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = trainers.filter((t) => {
    const matchSearch =
      normalize(t.name).includes(normalize(search)) ||
      normalize(t.specialization).includes(normalize(search));
    const matchFilter =
      activeFilter === "All" || normalize(t.specialization) === normalize(activeFilter);
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading trainers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header Banner */}
        <div className="mb-10">
          <div className="rounded-2xl p-8 text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg">
            <h2 className="text-2xl font-bold mb-1">Our Trainers</h2>
            <p className="text-sm opacity-90 mb-6">
              Find the right trainer to match your fitness goals
            </p>

            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 bg-white rounded-full px-5 py-3 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or specialization..."
                  className="w-full outline-none text-gray-700 text-sm"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-3 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
                    activeFilter === f
                      ? "bg-white text-blue-600 border-white"
                      : "border-white/40 text-white hover:bg-white/20"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Showing <span className="font-semibold">{filtered.length}</span> trainer{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No trainers found</h3>
              <p className="text-gray-500">
                {search || activeFilter !== "All"
                  ? "Try adjusting your search or filters"
                  : "No trainers available right now"}
              </p>
            </div>
          )}

          {filtered.map((trainer) => {
            const slots = trainer.slots || [];
            const availableSlots = slots.filter((s) => !s.isBooked);
            const firstSlot = availableSlots[0] || slots[0];

            return (
              <div
                key={trainer._id}
                onClick={() => navigate(`/trainer-details/${trainer._id}`)}
                className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer overflow-hidden group"
              >
                {/* Image */}
                {trainer.image ? (
                  <div className="relative overflow-hidden">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div class="h-44 w-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <div class="text-center text-white">
                              <div class="text-6xl mb-2">💪</div>
                              <p class="text-sm font-medium">No Image</p>
                            </div>
                          </div>`;
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-44 w-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-2">💪</div>
                      <p className="text-sm font-medium">No Image Available</p>
                    </div>
                  </div>
                )}

                {/* Card Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{trainer.name}</h3>

                  {/* Specialization */}
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {trainer.specialization}
                  </p>

                  {/* Venue */}
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 shrink-0 text-blue-400" />
                    {trainer.venueName}
                  </p>

                  {/* Timing */}
                  {firstSlot && (
                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                      <Clock className="w-3 h-3 shrink-0 text-blue-500" />
                      <span>
                        {formatTime(firstSlot.startTime)} - {formatTime(firstSlot.endTime)}
                        {availableSlots.length > 1 && (
                          <span className="text-gray-400 ml-1">+{availableSlots.length - 1} more</span>
                        )}
                      </span>
                    </p>
                  )}

                  {/* Slots badge */}
                  <div className="flex items-center justify-between">
                    <p className="text-blue-600 font-semibold text-sm">
                      {(() => {
                        if (!slots.length) return "Rs 0/hr";
                        const prices = slots.map((s) => Number(s.price));
                        const min = Math.min(...prices);
                        const max = Math.max(...prices);
                        return min === max ? `Rs ${min}/hr` : `Rs ${min} - Rs ${max}/hr`;
                      })()}
                    </p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {slots.length > 0
                        ? `${availableSlots.length} slot${availableSlots.length !== 1 ? "s" : ""}`
                        : "Trainer"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}