import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const normalize = (val) => val?.toString().trim().toLowerCase();

const getPriceRange = (slots) => {
  const prices = slots.map((s) => s.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `Rs ${min}/hr` : `Rs ${min} - Rs ${max}/hr`;
};

export default function VenueSection() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const filters = ["All", "Futsal", "Cricket", "BasketBall", "Table Tennis", "GYM"];

  useEffect(() => {
    fetch("http://localhost:3000/api/addvenue/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVenues(data.venues);
        setLoading(false);
      });
  }, []);

  // 🔹 SEARCH + FILTER LOGIC (UNCHANGED)
  const filteredVenues = venues.filter((v) => {
    const matchSearch =
      normalize(v.venueName).includes(normalize(search)) ||
      normalize(v.location).includes(normalize(search));

    const matchFilter =
      activeFilter === "All" ||
      normalize(v.venueType) === normalize(activeFilter);

    return matchSearch && matchFilter;
  });

  // 🔹 GROUP BY VENUE NAME + LOCATION
  const groupedVenues = Object.values(
    filteredVenues.reduce((acc, v) => {
      const key = normalize(v.venueName) + "_" + normalize(v.location);

      if (!acc[key]) {
        acc[key] = {
          _id: v._id,
          venueName: v.venueName,
          location: v.location,
          venueType: v.venueType,
          image: v.image,
          slots: [],
        };
      }

      acc[key].slots.push({
        _id: v._id,
        date: v.date,
        startTime: v.startTime,
        endTime: v.endTime,
        price: v.price,
      });

      return acc;
    }, {})
  );

  if (loading) return <h2 className="p-10 text-center">Loading venues...</h2>;

  return (
    <div className="w-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ================= FILTER + SEARCH HEADER ================= */}
        <div className="mb-10">
          <div className="rounded-2xl p-8 text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg">
            <h2 className="text-2xl font-bold mb-1">Available Venues</h2>
            <p className="text-sm opacity-90 mb-6">
              Browse our selection of premium venues
            </p>

            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 bg-white rounded-full px-5 py-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, location"
                  className="w-full outline-none text-gray-700 text-sm"
                />
              </div>

              <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">
                Search
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-3 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
                    activeFilter === filter
                      ? "bg-white text-blue-600 border-white"
                      : "border-white/40 text-white hover:bg-white/20"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Result Count */}
          <p className="mt-6 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">{groupedVenues.length}</span> venues
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {groupedVenues.map((venue) => (
            <div
              key={venue._id}
              onClick={() => navigate(`/venue-details/${venue._id}`)}
              className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={
                  venue.image ||
                  "https://images.unsplash.com/photo-1600679472829-3044539ce8ed"
                }
                className="h-44 w-full object-cover rounded-t-xl"
                alt={venue.venueName}
              />

              <div className="p-4">
                <h3 className="font-semibold">{venue.venueName}</h3>
                <p className="text-sm text-gray-600">{venue.location}</p>

                <p className="text-blue-600 text-sm mt-1">
                  {getPriceRange(venue.slots)} • {venue.venueType}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {venue.slots.length} slot(s) available
                </p>
              </div>
            </div>
          ))}
        </div>


      </div>
      <Footer />
    </div>
  );
}
