import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, CheckCircle, XCircle, Search, Building2 } from "lucide-react";

const AdminApproveVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch pending venues when component loads
  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/venues/pending", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
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

  // Approve a venue
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

      if (data.success) {
        setVenues(venues.filter((v) => v._id !== id));
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  // Reject a venue
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

      if (data.success) {
        setVenues(venues.filter((v) => v._id !== id));
      }
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  // Filter venues based on search input
  const filteredVenues = venues.filter((venue) => {
    const query = searchQuery.toLowerCase();
    return (
      venue.venueName?.toLowerCase().includes(query) ||
      venue.location?.toLowerCase().includes(query) ||
      venue.email?.toLowerCase().includes(query) ||
      venue.phone?.toLowerCase().includes(query)
    );
  });

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading venues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Venue Approvals</h1>
          <p className="text-gray-600 mt-1">Review and approve venue registration requests</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Venues</p>
                <p className="text-2xl font-bold text-gray-900">{venues.length}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Filtered Results</p>
              <p className="text-2xl font-bold text-indigo-600">{filteredVenues.length}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by venue name, location, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Venues List */}
        {filteredVenues.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? "No matching venues" : "No pending venues"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "All venue requests have been processed"}
            </p>
          </div>
        ) : (
          // Venue Cards
          <div className="space-y-4">
            {filteredVenues.map((venue) => (
              <div
                key={venue._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row gap-6">

                  {/* Venue Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={`http://localhost:3000/${venue.image.replace(/\\/g, "/")}`}
                      alt={venue.venueName}
                      className="w-40 h-40 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>

                  {/* Venue Information */}
                  <div className="flex-1">
                    {/* Venue Name & Status */}
                    <div className="flex items-center gap-3 mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {venue.venueName}
                      </h2>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
                        {venue.status}
                      </span>
                    </div>

                    {/* Contact Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg mt-0.5">
                          <MapPin className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Location</p>
                          <p className="text-gray-900 font-medium">{venue.location}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 p-2 rounded-lg mt-0.5">
                          <Phone className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Phone</p>
                          <p className="text-gray-900 font-medium">{venue.phone}</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start gap-3 md:col-span-2">
                        <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Email</p>
                          <p className="text-gray-900 font-medium">{venue.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-xs mb-1">Description</p>
                      <p className="text-gray-700 text-sm">{venue.description}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex lg:flex-col gap-3 lg:justify-center">
                    <button
                      onClick={() => handleApprove(venue._id)}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(venue._id)}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApproveVenues;