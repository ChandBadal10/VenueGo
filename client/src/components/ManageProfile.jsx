import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaSave, FaCheck, FaTimes, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ManageProfile = ({ isOpen, onClose }) => {
  const { user, axios, setUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [user]);

  // Animate in when opened
  useEffect(() => {
    if (isOpen) {
      // Small delay so the initial hidden state renders first
      const t = setTimeout(() => setMounted(true), 10);
      return () => clearTimeout(t);
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updateData = { name: formData.name, email: formData.email };
      if (formData.oldPassword && formData.newPassword) {
        updateData.oldPassword = formData.oldPassword;
        updateData.newPassword = formData.newPassword;
      }
      const { data } = await axios.put("/api/user/update-profile", updateData);
      if (data.success) {
        toast.success(data.message);
        setUser(data.user);
        setIsSaved(true);
        setFormData({ ...formData, oldPassword: "", newPassword: "" });
        setTimeout(() => { setIsSaved(false); onClose(); }, 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // ── Backdrop ──────────────────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: mounted ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        backdropFilter: mounted ? "blur(4px)" : "blur(0px)",
        transition: "background-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
      onClick={onClose}
    >
      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl
          flex flex-col max-h-[90vh]"   /* ← key fix: flex-col + max-h */
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header (fixed, never scrolls) ─────────────────────────────── */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 px-8 py-10 rounded-t-3xl overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/90 hover:text-white hover:bg-white/20 p-2 rounded-full
              transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <FaTimes size={20} />
          </button>

          <div className="relative text-center">
            <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg
              transition-transform duration-300 hover:scale-105">
              <FaUser className="text-blue-600 text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Manage Profile</h2>
            <p className="text-blue-100">Update your information and password</p>
          </div>
        </div>

        {/* ── Scrollable form body ───────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          <form onSubmit={handleUpdate} className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400 text-sm" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      transition-all duration-200
                      bg-gray-50 dark:bg-gray-800 dark:text-gray-200
                      hover:bg-white dark:hover:bg-gray-700"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 text-sm" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      transition-all duration-200
                      bg-gray-50 dark:bg-gray-800 dark:text-gray-200
                      hover:bg-white dark:hover:bg-gray-700"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white dark:bg-gray-900 text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <FaLock className="text-blue-600" />
                  Change Password (Optional)
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Old Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 text-sm" />
                  </div>
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      transition-all duration-200
                      bg-gray-50 dark:bg-gray-800 dark:text-gray-200
                      hover:bg-white dark:hover:bg-gray-700"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    {showOldPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400 text-sm" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full pl-11 pr-11 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      transition-all duration-200
                      bg-gray-50 dark:bg-gray-800 dark:text-gray-200
                      hover:bg-white dark:hover:bg-gray-700"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 text-base rounded-xl border-2 border-gray-300 dark:border-gray-700
                  hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800
                  transition-all duration-200 font-semibold text-gray-700 dark:text-gray-300
                  active:scale-95"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading || isSaved}
                className={`flex-1 px-6 py-3.5 text-base rounded-xl font-semibold text-white
                  transition-all duration-300 flex items-center justify-center gap-2 shadow-lg
                  hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:hover:translate-y-0 ${
                  isSaved
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Updating...
                  </span>
                ) : isSaved ? (
                  <span className="flex items-center gap-2" style={{ animation: "fadeIn 0.3s ease" }}>
                    <FaCheck /> Saved!
                  </span>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ManageProfile;