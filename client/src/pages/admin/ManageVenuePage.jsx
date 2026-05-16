import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, ToggleLeft, ToggleRight, Search, Building2 } from "lucide-react";

const normalize = (v) => v?.toString().trim().toLowerCase();

const ManageVenuePage = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const token = localStorage.getItem("token");

  const fetchVenues = async () => {
    try {
      const res = await axios.get("https://venuego-backend.onrender.com/api/admin/venues", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setVenues(res.data.venues);
      } else {
        toast.error("Failed to load venues");
      }
    } catch (err) {
      console.error("Error fetching venues:", err);
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVenues(); }, []);

  const groupedVenues = Object.values(
    venues.reduce((acc, v) => {
      const key = normalize(v.venueName) + "_" + normalize(v.location);
      if (!acc[key]) {
        acc[key] = {
          venueName: v.venueName,
          location: v.location,
          venueType: v.venueType || v.category,
          image: v.image || "",
          isActive: v.isActive,
          owner: v.ownerId,
          slots: [],
        };
      }
      acc[key].slots.push(v);
      if (!acc[key].image && v.image) acc[key].image = v.image;
      return acc;
    }, {})
  );

  const filteredVenues = groupedVenues.filter((venue) => {
    const query = searchQuery.toLowerCase();
    return (
      venue.venueName?.toLowerCase().includes(query) ||
      venue.location?.toLowerCase().includes(query) ||
      venue.venueType?.toLowerCase().includes(query)
    );
  });

  const handleDeleteClick = (venueName, location) => {
    setSelectedVenue({ venueName, location });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedVenue) return;
    try {
      const res = await axios.delete(
        "https://venuego-backend.onrender.com/api/admin/venue/delete-group",
        { headers: { Authorization: `Bearer ${token}` }, data: selectedVenue }
      );
      if (res.data.success) {
        toast.success("Venue deleted successfully");
        fetchVenues();
      } else {
        toast.error(res.data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete venue");
    } finally {
      setShowDeleteModal(false);
      setSelectedVenue(null);
    }
  };

  const toggleAvailability = async (venueName, location) => {
    try {
      const res = await axios.patch(
        "https://venuego-backend.onrender.com/api/admin/venue/toggle-availability",
        { venueName, location },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success(`Venue ${res.data.status}`);
        fetchVenues();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Toggle error:", err);
      toast.error("Failed to update venue");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading venues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Venues</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and control all venues on the platform</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by venue name, location, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Venues Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Venue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Slots</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredVenues.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Building2 className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                          {searchQuery ? "No venues match your search" : "No venues found"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVenues.map((venue, idx) => {
                    const venueImage = venue.image || null;
                    return (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">

                        {/* Venue name + image */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {venueImage ? (
                              <img
                                src={venueImage}
                                alt={venue.venueName}
                                className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.parentElement.innerHTML = `
                                    <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-200">
                                      <span class="text-2xl">🏟️</span>
                                    </div>`;
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                                <span className="text-2xl">🏟️</span>
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{venue.venueName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{venue.location}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4">
                          <span className="text-gray-900 dark:text-gray-200">{venue.venueType}</span>
                        </td>

                        {/* Slots */}
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                            {venue.slots.length}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            venue.isActive
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          }`}>
                            {venue.isActive ? "Available" : "Unavailable"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => toggleAvailability(venue.venueName, venue.location)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                              title={venue.isActive ? "Deactivate" : "Activate"}
                            >
                              {venue.isActive ? (
                                <ToggleRight className="w-6 h-6 text-green-600 dark:text-green-400" />
                              ) : (
                                <ToggleLeft className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteClick(venue.venueName, venue.location)}
                              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                              title="Delete venue"
                            >
                              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Delete Venue</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                {selectedVenue?.venueName}
              </span>
              ? This action cannot be undone and will remove all associated slots.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVenuePage;
