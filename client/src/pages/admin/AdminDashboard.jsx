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

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
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

      // Stats for cards
      setStats([
        { title: "Total Users", value: data.totalUsers },
        { title: "Total Venue Owners", value: data.totalVenueOwners },
        { title: "Total Venues", value: data.addVenues },
        { title: "Total Bookings", value: data.totalBookings },
        {
          title: "Total Revenue",
          value: `Rs ${data.totalRevenue?.toLocaleString()}`,
        },
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center border">
          <p className="text-gray-700 text-lg">
            You must login as admin to view the dashboard.
          </p>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center border">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-6 border hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-gray-600 mb-2">{item.title}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-4 border">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Monthly Revenue
            </h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#374151" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Bookings Chart */}
          <div className="bg-white rounded-lg shadow p-4 border">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Weekly Bookings
            </h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280" }} />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#374151"
                    strokeWidth={2}
                    dot={{ fill: "#374151", r: 3 }}
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
