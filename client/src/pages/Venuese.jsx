import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const normalize = (v) => v?.toString().trim().toLowerCase();

const getPriceRange = (slots) => {
  const prices = slots.map(s => s.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `Rs ${min}/hr` : `Rs ${min} – Rs ${max}/hr`;
};

export default function VenueSection() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/addvenue/all")
      .then(res => res.json())
      .then(data => {
        if (data.success) setVenues(data.venues);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 className="p-10 text-center">Loading venues...</h2>;

  const groupedVenues = Object.values(
    venues.reduce((acc, v) => {
      const key = normalize(v.venueName) + "_" + normalize(v.location);

      if (!acc[key]) {
        acc[key] = {
          ...v,
          slots: []
        };
      }

      acc[key].slots.push({
        _id: v._id,
        date: v.date,
        startTime: v.startTime,
        endTime: v.endTime,
        price: v.price
      });

      return acc;
    }, {})
  );

  return (
    <div className="w-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-6">Available Venues</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {groupedVenues.map((venue) => (
            <div
              key={venue._id}
              onClick={() => navigate(`/venue-details/${venue._id}`)}
              className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={venue.image || "https://images.unsplash.com/photo-1600679472829-3044539ce8ed"}
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
