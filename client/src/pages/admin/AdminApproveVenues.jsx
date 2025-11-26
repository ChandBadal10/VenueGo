import React, { useEffect, useState } from "react";

const AdminApproveVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/venues/pending", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        const text = await res.text();
        console.log("Raw response:", text);

        const data = JSON.parse(text);
        console.log("Parsed data:", data);

        if (data.success && Array.isArray(data.venues)) {
          setVenues(data.venues);
        } else {
          console.warn("No venues or unexpected format");
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
      if (data.success) {
        setVenues(venues.filter((v) => v._id !== id));
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
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
      if (data.success) {
        setVenues(venues.filter((v) => v._id !== id));
      }
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  if (loading) return <p className="p-8">Loading pending venues...</p>;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-2">Approve Venues</h1>
      <p className="mb-6 text-gray-600">
        Track all venue registrations, approve or reject requests.
      </p>

      {venues.length === 0 ? (
        <p className="text-gray-500">No pending venues at the moment.</p>
      ) : (
        <div className="space-y-6">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="border rounded-lg p-6 bg-white flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Venue Image */}
              <img
                src={`http://localhost:3000/${venue.image.replace(/\\/g, "/")}`}
                alt={venue.venueName}
                className="w-24 h-24 object-cover rounded-full"
              />

              {/* Venue Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold">{venue.venueName}</h2>
                  <span className="text-sm px-2 py-1 rounded bg-yellow-200 text-yellow-800">
                    {venue.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{venue.description}</p>
                <p className="text-gray-600">{venue.location}</p>
                <p className="text-gray-600">{venue.phone}</p>
                <p className="text-gray-600">{venue.email}</p>
              </div>

              {/* Approve / Reject Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={() => handleApprove(venue._id)}
                >
                  Approve
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  onClick={() => handleReject(venue._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApproveVenues;
