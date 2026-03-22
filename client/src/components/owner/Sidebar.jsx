import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);

  const updateImage = async () => {
    if (!image) return;
    setImage(null);
  };

  const avatarSrc = image
    ? URL.createObjectURL(image)
    : user?.image ||
      "https://www.dreamstime.com/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-image137160339";

  const navItems = [
    { label: "Dashboard", path: "/venue-dashboard" },
    { label: "Add Venue", path: "/venue-dashboard/add-venue" },
    { label: "Add Trainer", path: "/venue-dashboard/add-trainer" },
    { label: "Manage Venues", path: "/venue-dashboard/manage-venue" },
    { label: "Manage Trainer", path: "/venue-dashboard/manage-trainer" },
    { label: "All Booked Venues", path: "/venue-dashboard/all-bookings" },
    { label: "All Booked Trainers", path: "/venue-dashboard/trainer-bookings" },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-gray-900 dark:border-gray-700">
        <h2 className="font-semibold text-lg text-gray-700 dark:text-gray-200">
          Owner Panel
        </h2>

        <button
          onClick={() => setOpen(!open)}
          className="text-xl text-gray-700 dark:text-gray-200"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          min-h-screen w-64
          border-r
          flex flex-col items-center pt-8 text-sm
          transition-transform duration-300
          bg-white text-gray-700 border-gray-200
          dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Avatar */}
        <div className="relative group">
          <label htmlFor="image">
            <img
              src={avatarSrc}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover cursor-pointer"
            />

            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div className="absolute inset-0 bg-black/20 rounded-full hidden group-hover:flex items-center justify-center cursor-pointer">
              <span className="text-xs text-white">Change</span>
            </div>
          </label>
        </div>

        {image && (
          <button
            className="mt-2 flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded cursor-pointer dark:bg-gray-700 dark:text-blue-400"
            onClick={updateImage}
          >
            Save
          </button>
        )}

        <p className="mt-3 text-base max-md:hidden text-gray-700 dark:text-gray-200">
          {user?.name || user?.fullName || "Venue Owner"}
        </p>

        {/* NAVIGATION */}
        <nav className="w-full mt-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition rounded-r-full
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-500 dark:bg-blue-900/40 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;