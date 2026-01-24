import React, { useEffect, useState } from "react";
import axios from "axios";
import { DollarSign, MapPin, Calendar, TrendingUp, Clock, User, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    totalVenues: 0,
    totalBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0
  });

  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/dashboard/owner",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Dashboard fetch failed", error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Limit recent bookings to 6
  const limitedBookings = data.recentBookings.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Venue Owner Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your platform performance, venues, bookings, and revenue
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
            <h2 className="text-2xl font-bold text-gray-900">
              Rs {data.totalRevenue.toLocaleString()}
            </h2>
          </div>

          {/* Total Venues */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Venues</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {data.totalVenues}
            </h2>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {data.totalBookings}
            </h2>
          </div>

          {/* Monthly Revenue */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-600 text-sm mb-1">Monthly Revenue</p>
            <h2 className="text-2xl font-bold text-gray-900">
              Rs {data.monthlyRevenue.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Recent Bookings</h3>
                <p className="text-gray-600 text-sm">
                  Latest customer bookings (showing {limitedBookings.length} of {data.recentBookings.length})
                </p>
              </div>
              {data.recentBookings.length > 6 && (
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  View All
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {limitedBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-gray-900 font-medium mb-1">No recent bookings</h4>
                <p className="text-gray-500 text-sm">
                  Bookings will appear here once customers start booking your venues
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {limitedBookings.map((booking, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200 hover:shadow-md hover:border-indigo-300 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-600" />
                          {booking.venueName}
                        </h4>
                        {booking.user?.name && (
                          <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                            <User className="w-3.5 h-3.5" />
                            {booking.user.name}
                          </p>
                        )}
                      </div>
                      <div className="bg-green-100 px-3 py-1 rounded-full">
                        <p className="text-green-700 font-bold text-sm">
                          Rs {booking.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span>{booking.startTime} - {booking.endTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;