import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    venueName: "",
    category: "",
    phone: "",
    email: "",
    location: "",
    description: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to register a venue");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      setLoading(true);
      const res = await fetch("https://venuego-backend.onrender.com/api/venue/register", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await res.json();
      setLoading(false);

      if (result.success) {
        toast.success(result.message || "Venue registered successfully!");
        setFormData({
          venueName: "",
          category: "",
          phone: "",
          email: "",
          location: "",
          description: "",
          image: null,
        });
        navigate("/"); // redirect after registration
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 transition-colors">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors"
      >
        <h2 className="text-3xl font-semibold text-center mb-10 text-blue-600 dark:text-blue-400">
          Register Your Venue
        </h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <label className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
            {formData.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 dark:text-gray-300 text-sm text-center">
                Upload a picture
              </span>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Upload a picture of your venue
          </p>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Venue Name</label>
            <input
              type="text"
              name="venueName"
              placeholder="e.g. Velocity Futsal"
              value={formData.venueName}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            >
              <option value="">Select a category</option>
              <option value="Futsal">Futsal</option>
              <option value="Gym">Gym</option>
              <option value="Swimming">Swimming</option>
              <option value="Tennis">Tennis</option>
              <option value="Badminton">Badminton</option>
              <option value="Cricket">Cricket</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="123456789"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 dark:text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm text-gray-600 dark:text-gray-300">Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Shantinagar, Kathmandu"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="mt-6">
          <label className="text-sm text-gray-600 dark:text-gray-300">Description</label>
          <textarea
            name="description"
            placeholder="Write a short description of your venue"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-10 w-full py-3 rounded-lg text-white text-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;
