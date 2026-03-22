import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const normalize = (v) => v?.toString().trim().toLowerCase();

const ManageVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const token = localStorage.getItem("token");

  const fetchVenues = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/addvenue/owner",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const groupedVenues = Object.values(
    venues.reduce((acc, v) => {
      const key = normalize(v.venueName) + "_" + normalize(v.location);

      if (!acc[key]) {
        acc[key] = {
          venueName: v.venueName,
          location: v.location,
          venueType: v.venueType,
          image: v.image,
          isActive: v.isActive ?? true,
          slots: [],
        };
      }

      acc[key].slots.push(v);
      return acc;
    }, {})
  );

  const handleDeleteClick = (venueName, location) => {
    setSelectedVenue({ venueName, location });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedVenue) return;

    try {
      const res = await axios.delete(
        "http://localhost:3000/api/venue/delete-group",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: selectedVenue,
        }
      );

      if (res.data.success) {
        toast.success("Venue deleted successfully");
        fetchVenues();
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setShowDeleteModal(false);
      setSelectedVenue(null);
    }
  };

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

  if (loading)
    return (
      <p className="p-10 text-center text-gray-700 dark:text-gray-300">
        Loading venues...
      </p>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">

      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        Manage Venues
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm md:text-base">
        View, enable, disable, or delete your venues
      </p>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 overflow-x-auto">
        <table className="w-full">

          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
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
              <tr key={idx} className="border-t dark:border-gray-700">

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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {venue.location}
                    </p>
                  </div>
                </td>

                <td>{venue.venueType}</td>

                <td>{venue.slots.length}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      venue.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
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
                      className="transition hover:scale-110"
                    >
                      <span
                        className={`material-symbols-outlined text-[30px] ${
                          venue.isActive
                            ? "text-green-600"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {venue.isActive ? "toggle_on" : "toggle_off"}
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteClick(venue.venueName, venue.location)
                      }
                      className="hover:scale-110 transition"
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        delete
                      </span>
                    </button>

                  </div>
                </td>
              </tr>
            ))}

            {groupedVenues.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No venues found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">

        {groupedVenues.map((venue, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow p-4 space-y-3"
          >

            <div className="flex items-center gap-3">
              <img
                src={
                  venue.image ||
                  "https://images.unsplash.com/photo-1600679472829-3044539ce8ed"
                }
                alt={venue.venueName}
                className="w-20 h-14 rounded object-cover"
              />

              <div>
                <p className="font-semibold text-base">{venue.venueName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {venue.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">

              <div>
                <p className="text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium">{venue.venueType}</p>
              </div>

              <div>
                <p className="text-gray-500 dark:text-gray-400">Slots</p>
                <p className="font-medium">{venue.slots.length}</p>
              </div>

            </div>

            <div className="flex items-center justify-between">

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  venue.isActive
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {venue.isActive ? "Available" : "Unavailable"}
              </span>

              <div className="flex gap-3">

                <button
                  onClick={() =>
                    toggleAvailability(venue.venueName, venue.location)
                  }
                  className="px-3 py-1 border dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                >
                  {venue.isActive ? "Disable" : "Enable"}
                </button>

                <button
                  onClick={() =>
                    handleDeleteClick(venue.venueName, venue.location)
                  }
                  className="px-3 py-1 border rounded-md bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300"
                >
                  Delete
                </button>

              </div>
            </div>
          </div>
        ))}

        {groupedVenues.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No venues found
          </p>
        )}
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Delete Venue
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-red-600">
                {selectedVenue?.venueName}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
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

export default ManageVenues;