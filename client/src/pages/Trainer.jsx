import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import { Search, X, Clock } from "lucide-react";

const normalize = (val) => val?.toString().trim().toLowerCase();
const FILTERS = ["All", "Yoga", "Cardio", "Strength", "CrossFit", "Pilates", "Boxing"];

export default function UserTrainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/trainers/all");
        if (res.data.success) setTrainers(res.data.trainers);
      } catch (err) {
        console.error("Fetch trainers error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainers();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Our Trainers</h1>
          <p className="text-gray-500 mt-1 text-sm">Find a trainer that fits your goals</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 mb-5 max-w-md shadow-sm">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trainers..."
            className="outline-none text-sm text-gray-700 placeholder-gray-400 w-full bg-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                activeFilter === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-gray-400 text-sm mb-6">
          {filtered.length} trainer{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No trainers found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((trainer) => (
              <div
                key={trainer._id}
                onClick={() => setSelected(trainer)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
                  {trainer.image ? (
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.remove();
                        const el = document.createElement("span");
                        el.className = "text-5xl";
                        el.textContent = "💪";
                        e.target.parentElement.appendChild(el);
                      }}
                    />
                  ) : (
                    <div className="text-5xl">💪</div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-base">{trainer.name}</h3>
                  <p className="text-blue-600 text-sm mt-0.5">{trainer.specialization}</p>
                  <p className="text-gray-400 text-xs mt-1">{trainer.experience} years experience</p>

                  {/* Venue & Time */}
                  {trainer.venueName && trainer.startTime && trainer.endTime && (
                    <p className="flex items-center text-gray-500 text-xs mt-1 gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="font-medium">{trainer.venueName}</span> • {trainer.startTime} - {trainer.endTime}
                    </p>
                  )}

                  {trainer.bio && (
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2">{trainer.bio}</p>
                  )}
                  <button className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-52 bg-gray-100 relative flex items-center justify-center">
              {selected.image ? (
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">💪</div>
              )}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-50 transition"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800">{selected.name}</h2>
              <p className="text-blue-600 text-sm mt-0.5">{selected.specialization}</p>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-700">Experience:</span> {selected.experience} years</p>
                <p><span className="font-medium text-gray-700">Phone:</span> {selected.phone}</p>
                <p><span className="font-medium text-gray-700">Email:</span> {selected.email}</p>

                {/* Venue & Time */}
                {selected.venueName && selected.startTime && selected.endTime && (
                  <p className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="font-medium">{selected.venueName}</span> • {selected.startTime} - {selected.endTime}
                  </p>
                )}
              </div>

              {selected.bio && (
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">{selected.bio}</p>
              )}

              <button className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition">
                Book a Session
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}