import React, { useEffect, useState, useContext } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { AppContext } from "../../context/AppContext";

const AdminDashboard = () => {
  const { axios, token } = useContext(AppContext);
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Detect dark mode for chart colors
  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
    if (token) fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      if (!data.success) {
        setError(data.message || "Failed to load dashboard");
        setLoading(false);
        return;
      }

      setStats([
        { title: "Total Users",        value: data.totalUsers },
        { title: "Total Venue Owners", value: data.totalVenueOwners },
        { title: "Total Venues",       value: data.addVenues },
        { title: "Total Bookings",     value: data.totalBookings },
        { title: "Total Revenue",      value: `Rs ${data.totalRevenue?.toLocaleString()}` },
      ]);

      setRevenueData(data.revenueData || []);
      setBookingData(data.bookingData || []);
      setLoading(false);
    } catch (err) {
      console.log("Dashboard Error:", err);
      setError(err.response?.data?.message || "Unauthorized or server error");
      setLoading(false);
    }
  };

  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow max-w-sm w-full text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-200 text-lg">
            You must login as admin to view the dashboard.
          </p>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 dark:border-white mb-3"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow max-w-sm w-full text-center border border-gray-200 dark:border-gray-700">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-gray-900 dark:bg-gray-700 text-white px-4 sm:px-6 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-6 px-3 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-1">
                {item.title}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Monthly Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              Monthly Revenue
            </h2>
            <div className="h-48 sm:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#e0f2fe"}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: isDark ? "#9ca3af" : "#374151" }}
                  />
                  <YAxis
                    tick={{ fill: isDark ? "#9ca3af" : "#374151" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1f2937" : "#e0f2fe",
                      border: isDark ? "1px solid #374151" : "none",
                      borderRadius: 6,
                      color: isDark ? "#f9fafb" : "#111827",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Bookings Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
              Weekly Bookings
            </h2>
            <div className="h-48 sm:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#e0f2fe"}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: isDark ? "#9ca3af" : "#374151" }}
                  />
                  <YAxis
                    tick={{ fill: isDark ? "#9ca3af" : "#374151" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1f2937" : "#e0f2fe",
                      border: isDark ? "1px solid #374151" : "none",
                      borderRadius: 6,
                      color: isDark ? "#f9fafb" : "#111827",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;