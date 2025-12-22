import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function VenueSection() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const filters = ["All", "Futsal", "Cricket", "BasketBall", "Table Tennis"];

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/addvenue/all");
        const data = await res.json();
        if (data.success) {
          setVenues(data.venues);
        }
      } catch (err) {
        console.log("Error fetching venues", err.message);
      }
      setLoading(false);
    };

    fetchVenues();
  }, []);

  // search + category filter
  const filteredVenues = venues.filter((v) => {
    const matchSearch =
      v.venueName.toLowerCase().includes(search.toLowerCase()) ||
      v.location.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      activeFilter === "All" ||
      v.venueType.toLowerCase() === activeFilter.toLowerCase();

    return matchSearch && matchFilter;
  });

  // GROUP venues by same name + same location
  const groupedVenues = Object.values(
    filteredVenues.reduce((acc, v) => {
      const key = (v.venueName.trim().toLowerCase() + "_" + v.location.trim().toLowerCase());
      if (!acc[key]) {
        acc[key] = {
          ...v,
          slots: [
            {
              _id: v._id,
              date: v.date,
              startTime: v.startTime,
              endTime: v.endTime,
            }
          ]
        };
      } else {
        acc[key].slots.push({
          _id: v._id,
          date: v.date,
          startTime: v.startTime,
          endTime: v.endTime,
        });
      }
      return acc;
    }, {})
  );

  if (loading) return <h2 className="p-10 text-center">Loading venues...</h2>;

  return (
    <div className="w-full bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="rounded-2xl p-8 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg">
          <h2 className="text-2xl font-bold">Available Venues</h2>
          <p className="text-white/90 mt-1">Browse our selection of premium venues</p>

          <div className="mt-5 flex gap-3 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, location"
              className="flex-1 rounded-full px-4 py-2 bg-white text-gray-800 outline-none"
            />
            <button className="px-4 py-2 rounded-full bg-white text-blue-600 font-semibold shadow">
              Search
            </button>
          </div>

          <div className="mt-4 flex gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-sm px-3 py-1 rounded-full border transition ${
                  activeFilter === f ? "bg-white text-blue-700" : "bg-white/10 text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-6 mb-3">
          Showing <b>{groupedVenues.length}</b> venues
        </p>

        {/* Now show 1 card per venue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer">
          {groupedVenues.map((venue) => (
            <div
              key={venue._id}
              onClick={() => navigate(`/venue-details/${venue._id}`)}
              className="rounded-lg shadow bg-white hover:shadow-md transition p-2"
            >
              <img
                src={
                  venue.image ||
                  "https://images.unsplash.com/photo-1600679472829-3044539ce8ed"
                }
                alt={venue.venueName}
                className="rounded-md w-full h-44 object-cover"
              />
              <div className="mt-2">
                <h3 className="font-medium">{venue.venueName}</h3>
                <p className="text-gray-600 text-sm">{venue.location}</p>
                <p className="text-blue-600 text-sm">
                  Rs {venue.price}/hr • {venue.venueType}
                </p>

                {/* show total slot count */}
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
