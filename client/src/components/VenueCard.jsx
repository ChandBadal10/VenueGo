import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    fetch("http://localhost:3000/api/addvenue/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setVenues(data.venues);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-20">Loading venues...</p>;
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

  return (
    <div className="px-6 pb-20 max-w-7xl mx-auto mt-20">
      <h2 className="text-3xl font-bold text-center mb-10">
        Popular Venues
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
        {groupedVenues.slice(0, 6).map((venue) => (
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

        {groupedVenues.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No venues available right now
          </p>
        )}
      </div>
    </div>
  );
};

export default VenueCard;
