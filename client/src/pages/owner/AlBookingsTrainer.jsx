import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Calendar, Clock, Mail, MapPin, DollarSign, Search, Filter, Eye, ChevronDown, Dumbbell, User } from "lucide-react";

const TrainerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [venueFilter, setVenueFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const fetchTrainerBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/api/trainer-bookings/trainer",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setBookings(res.data.bookings);
      } else {
        toast.error(res.data.message || "Failed to fetch trainer bookings");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch trainer bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerBookings();
  }, []);

  const uniqueVenues = ["all", ...new Set(bookings.map(b => b.venueName).filter(Boolean))];

  const filteredBookings = bookings.filter((b) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      b.user?.name?.toLowerCase().includes(query) ||
      b.user?.email?.toLowerCase().includes(query) ||
      b.venueName?.toLowerCase().includes(query) ||
      b.trainerName?.toLowerCase().includes(query) ||
      b.date?.includes(query);
    const matchesVenue = venueFilter === "all" || b.venueName === venueFilter;
    return matchesSearch && matchesVenue;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "date") return new Date(b.date) - new Date(a.date);
    if (sortBy === "price") return b.price - a.price;
    if (sortBy === "name") return (a.trainerName || "").localeCompare(b.trainerName || "");
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Trainer Bookings</h1>
          <p className="text-gray-600 mt-1">Manage all your booked personal training sessions</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by trainer, customer, venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={venueFilter}
                onChange={(e) => setVenueFilter(e.target.value)}
                className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer min-w-[200px]"
              >
                <option value="all">All Venues</option>
                {uniqueVenues.slice(1).map(venue => (
                  <option key={venue} value={venue}>{venue}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer min-w-[180px]"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="name">Sort by Trainer</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {sortedBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">

                    {/* Trainer identity block */}
                    <div className="mb-5">
                      <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-0.5">
                        Booked Trainer
                      </p>
                      <h3 className="font-bold text-xl text-gray-900 leading-tight">
                        {booking.trainerName}
                      </h3>
                      <span className="inline-block text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium mt-1">
                        {booking.specialization}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 mb-4" />

                    {/* Session details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="bg-indigo-100 p-2 rounded-lg">
                            <MapPin className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Venue</p>
                            <p className="font-medium text-gray-900">{booking.venueName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <DollarSign className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Session Fee</p>
                            <p className="font-bold text-green-600">Rs {booking.price}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Date</p>
                            <p className="font-medium text-gray-900">
                              {new Date(booking.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Clock className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Time</p>
                            <p className="font-medium text-gray-900">{booking.startTime} – {booking.endTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 mt-4 mb-3" />

                    {/* Booked by row */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Booked by:</span>
                      <span className="font-medium text-gray-700">{booking.user?.name}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-500">{booking.user?.email}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex lg:flex-col gap-2 lg:justify-center">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm whitespace-nowrap"
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="max-w-sm mx-auto">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No trainer bookings found</h3>
                <p className="text-gray-500">
                  {searchQuery || venueFilter !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "No trainer sessions have been booked yet"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Trainer hero banner */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                  <p className="text-indigo-200 text-xs uppercase tracking-widest font-semibold mb-1">Booked Trainer</p>
                  <h3 className="text-2xl font-bold mb-1">{selectedBooking.trainerName}</h3>
                  <span className="inline-block text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                    {selectedBooking.specialization}
                  </span>
                  <p className="text-indigo-200 text-xs mt-3">Booking ID: {selectedBooking._id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      Customer Information
                    </h3>
                    <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">Name</span>
                        <p className="font-medium text-gray-900">{selectedBooking.user?.name || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">Email</span>
                        <p className="font-medium text-gray-900">{selectedBooking.user?.email || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      Session Information
                    </h3>
                    <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">Venue</span>
                        <p className="font-medium text-gray-900">{selectedBooking.venueName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">Date</span>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedBooking.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">Time</span>
                        <p className="font-medium text-gray-900">{selectedBooking.startTime} – {selectedBooking.endTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs uppercase tracking-wide">Session Fee</span>
                        <p className="font-bold text-green-600 text-lg">Rs {selectedBooking.price}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
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

export default TrainerBookings;