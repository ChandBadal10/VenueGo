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

export default function VenueSection() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const filters = [
    "All",
    "Futsal",
    "Cricket",
    "Basketball",
    "Table Tennis",
    "GYM",
  ];

  useEffect(() => {
    fetch("http://localhost:3000/api/addvenue/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVenues(data.venues);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venues...</p>
        </div>
      </div>
    );
  }

  // Only active venues
  const activeVenues = venues.filter((v) => v.isActive === true);

  // Search + Filter
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

  // Group by venue name + location
  const groupedVenues = Object.values(
    filteredVenues.reduce((acc, v) => {
      const key = normalize(v.venueName) + "_" + normalize(v.location);

      if (!acc[key]) {
        acc[key] = {
          _id: v._id,
          venueName: v.venueName,
          location: v.location,
          venueType: v.venueType || v.category,
          image: v.image || "", // ImageKit URL
          slots: [],
        };
      }

      acc[key].slots.push({
        _id: v._id,
        date: v.date,
        startTime: v.startTime,
        endTime: v.endTime,
        price: v.price,
        image: v.image, // ImageKit URL
      });

      // Use first available image if main image is missing
      if (!acc[key].image && v.image) {
        acc[key].image = v.image;
      }

      return acc;
    }, {})
  );

  return (
    <div className="w-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Filter + Search Header */}
        <div className="mb-10">
          <div className="rounded-2xl p-8 text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg">
            <h2 className="text-2xl font-bold mb-1">Available Venues</h2>
            <p className="text-sm opacity-90 mb-6">
              Browse our selection of premium venues
            </p>

            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 bg-white rounded-full px-5 py-3 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or location..."
                  className="w-full outline-none text-gray-700 text-sm"
                />
              </div>
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

          <p className="mt-6 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold">{groupedVenues.length}</span> venues
          </p>
        </div>

        {/* Venue Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {groupedVenues.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No venues found</h3>
              <p className="text-gray-500">
                {search || activeFilter !== "All"
                  ? "Try adjusting your search or filters"
                  : "No venues available right now"}
              </p>
            </div>
          )}

          {groupedVenues.map((venue) => {
            // Use ImageKit URL directly - NO FALLBACK to dummy image
            const venueImage = venue.image || (venue.slots.length > 0 && venue.slots[0].image) || null;

            return (
              <div
                key={venue._id}
                onClick={() => navigate(`/venue-details/${venue._id}`)}
                className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer overflow-hidden group"
              >
                {/* Display image only if it exists */}
                {venueImage ? (
                  <div className="relative overflow-hidden">
                    <img
                      src={venueImage}
                      className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={venue.venueName}
                      onError={(e) => {
                        // If ImageKit image fails to load, hide it and show placeholder
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="h-44 w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <div class="text-center text-white">
                              <div class="text-6xl mb-2">🏟️</div>
                              <p class="text-sm font-medium">Image Unavailable</p>
                            </div>
                          </div>
                        `;
                      }}
                    />
                  </div>
                ) : (
                  // Placeholder if no image available
                  <div className="h-44 w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-6xl mb-2">🏟️</div>
                      <p className="text-sm font-medium">No Image Available</p>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {venue.venueName}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" />
                    {venue.location}
                  </p>

                  <div className="flex items-center justify-between mb-2">
                    <p className="text-blue-600 font-semibold text-sm">
                      {getPriceRange(venue.slots)}
                    </p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {venue.venueType}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    {venue.slots.length} slot{venue.slots.length !== 1 ? 's' : ''} available
                  </p>
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