import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { User, Mail, Phone, Award, Target, X } from "lucide-react";

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
    const { name, email, phone, experience, specialization, venueName, slotDate, startTime, endTime, price } = formData;
    if (!name || !email || !phone || !experience || !specialization || !venueName || !slotDate || !startTime || !endTime || !price) {
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
        if (formData[key] !== null && formData[key] !== "") data.append(key, formData[key]);
      });
      const res = await axios.post("/api/trainers/create", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({ name: "", email: "", phone: "", experience: "", specialization: "", bio: "", venueName: "", slotDate: "", startTime: "", endTime: "", price: "", image: null });
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

  const inputClass =
    "w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder-gray-400";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1";

  const IconInput = ({ icon: Icon, ...props }) => (
    <div className="relative mt-1">
      <Icon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      <input {...props} className={`w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors placeholder-gray-400`} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Trainer</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Fill in the details and set the first available session slot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* Photo Upload */}
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative h-16 w-16 shrink-0">
                <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
                <button type="button" onClick={removeImage} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label htmlFor="trainer-image" className="cursor-pointer shrink-0">
                <div className="h-16 w-16 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors bg-white dark:bg-gray-900">
                  <span className="text-xl">📷</span>
                </div>
                <input type="file" id="trainer-image" name="image" accept="image/*" hidden onChange={handleChange} />
              </label>
            )}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Trainer Photo</p>
              <p className="text-xs text-gray-400">{formData.image ? formData.image.name : "Click the box to upload · Max 5MB"}</p>
            </div>
          </div>

          {/* Personal Info Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Personal Info</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name *</label>
                <IconInput icon={User} type="text" name="name" placeholder="Full name" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <IconInput icon={Mail} type="email" name="email" placeholder="email@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Phone *</label>
                <IconInput icon={Phone} type="text" name="phone" placeholder="98XXXXXXXX" value={formData.phone} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Experience (years) *</label>
                <IconInput icon={Award} type="number" name="experience" placeholder="e.g. 3" value={formData.experience} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Specialization *</label>
                <IconInput icon={Target} type="text" name="specialization" placeholder="e.g. Yoga, Futsal" value={formData.specialization} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Venue Name *</label>
                <input className={inputClass} type="text" name="venueName" placeholder="e.g. Velocity Futsal" value={formData.venueName} onChange={handleChange} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Bio</label>
                <textarea rows="3" name="bio" placeholder="Brief description about the trainer..." className={`${inputClass} resize-none`} value={formData.bio} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Session Slot Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">First Session Slot</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date *</label>
                <input className={inputClass} type="date" name="slotDate" min={today} value={formData.slotDate} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Price *</label>
                <input className={inputClass} type="number" name="price" placeholder="e.g. 1500" value={formData.price} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Start Time *</label>
                <input className={inputClass} type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>End Time *</label>
                <input className={inputClass} type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
          >
            {loading ? "Adding..." : "Add Trainer"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddTrainer;
