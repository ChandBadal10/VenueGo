import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Award,
  Target,
  Upload,
  X,
  Calendar,
  Clock,
  DollarSign,
} from "lucide-react";

const AddTrainer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    specialization: "",
    bio: "",
    venueName: "",
    slotDate: "",
    startTime: "",
    endTime: "",
    price: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];

      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size should be less than 5MB");
          return;
        }

        setFormData({ ...formData, image: file });

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      phone,
      experience,
      specialization,
      venueName,
      slotDate,
      startTime,
      endTime,
      price,
    } = formData;

    if (
      !name ||
      !email ||
      !phone ||
      !experience ||
      !specialization ||
      !venueName ||
      !slotDate ||
      !startTime ||
      !endTime ||
      !price
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (startTime >= endTime) {
      toast.error("Start time must be before end time");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          data.append(key, formData[key]);
        }
      });

      const res = await axios.post("/api/trainers/create", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);

        setFormData({
          name: "",
          email: "",
          phone: "",
          experience: "",
          specialization: "",
          bio: "",
          venueName: "",
          slotDate: "",
          startTime: "",
          endTime: "",
          price: "",
          image: null,
        });

        setImagePreview(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        {/* Heading */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Add New Trainer
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Fill in the details and set the first available session slot
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image Upload */}
            <div className="flex flex-col items-center pt-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Upload Photo
                  </span>

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              )}

              <p className="text-xs text-gray-400 mt-2">Max 5MB</p>
            </div>

            {/* Form Fields */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Name *
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Email *
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Phone *
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Experience *
                </label>

                <div className="relative">
                  <Award className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Specialization *
                </label>

                <div className="relative">
                  <Target className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Venue Name *
                </label>

                <input
                  type="text"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  Bio
                </label>

                <textarea
                  rows="2"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg resize-none"
                />
              </div>

              {/* Slot Section */}
              <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm font-semibold mb-3">First Session Slot</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    name="slotDate"
                    min={today}
                    value={formData.slotDate}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg"
                  />

                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg"
                  />

                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg"
                  />

                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 dark:bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Adding..." : "Add Trainer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTrainer;
