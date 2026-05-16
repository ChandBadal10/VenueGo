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
    description: "",
    capacity: "",
  });

  const handleAddVenue = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    if (
      !venue.venueName ||
      !venue.venueType ||
      !venue.price ||
      !venue.date ||
      !venue.startTime ||
      !venue.endTime ||
      !venue.location ||
      !venue.description ||
      !venue.capacity
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (!image) {
      toast.error("Please upload an image of the venue");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("venueName", venue.venueName);
      formData.append("venueType", venue.venueType);
      formData.append("price", venue.price);
      formData.append("date", venue.date);
      formData.append("startTime", venue.startTime);
      formData.append("endTime", venue.endTime);
      formData.append("location", venue.location);
      formData.append("description", venue.description);
      formData.append("capacity", venue.capacity);
      formData.append("image", image);

      const res = await fetch("https://venuego-backend.onrender.com/api/addvenue/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Venue added successfully");
        setVenue({
          venueName: "",
          venueType: "",
          price: "",
          date: "",
          startTime: "",
          endTime: "",
          location: "",
          description: "",
          capacity: "",
        });
        setImage(null);
        navigate("/venue-dashboard");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  const inputClass =
    "w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder-gray-400";

  const labelClass = "block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Venue</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill in the details to list your venue for booking.
          </p>
        </div>

        <div className="flex flex-col gap-5">

          {/* Image Upload */}
          <div className="flex items-center gap-4">
            <label htmlFor="venue-image" className="cursor-pointer">
              <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-900">
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Venue Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl">📷</span>
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
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Venue Photo</p>
              <p className="text-xs text-gray-400">{image ? image.name : "Click the box to upload"}</p>
            </div>
          </div>

          {/* Basic Info Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Basic Info</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Venue Name</label>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="e.g. Velocity Futsal"
                  value={venue.venueName}
                  onChange={(e) => setVenue({ ...venue, venueName: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select
                  className={inputClass}
                  value={venue.venueType}
                  onChange={(e) => setVenue({ ...venue, venueType: e.target.value })}
                >
                  <option value="">Select a category</option>
                  <option value="Futsal">Futsal</option>
                  <option value="Cricket">Cricket</option>
                  <option value="BasketBall">BasketBall</option>
                  <option value="Table Tennis">Table Tennis</option>
                  <option value="GYM">GYM</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Dance">Dance</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Price per Hour</label>
                <input
                  className={inputClass}
                  type="number"
                  placeholder="1500"
                  value={venue.price}
                  onChange={(e) => setVenue({ ...venue, price: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Total Slots</label>
                <input
                  className={inputClass}
                  type="number"
                  placeholder="e.g. 20"
                  value={venue.capacity}
                  onChange={(e) => setVenue({ ...venue, capacity: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Schedule Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Schedule</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Date</label>
                <input
                  className={inputClass}
                  type="date"
                  value={venue.date}
                  onChange={(e) => setVenue({ ...venue, date: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Start Time</label>
                <input
                  className={inputClass}
                  type="time"
                  value={venue.startTime}
                  onChange={(e) => setVenue({ ...venue, startTime: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>End Time</label>
                <input
                  className={inputClass}
                  type="time"
                  value={venue.endTime}
                  onChange={(e) => setVenue({ ...venue, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Location & Description Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Details</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Location</label>
                <input
                  className={inputClass}
                  type="text"
                  placeholder="e.g. Shantinagar, Kathmandu"
                  value={venue.location}
                  onChange={(e) => setVenue({ ...venue, location: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  rows="4"
                  placeholder="Describe your venue..."
                  className={`${inputClass} resize-none`}
                  value={venue.description}
                  onChange={(e) => setVenue({ ...venue, description: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleAddVenue}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold transition-colors"
          >
            Add Venue
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddVenue;
