import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

/* ---------- MOCK DATA ---------- */

const stats = [
  { title: "Total Venues", value: 24 },
  { title: "Pending Approvals", value: 5 },
  { title: "Total Bookings", value: 312 },
  { title: "Total Revenue", value: "Rs 145,000" },
];

const revenueData = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 26000 },
  { month: "May", revenue: 34000 },
];

const bookingData = [
  { day: "Mon", bookings: 18 },
  { day: "Tue", bookings: 24 },
  { day: "Wed", bookings: 15 },
  { day: "Thu", bookings: 28 },
  { day: "Fri", bookings: 40 },
];



/* ---------- COMPONENT ---------- */

const AdminDashboard = () => {
  return (
    <div className="p-8 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">
          Monitor platform performance and activities
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="font-semibold mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="font-semibold mb-4">Bookings Trend</h2>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={bookingData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


    </div>
  );
};

export default AdminDashboard;
