import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MapPin, SlidersHorizontal } from "lucide-react";

const normalize = (v) => v?.toString().trim().toLowerCase();

const getPriceRange = (slots) => {
  const prices = slots.map((s) => s.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `Rs ${min}/hr` : `Rs ${min} – Rs ${max}/hr`;
};

const VenueCard = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [venueTypeFilter, setVenueTypeFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:3000/api/addvenue/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVenues(data.venues);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venues...</p>
        </div>
      </div>
    );
  }

  // ✅ ONLY SHOW ACTIVE VENUES
  const activeVenues = venues.filter((v) => v.isActive === true);

  // ✅ GROUP BY VENUE NAME + LOCATION
  const groupedVenues = Object.values(
    activeVenues.reduce((acc, v) => {
      const key = normalize(v.venueName) + "_" + normalize(v.location);

      if (!acc[key]) {
        acc[key] = {
          ...v,
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

  // Get unique locations and venue types for filters
  const uniqueLocations = ["all", ...new Set(groupedVenues.map(v => v.location).filter(Boolean))];
  const uniqueVenueTypes = ["all", ...new Set(groupedVenues.map(v => v.venueType).filter(Boolean))];

  // Apply filters
  const filteredVenues = groupedVenues.filter((venue) => {
    const matchesSearch =
      venue.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.venueType?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = locationFilter === "all" || venue.location === locationFilter;
    const matchesVenueType = venueTypeFilter === "all" || venue.venueType === venueTypeFilter;

    return matchesSearch && matchesLocation && matchesVenueType;
  });

  return (
    <div className="px-6 pb-20 max-w-7xl mx-auto mt-20">
      <h2 className="text-3xl font-bold text-center mb-3">
        Popular Venues
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Discover and book the best sports venues near you
      </p>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by venue name, location, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Location Filter */}
          <div className="relative min-w-[200px]">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Locations</option>
              {uniqueLocations.slice(1).map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Venue Type Filter */}
          <div className="relative min-w-[200px]">
            <SlidersHorizontal className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <select
              value={venueTypeFilter}
              onChange={(e) => setVenueTypeFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Types</option>
              {uniqueVenueTypes.slice(1).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Info */}
        {(searchQuery || locationFilter !== "all" || venueTypeFilter !== "all") && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span>Showing {filteredVenues.length} of {groupedVenues.length} venues</span>
            <button
              onClick={() => {
                setSearchQuery("");
                setLocationFilter("all");
                setVenueTypeFilter("all");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium ml-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Venue Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {filteredVenues.slice(0, 6).map((venue) => (
          <div
            key={venue._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl border transition overflow-hidden"
          >
            <img
              src={
                venue.image ||
                "https://images.unsplash.com/photo-1600679472829-3044539ce8ed"
              }
              className="h-52 w-full object-cover"
              alt={venue.venueName}
            />

            <div className="p-5">
              <h3 className="font-semibold">{venue.venueName}</h3>
              <p className="text-sm text-gray-500">{venue.location}</p>

              <p className="text-blue-600 text-sm mt-1">
                {getPriceRange(venue.slots)} • {venue.venueType}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {venue.slots.length} slot(s) available
              </p>

              <button
                onClick={() => navigate(`/venue-details/${venue._id}`)}
                className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}

        {filteredVenues.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-500">
              {searchQuery || locationFilter !== "all" || venueTypeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No venues available right now"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueCard;