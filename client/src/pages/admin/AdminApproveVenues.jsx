import React, { useEffect, useState } from "react";
import {
  MapPin, Phone, Mail, CheckCircle, XCircle,
  Clock, Search, AlertCircle, Building2, Eye,
} from "lucide-react";

const AdminApproveVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/venues/pending", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.venues)) {
          setVenues(data.venues);
        }
      } catch (err) {
        console.error("Error fetching venues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/venue/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ venueId: id }),
      });
      const data = await res.json();
      if (data.success) { setVenues(venues.filter((v) => v._id !== id)); setSelectedVenue(null); }
    } catch (err) { console.error("Approve error:", err); }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/venue/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ venueId: id }),
      });
      const data = await res.json();
      if (data.success) { setVenues(venues.filter((v) => v._id !== id)); setSelectedVenue(null); }
    } catch (err) { console.error("Reject error:", err); }
  };

  const handleDownloadImage = async (imageUrl, venueName) => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${venueName || "venue-document"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download image");
    }
  };

  const filteredVenues = venues.filter((venue) => {
    const query = searchQuery.toLowerCase();
    return (
      venue.venueName?.toLowerCase().includes(query) ||
      venue.location?.toLowerCase().includes(query) ||
      venue.email?.toLowerCase().includes(query) ||
      venue.phone?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading pending venues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Venue Approvals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and approve venue registration requests
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by venue name, location, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Venues List */}
        {filteredVenues.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400 dark:text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "No matching venues" : "No pending venues"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? "Try adjusting your search criteria" : "All venue requests have been processed"}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVenues.map((venue) => {
              const venueImage = venue.image || null;
              return (
                <div
                  key={venue._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">

                      {/* Venue Image */}
                      <div className="flex-shrink-0">
                        {venueImage ? (
                          <img
                            src={venueImage}
                            alt={venue.venueName}
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML = `
                                <div class="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-200">
                                  <span class="text-4xl">🏟️</span>
                                </div>`;
                            }}
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                            <span className="text-4xl">🏟️</span>
                          </div>
                        )}
                      </div>

                      {/* Venue Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                              {venue.venueName}
                            </h2>
                            <span className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {venue.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="bg-indigo-100 dark:bg-indigo-700/20 p-2 rounded-lg">
                                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Location</p>
                                <p className="font-medium text-gray-900 dark:text-white">{venue.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="bg-green-100 dark:bg-green-700/20 p-2 rounded-lg">
                                <Phone className="w-4 h-4 text-green-600 dark:text-green-300" />
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Phone</p>
                                <p className="font-medium text-gray-900 dark:text-white">{venue.phone}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <div className="bg-blue-100 dark:bg-blue-700/20 p-2 rounded-lg">
                                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs">Email</p>
                                <p className="font-medium text-gray-900 dark:text-white">{venue.email}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Description</p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">{venue.description}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex lg:flex-col gap-2 lg:justify-center lg:min-w-[140px]">
                        <button
                          onClick={() => setSelectedVenue(venue)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm whitespace-nowrap"
                        >
                          <Eye className="w-4 h-4" /> View Details
                        </button>
                        <button
                          onClick={() => handleApprove(venue._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm whitespace-nowrap"
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(venue._id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm whitespace-nowrap"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Venue Details</h2>
                <button
                  onClick={() => setSelectedVenue(null)}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Venue Image */}
                <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  {selectedVenue.image ? (
                    <img
                      src={selectedVenue.image}
                      alt={selectedVenue.venueName}
                      className="w-full h-full object-contain bg-gray-100 dark:bg-gray-700"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-8xl mb-4">🏟️</div>
                        <p className="text-lg font-medium">No Image Available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Actions */}
                {selectedVenue.image && (
                  <div className="flex gap-3">
                    <a
                      href={selectedVenue.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      Open Full Image
                    </a>
                    <button
                      onClick={() => handleDownloadImage(selectedVenue.image, selectedVenue.venueName)}
                      className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                    >
                      Download Image
                    </button>
                  </div>
                )}

                {/* Venue Header Banner */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">{selectedVenue.venueName}</h3>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {selectedVenue.status}
                    </span>
                  </div>
                  <p className="text-indigo-200 text-sm">Venue ID: {selectedVenue._id}</p>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedVenue.email}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedVenue.phone}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg md:col-span-2">
                      <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedVenue.location}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                    Description
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">{selectedVenue.description}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleApprove(selectedVenue._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-semibold"
                  >
                    <CheckCircle className="w-5 h-5" /> Approve Venue
                  </button>
                  <button
                    onClick={() => handleReject(selectedVenue._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-semibold"
                  >
                    <XCircle className="w-5 h-5" /> Reject Venue
                  </button>
                </div>
                <button
                  onClick={() => setSelectedVenue(null)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApproveVenues;