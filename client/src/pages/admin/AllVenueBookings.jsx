import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Calendar, Clock, User, Mail, MapPin, DollarSign, Search, Filter, Eye, ChevronDown } from "lucide-react";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [venueFilter, setVenueFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/bookings/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setBookings(res.data.bookings);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const uniqueVenues = ["all", ...new Set(bookings.map(b => b.venueName).filter(Boolean))];

  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      booking.userId?.name?.toLowerCase().includes(query) ||
      booking.userId?.email?.toLowerCase().includes(query) ||
      booking.venueName?.toLowerCase().includes(query) ||
      booking.date?.includes(query);
    const matchesVenue = venueFilter === "all" || booking.venueName === venueFilter;
    return matchesSearch && matchesVenue;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "date") return new Date(b.date) - new Date(a.date);
    else if (sortBy === "price") return b.price - a.price;
    else if (sortBy === "name") return (a.userId?.name || "").localeCompare(b.userId?.name || "");
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all bookings for your venues</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by customer name, email, venue, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
              <select
                value={venueFilter}
                onChange={(e) => setVenueFilter(e.target.value)}
                className="pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer min-w-[200px]"
              >
                <option value="all">All Venues</option>
                {uniqueVenues.slice(1).map(venue => (
                  <option key={venue} value={venue}>{venue}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none cursor-pointer min-w-[180px]"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="name">Sort by Name</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {sortedBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                          {booking.userId?.name || "N/A"}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span>{booking.userId?.email || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="bg-indigo-100 dark:bg-indigo-700/20 p-2 rounded-lg">
                            <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Venue</p>
                            <p className="font-medium text-gray-900 dark:text-white">{booking.venueName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="bg-green-100 dark:bg-green-700/20 p-2 rounded-lg">
                            <DollarSign className="w-4 h-4 text-green-600 dark:text-green-300" />
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Amount</p>
                            <p className="font-bold text-green-600 dark:text-green-300">Rs {booking.price}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="bg-blue-100 dark:bg-blue-700/20 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">{booking.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="bg-purple-100 dark:bg-purple-700/20 p-2 rounded-lg">
                            <Clock className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">Time</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {booking.startTime} – {booking.endTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2 lg:justify-center">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sortedBookings.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bookings found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery || venueFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "No bookings have been made yet"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{selectedBooking.venueName}</h3>
                  <p className="text-indigo-200 text-xs">Booking ID: {selectedBooking._id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                      Customer Information
                    </h3>
                    <div className="space-y-3 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div>
                        <span className="text-gray-400 dark:text-gray-300 text-xs uppercase tracking-wide">Name</span>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.userId?.name || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 dark:text-gray-300 text-xs uppercase tracking-wide">Email</span>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.userId?.email || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                      Booking Information
                    </h3>
                    <div className="space-y-3 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div>
                        <span className="text-gray-400 dark:text-gray-300 text-xs uppercase tracking-wide">Date</span>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedBooking.date}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 dark:text-gray-300 text-xs uppercase tracking-wide">Time</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedBooking.startTime} – {selectedBooking.endTime}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 dark:text-gray-300 text-xs uppercase tracking-wide">Amount</span>
                        <p className="font-bold text-green-600 dark:text-green-300 text-lg">Rs {selectedBooking.price}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;