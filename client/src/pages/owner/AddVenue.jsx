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
      formData.append("capacity", venue.capacity); // ✅ THIS WAS THE BUG — was missing
      formData.append("image", image);

      const res = await fetch("http://localhost:3000/api/addvenue/create", {
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

  return (
    <div className="px-4 py-10 md:px-10 flex-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 min-h-screen">
      <h1 className="text-2xl font-semibold mb-1">Add New Venue</h1>

      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Fill in details to list a new venue for booking, including pricing,
        availability, and venue specifications.
      </p>

      <form className="flex flex-col gap-6 text-sm max-w-xl">

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label htmlFor="venue-image" className="cursor-pointer w-fit">
            <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Upload a picture of your venue
          </p>
        </div>

        {/* Venue Name + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm">Venue Name</label>
            <input
              className="w-full mt-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md outline-none"
              type="text"
              placeholder="e.g. Velocity Futsal"
              value={venue.venueName}
              onChange={(e) => setVenue({ ...venue, venueName: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm">Category</label>
            <select
              className="w-full mt-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md outline-none"
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
        </div>

        {/* Price / Capacity / Date / Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm">Price per Hour</label>
            <input
              className="w-full mt-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md outline-none"
              type="number"
              placeholder="1500"
              value={venue.price}
              onChange={(e) => setVenue({ ...venue, price: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm">Total Slots</label>
            <input
              type="number"
              placeholder="e.g. 20"
              className="w-full mt-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md outline-none"
              value={venue.capacity}
              onChange={(e) => setVenue({ ...venue, capacity: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm">Date</label>
            <input
              type="date"
              className="w-full mt-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md outline-none"
              value={venue.date}
              onChange={(e) => setVenue({ ...venue, date: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm">Start Time</label>
            <input
              type="time"
              className="w-full mt-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md outline-none"
              value={venue.startTime}
              onChange={(e) => setVenue({ ...venue, startTime: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm">End Time</label>
            <input
              type="time"
              className="w-full mt-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md outline-none"
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
            className="w-full mt-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md outline-none"
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
            className="w-full mt-1 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md outline-none resize-none"
            value={venue.description}
            onChange={(e) => setVenue({ ...venue, description: e.target.value })}
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleAddVenue}
          className="bg-gray-300 dark:bg-gray-700 dark:text-white px-6 py-2 rounded-md font-medium hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Add Venue
        </button>

      </form>
    </div>
  );
};

export default AddVenue;