import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-hot-toast";

const normalize = (v) => v?.toString().trim().toLowerCase();

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ---------------- FETCH OWNER VENUES ----------------
  const fetchVenues = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/addvenue/all", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        setVenues(res.data.venues);
      }
    } catch (err) {
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // ---------------- GROUP BY NAME + LOCATION ----------------
  const groupedVenues = Object.values(
    venues.reduce((acc, v) => {
      const key = normalize(v.venueName) + "_" + normalize(v.location);

      if (!acc[key]) {
        acc[key] = {
          venueName: v.venueName,
          location: v.location,
          venueType: v.venueType,
          image: v.image,
          isActive: v.isActive,
          slots: []
        };
      }

      acc[key].slots.push(v);
      return acc;
    }, {})
  );

  // ---------------- DELETE VENUE ----------------
  const handleDelete = async (venueName, location) => {
    if (!window.confirm("Delete this venue permanently?")) return;

    try {
      const res = await axios.delete(
        "http://localhost:3000/api/venue/delete-group",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { venueName, location }
        }
      );

      if (res.data.success) {
        toast.success("Venue deleted");
        fetchVenues();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  // ---------------- TOGGLE AVAILABILITY ----------------
  const toggleAvailability = async (venueName, location) => {
    try {
      const res = await axios.patch(
        "http://localhost:3000/api/venue/toggle-availability",
        { venueName, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(`Venue ${res.data.status}`);
        fetchVenues();
      }
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <p className="p-10 text-center">Loading venues...</p>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Venues</h1>
      <p className="text-gray-500 mb-6">
        View, enable, disable or delete your venues
      </p>

      <div className="bg-white rounded-xl shadow border">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4">Venue</th>
              <th>Type</th>
              <th>Slots</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {groupedVenues.map((venue, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-4 flex items-center gap-4">
                  <img
                    src={
                      venue.image ||
                      "https://images.unsplash.com/photo-1600679472829-3044539ce8ed"
                    }
                    alt={venue.venueName}
                    className="w-16 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-semibold">{venue.venueName}</p>
                    <p className="text-sm text-gray-500">{venue.location}</p>
                  </div>
                </td>

                <td>{venue.venueType}</td>

                <td>{venue.slots.length}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      venue.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {venue.isActive ? "Available" : "Unavailable"}
                  </span>
                </td>

                <td className="text-center">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() =>
                        toggleAvailability(venue.venueName, venue.location)
                      }
                      className="text-blue-600 hover:scale-110 transition"
                      title="Toggle availability"
                    >
                      {venue.isActive ? (
                        <ToggleRight size={22} />
                      ) : (
                        <ToggleLeft size={22} />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(venue.venueName, venue.location)
                      }
                      className="text-red-600 hover:scale-110 transition"
                      title="Delete venue"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {groupedVenues.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No venues found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageVenues;
