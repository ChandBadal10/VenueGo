import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterationPage = () => {
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
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    setMessage("You must be logged in to register a venue");
    return;
  }

  const data = new FormData();
  data.append("venueName", formData.venueName);
  data.append("category", formData.category);
  data.append("phone", formData.phone);
  data.append("email", formData.email);
  data.append("location", formData.location);
  data.append("description", formData.description);
  data.append("image", formData.image);

  try {
    setLoading(true);
    const res = await fetch("http://localhost:3000/api/venue/register", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    const result = await res.json();
    setLoading(false);

    if (result.success) {
      toast.success("Venue registered successfully! Waiting for admin approval.");

      // Clear form
      setFormData({
        venueName: "",
        category: "",
        phone: "",
        email: "",
        location: "",
        description: "",
        image: null,
      });

      // Redirect to home page immediately
      navigate("/");
    } else {
      toast.error(result.message || "Something went wrong");
    }
  } catch (err) {
    setLoading(false);
    toast.error("Network error");
  }
};




  return (
    <div className='minh-screen flex items-center justify-center bg-white p-6'>
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-10 rounded-2xl shadow-md border"
      >
        <h2 className="text-3xl font-semibold text-center mb-10 text-blue-600">
          Register
        </h2>

        {/* Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <label className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden">
            {formData.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500 text-sm text-center">
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
          <p className="text-sm text-gray-600 mt-2">
            Upload a picture of a Venue
          </p>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-gray-600">Venue Name</label>
            <input
              type="text"
              name="venueName"
              placeholder="e.g: Velocity Futsal"
              value={formData.venueName}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-lg outline-none"
            >
              <option value="">Select a category</option>
              <option value="Futsal">Futsal</option>
              <option value="Gym">Gym</option>
              <option value="Swimming">Swimming</option>
              <option value="Tennis">Tennis</option>
              <option value="Badminton">Badminton</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="123456789"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-lg outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm text-gray-600">Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g: Shantinagar, Kathmandu"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 rounded-lg outline-none"
          />
        </div>

        <div className="mt-6">
          <label className="text-sm text-gray-600">Description</label>
          <textarea
            name="description"
            placeholder="e.g: Great futsal."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 bg-gray-100 rounded-lg outline-none"
          />
        </div>

        <button
          onClick={() => {
            navigate("/")
          }}
          type="submit"
          className="mt-10 w-full py-3 rounded-lg bg-blue-600 text-white text-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>

    </div>
  )
}

export default RegisterationPage