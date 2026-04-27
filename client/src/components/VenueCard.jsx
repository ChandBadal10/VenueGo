import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MapPin, SlidersHorizontal, Star } from "lucide-react";

const normalize = (v) => v?.toString().trim().toLowerCase();

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
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="flex justify-between mt-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl mt-4" />
    </div>
  </div>
);

// ── Star display ──────────────────────────────────────────────────────────────
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
          className={`w-3.5 h-3.5 transition-colors duration-300 ${
            star <= Math.round(rating)
              ? "text-yellow-400"
              : "text-gray-300 dark:text-gray-600"
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

// ── Animated venue card ───────────────────────────────────────────────────────
const AnimatedVenueCard = ({ venue, index, navigate }) => {
  const [visible, setVisible] = useState(false);

  // Staggered entrance: each card fades + slides up after a delay
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  const venueImage =
    venue.image || (venue.slots.length > 0 && venue.slots[0].image) || null;

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:-translate-y-2 hover:border-blue-300 dark:hover:border-blue-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.5s ease ${index * 100}ms, transform 0.5s ease ${index * 100}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
      onClick={() => navigate(`/venue-details/${venue._id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {venueImage ? (
          <img
            src={venueImage}
            className="h-52 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            alt={venue.venueName}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="h-52 w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
            <div className="text-center text-white">
              <div className="text-6xl mb-2">🏟️</div>
              <p className="text-sm font-medium">No Image Available</p>
            </div>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300" />

        {/* Rating badge */}
        {venue.averageRating > 0 && (
          <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full px-2.5 py-1 flex items-center gap-1 shadow-md
            transition-transform duration-300 group-hover:scale-110">
            <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-100">
              {venue.averageRating}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {venue.venueName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-1 mt-1">
          <MapPin className="w-4 h-4" />
          {venue.location}
        </p>

        <div className="mt-2">
          <StarDisplay rating={venue.averageRating} totalReviews={venue.totalReviews} />
        </div>

        <div className="flex items-center justify-between mt-3">
          <p className="text-blue-600 dark:text-blue-400 font-semibold">
            {getPriceRange(venue.slots)}
          </p>
          <span className="text-xs bg-blue-100 dark:bg-blue-200 text-blue-700 dark:text-blue-900 px-2 py-1 rounded-full
            transition-transform duration-300 group-hover:scale-105">
            {venue.venueType || venue.category}
          </span>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-300 mt-2">
          {venue.slots.length} slot{venue.slots.length !== 1 ? "s" : ""} available
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/venue-details/${venue._id}`);
          }}
          className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium
            transition-all duration-300
            hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30
            active:scale-95
            dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const VenueCard = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [venueTypeFilter, setVenueTypeFilter] = useState("all");

  // Animate filter bar on mount
  const [filterVisible, setFilterVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeaderVisible(true), 100);
    setTimeout(() => setFilterVisible(true), 250);
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

  // ── Skeleton loading state ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="px-6 pb-20 max-w-7xl mx-auto mt-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mx-auto mb-3 animate-pulse" />
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

  const activeVenues = venues.filter((v) => v.isActive === true);

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
          image: v.image || "",
          averageRating: v.averageRating || 0,
          totalReviews: v.totalReviews || 0,
          slots: [],
        };
      }
      acc[key].slots.push({
        _id: v._id,
        date: v.date,
        startTime: v.startTime,
        endTime: v.endTime,
        price: v.price,
        image: v.image,
      });
      if (!acc[key].image && v.image) acc[key].image = v.image;
      if ((v.averageRating || 0) > acc[key].averageRating) {
        acc[key].averageRating = v.averageRating;
        acc[key].totalReviews = v.totalReviews;
      }
      return acc;
    }, {})
  );

  const uniqueLocations = ["all", ...new Set(groupedVenues.map((v) => v.location).filter(Boolean))];
  const uniqueVenueTypes = ["all", ...new Set(groupedVenues.map((v) => v.venueType || v.category).filter(Boolean))];

  const filteredVenues = groupedVenues.filter((venue) => {
    const matchesSearch =
      venue.venueName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.venueType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || venue.location === locationFilter;
    const matchesVenueType =
      venueTypeFilter === "all" ||
      venue.venueType === venueTypeFilter ||
      venue.category === venueTypeFilter;
    return matchesSearch && matchesLocation && matchesVenueType;
  });

  return (
    <div className="px-6 pb-20 max-w-7xl mx-auto mt-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* ── Animated header ── */}
      <div
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(-16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-3 text-gray-900 dark:text-gray-100">
          Popular Venues
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Discover and book the best sports venues near you
        </p>
      </div>

      {/* ── Animated filter bar ── */}
      <div
        style={{
          opacity: filterVisible ? 1 : 0,
          transform: filterVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
        }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-8 transition-colors duration-300"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by venue name, location, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                dark:bg-gray-700 dark:text-gray-100
                transition-all duration-300"
            />
          </div>

          {/* Location Filter */}
          <div className="relative min-w-[200px]">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5 pointer-events-none" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none
                bg-white dark:bg-gray-700 dark:text-gray-100 cursor-pointer
                transition-all duration-300"
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
            <SlidersHorizontal className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5 pointer-events-none" />
            <select
              value={venueTypeFilter}
              onChange={(e) => setVenueTypeFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl
                focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none
                bg-white dark:bg-gray-700 dark:text-gray-100 cursor-pointer
                transition-all duration-300"
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
          <div
            className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            style={{ animation: "fadeIn 0.3s ease" }}
          >
            <span>Showing {filteredVenues.length} of {groupedVenues.length} venues</span>
            <button
              onClick={() => { setSearchQuery(""); setLocationFilter("all"); setVenueTypeFilter("all"); }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium ml-2
                transition-colors duration-200 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ── Venue Grid ── */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {filteredVenues.length === 0 && (
          <div
            className="col-span-full text-center py-12"
            style={{ animation: "fadeIn 0.4s ease" }}
          >
            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400 dark:text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No venues found</h3>
            <p className="text-gray-500 dark:text-gray-300">
              {searchQuery || locationFilter !== "all" || venueTypeFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No venues available right now"}
            </p>
          </div>
        )}

        {filteredVenues.slice(0, 6).map((venue, index) => (
          <AnimatedVenueCard key={venue._id} venue={venue} index={index} navigate={navigate} />
        ))}
      </div>

      {filteredVenues.length > 6 && (
        <div
          className="text-center mt-10"
          style={{ animation: "fadeIn 0.5s ease 0.6s both" }}
        >
          <button
            onClick={() => navigate("/venues")}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium
              transition-all duration-300
              hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5
              active:scale-95
              dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            View All {filteredVenues.length} Venues
          </button>
        </div>
      )}

      {/* Keyframe for fadeIn used inline */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default VenueCard;