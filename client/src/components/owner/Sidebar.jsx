import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Sidebar = () => {
  const { user } = useAppContext();              // get user from context
  const location = useLocation();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const updateImage = async () => {
    if (!image) return;

    // TODO: upload avatar to backend if you want to save it:
    // const formData = new FormData();
    // formData.append("avatar", image);
    // await axios.post("/api/user/avatar", formData);

    setImage(null);
  };

  const avatarSrc =
    image
      ? URL.createObjectURL(image)               // preview selected image
      : user?.image ||
        "https://www.dreamstime.com/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-image137160339";

  const navItems = [
  { label: "Dashboard", path: "/venue-dashboard" },
  { label: "Add Venue", path: "/venue-dashboard/add-venue" },
  { label: "Add Trainer", path: "/venue-dashboard/add-trainer" },
  { label: "Manage Bookings", path: "/venue-dashboard/manage-bookings" },
  { label: "Manage Venues", path: "/venue-dashboard/manage-venue" },

];
  return (
    <aside className="min-h-screen w-64 border-r border-borderColor bg-white flex flex-col items-center pt-8 text-sm">
      {/* Avatar + overlay */}
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

          {/* hover overlay */}
          <div className="absolute inset-0 bg-black/10 rounded-full hidden group-hover:flex items-center justify-center cursor-pointer">
            <span className="text-xs text-white">Change</span>
          </div>
        </label>
      </div>

      {/* Save button when new image selected */}
      {image && (
        <button
          className="mt-2 flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded cursor-pointer"
          onClick={updateImage}
        >
          Save
        </button>
      )}

      {/* User name */}
      <p className="mt-3 text-base max-md:hidden">
        {user?.name || user?.fullName || "Venue Owner"}
      </p>

      {/* Navigation links */}
      <nav className="w-full mt-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition rounded-r-full
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
