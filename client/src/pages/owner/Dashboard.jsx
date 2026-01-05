import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-2xl font-semibold mb-2">
        Venue Owner Dashboard
      </h1>

      <p className="text-gray-500 mb-8 max-w-3xl">
        Monitor overall platform performance including total venues, booking,
        revenue, and recent activities
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-gray-100 rounded-xl p-6">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <h2 className="text-xl font-semibold mt-1">
            Rs {data.totalRevenue}
          </h2>
        </div>

        <div className="bg-gray-100 rounded-xl p-6">
          <p className="text-gray-600 text-sm">Total Venues</p>
          <h2 className="text-xl font-semibold mt-1">
            {data.totalVenues}
          </h2>
        </div>

        <div className="bg-gray-100 rounded-xl p-6">
          <p className="text-gray-600 text-sm">Total Bookings</p>
          <h2 className="text-xl font-semibold mt-1">
            {data.totalBookings}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 rounded-xl p-6 md:col-span-2">
          <h3 className="font-semibold mb-1">Recent Bookings</h3>
          <p className="text-gray-500 text-sm mb-6">
            Latest customer bookings
          </p>

          {data.recentBookings.length === 0 ? (
            <div className="text-gray-400 text-sm">
              No recent bookings available
            </div>
          ) : (
            <ul className="space-y-3">
              {data.recentBookings.map((b, i) => (
                <li
                  key={i}
                  className="bg-white p-3 rounded-lg border text-sm flex justify-between"
                >
                  <div>
                    <p className="font-medium">{b.venueName}</p>
                    <p className="text-gray-500 text-xs">
                      {b.date} • {b.startTime} - {b.endTime}
                    </p>
                  </div>
                  <div className="font-semibold text-green-600">
                    Rs {b.price}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-100 rounded-xl p-6">
          <h3 className="font-semibold mb-1">Monthly Revenue</h3>
          <p className="text-gray-500 text-sm mb-4">
            Revenue for current month
          </p>
          <p className="text-blue-600 text-xl font-semibold">
            Rs {data.monthlyRevenue}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
