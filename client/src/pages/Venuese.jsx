import React, { useState } from "react";
import Footer from "../components/Footer";
import { Navigate, useNavigate } from "react-router-dom";
const dummyVenues = Array.from({ length: 9 }, () => ({
  id: Math.random(),
  name: "Velocity Futsal",
  location: "Kalopul, Kathmandu",
  price: "Rs 1500/hrs",
  image:
    "https://media.istockphoto.com/id/1295248329/photo/beautiful-young-black-boy-training-on-the-football-pitch.jpg?s=612x612&w=0&k=20&c=ws4m_NoSF8fRZGNoq5kVlJSfNghREKihaxsOBXAHOw8=",
}));

export default function VenueSection() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  const filters = ["All", "Futsal", "Cricket", "Basket-Ball", "Table-Tennis"];

  const filteredVenues = dummyVenues.filter((v) => {
    const matchesQ =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Futsal" &&
        v.name.toLowerCase().includes("futsal")) ||
      v.location.toLowerCase().includes(activeFilter.toLowerCase());

    return matchesQ && matchesFilter;
  });

  return (
    <div className="w-full bg-slate-50">
      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ---------------- HEADER SECTION ---------------- */}
        <div className="rounded-2xl p-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Available Venues</h2>
          <p className="text-white/90 mt-1">
            Browse our selection of premium venues available for your next game
          </p>

          {/* Search */}
          <div className="mt-5 flex gap-3 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, location"
              className="flex-1 rounded-full px-4 py-2 bg-white text-gray-800 focus:ring-4 focus:ring-white/30 outline-none"
            />

            <button
              className="px-4 py-2 rounded-full bg-white text-blue-600 font-semibold shadow hover:scale-105 transition"
            >
              Search
            </button>
          </div>

          {/* Filter Chips */}
          <div className="mt-4 flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-sm px-3 py-1 rounded-full transition border ${
                  activeFilter === f
                    ? "bg-white text-blue-700 border-transparent"
                    : "bg-white/10 text-white border-white/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ----------------- COUNT ----------------- */}
        <p className="text-sm text-gray-600 mt-6 mb-3">
          Showing <span className="font-semibold">{filteredVenues.length}</span> Venues
        </p>

        {/* ----------------- GRID ------------------ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer">
          {filteredVenues.map((venue) => (
            <div onClick={() => {
              navigate(`/venue-details/${venue._id}`);
            }}
              key={venue.id}
              className="rounded-lg shadow hover:shadow-md transition bg-white p-2"
            >
              <div className="relative">
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="rounded-md w-full h-44 object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {venue.price}
                </span>
              </div>

              <h3 className="mt-2 font-medium">{venue.name}</h3>
              <p className="text-sm text-gray-600">{venue.location}</p>
            </div>
          ))}
        </div>

      </div>

      {/* footer  */}
      <Footer />
    </div>
  );
}
