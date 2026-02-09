import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MapPin, SlidersHorizontal } from "lucide-react";

const normalize = (v) => v?.toString().trim().toLowerCase();

const getPriceRange = (slots) => {
  if (!slots || slots.length === 0) return "Rs 0/hr";
  const prices = slots.map((s) => Number(s.price));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `Rs ${min}/hr` : `Rs ${min} – Rs ${max}/hr`;
};

const VenueCard = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [venueTypeFilter, setVenueTypeFilter] = useState("all");

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venues...</p>
        </div>
      </div>
    );
  }

  // Only active venues
  const activeVenues = venues.filter((v) => v.isActive === true);

  // Group by venue name + location
  const groupedVenues = Object.values(
    activeVenues.reduce((acc, v) => {
      const key = normalize(v.venueName) + "_" + normalize(v.location);

      if (!acc[key]) {
        acc[key] = {
          _id: v._id,
          venueName: v.venueName,
          location: v.location,
          venueType: v.venueType,
          category: v.category,
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

  // Unique filter options
  const uniqueLocations = ["all", ...new Set(groupedVenues.map(v => v.location).filter(Boolean))];
  const uniqueVenueTypes = ["all", ...new Set(groupedVenues.map(v => v.venueType || v.category).filter(Boolean))];

  // Apply filters
  const filteredVenues = groupedVenues.filter((venue) => {
    const matchesSearch =
      venue.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.venueType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = locationFilter === "all" || venue.location === locationFilter;
    const matchesVenueType = venueTypeFilter === "all" || venue.venueType === venueTypeFilter || venue.category === venueTypeFilter;

    return matchesSearch && matchesLocation && matchesVenueType;
  });

  return (
    <div className="px-6 pb-20 max-w-7xl mx-auto mt-20">
      <h2 className="text-3xl font-bold text-center mb-3">Popular Venues</h2>
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
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location === "all" ? "All Locations" : location}
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
              {uniqueVenueTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </option>
              ))}
            </select>
          </div>
        </div>

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

        {filteredVenues.slice(0, 6).map((venue) => {
          // Use ImageKit URL directly - NO FALLBACK to dummy image
          const venueImage = venue.image || (venue.slots.length > 0 && venue.slots[0].image) || null;

          return (
            <div
              key={venue._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl border transition overflow-hidden cursor-pointer"
              onClick={() => navigate(`/venue-details/${venue._id}`)}
            >
              {/* Display image only if it exists */}
              {venueImage ? (
                <img
                  src={venueImage}
                  className="h-52 w-full object-cover"
                  alt={venue.venueName}
                  onError={(e) => {
                    // If ImageKit image fails to load, hide the image
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                // Placeholder if no image available
                <div className="h-52 w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-2">🏟️</div>
                    <p className="text-sm font-medium">No Image Available</p>
                  </div>
                </div>
              )}

              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900">{venue.venueName}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {venue.location}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-blue-600 font-semibold">
                    {getPriceRange(venue.slots)}
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {venue.venueType || venue.category}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  {venue.slots.length} slot{venue.slots.length !== 1 ? 's' : ''} available
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/venue-details/${venue._id}`);
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

      {/* Show More Button */}
      {filteredVenues.length > 6 && (
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/all-venues')}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium"
          >
            View All {filteredVenues.length} Venues
          </button>
        </div>
      )}
    </div>
  );
};

export default VenueCard;