import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";



const AddVenue = () => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const [venue, setVenue] = useState({
    venueName: "",
    venueType: "",
    price: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    description: ""
  });

  const handleAddVenue = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("User not logged in");
    return;
  }

  const res = await fetch("http://localhost:3000/api/addvenue/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(venue)
  });

  const data = await res.json();

  if (data.success) {
    toast.success(data.message || "Venue added successfully");

    // Reset form
    setVenue({
      venueName: "",
      venueType: "",
      price: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      description: ""
    });

    setImage(null);
    navigate("/venue-dashboard")
  } else {
    toast.error(data.message || "Something went wrong");
  }
};


  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <h1 className="text-2xl font-semibold mb-1">Add New Venue</h1>
      <p className="text-gray-500 mb-6">
        Fill in details to list a new venue for booking, including pricing,
        availability, and venue specifications.
      </p>

      <form className="flex flex-col gap-6 text-gray-600 text-sm max-w-xl">
        {/* Image Upload */}
        <div className="flex items-center gap-3">
          <label htmlFor="venue-image" className="cursor-pointer">
            <div className="h-20 w-20 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Venue Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">Upload</span>
              )}
            </div>
            <input
              type="file"
              id="venue-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>
        <p className="text-sm text-gray-500">Upload a picture of your venue</p>

        {/* Venue Name + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm">Venue Name</label>
            <input
              className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none"
              type="text"
              placeholder="e.g. Velocity Futsal"
              value={venue.venueName}
              onChange={(e) =>
                setVenue({ ...venue, venueName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm">Category</label>
            <select
              className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none"
              value={venue.venueType}
              onChange={(e) =>
                setVenue({ ...venue, venueType: e.target.value })
              }
            >
              <option value="">Select a category</option>
              <option value="Futsal">Futsal</option>
              <option value="Cricket">Cricket</option>
              <option value="BasketBall">BasketBall</option>
              <option value="Table Tennis">Table Tennis</option>
              <option value="GYM">GYM</option>
            </select>
          </div>
        </div>

        {/* Price, Date, Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm">Price per Hour</label>
            <input
              className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none"
              type="number"
              placeholder="1500"
              value={venue.price}
              onChange={(e) => setVenue({ ...venue, price: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm">Date</label>
            <input
              type="date"
              className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none"
              value={venue.date}
              onChange={(e) => setVenue({ ...venue, date: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm">Start Time</label>
            <input
              type="time"
              className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none"
              value={venue.startTime}
              onChange={(e) =>
                setVenue({ ...venue, startTime: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-sm">End Time</label>
            <input
              type="time"
              className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none"
              value={venue.endTime}
              onChange={(e) => setVenue({ ...venue, endTime: e.target.value })}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm">Location</label>
          <input
            type="text"
            placeholder="e.g. Shantinagar, Kathmandu"
            className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none"
            value={venue.location}
            onChange={(e) => setVenue({ ...venue, location: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm">Description</label>
          <textarea
            rows="4"
            placeholder="e.g. Great futsal."
            className="w-full mt-1 bg-gray-200 px-4 py-2 rounded-md outline-none resize-none"
            value={venue.description}
            onChange={(e) =>
              setVenue({ ...venue, description: e.target.value })
            }
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleAddVenue}
          className="bg-gray-300 px-6 py-2 rounded-md font-medium hover:bg-gray-400"
        >
          Add Venue
        </button>
      </form>
    </div>
  );
};

export default AddVenue;
