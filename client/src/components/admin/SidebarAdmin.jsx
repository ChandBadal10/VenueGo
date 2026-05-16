import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const AdminSidebar = () => {
  const { user, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const updateImage = async () => {
    if (!image) return;
    setImage(null);
  };

  const avatarSrc =
    image
      ? URL.createObjectURL(image)
      : user?.image ||
        "https://www.dreamstime.com/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-image137160339";

  const navItems = [
    { label: "Dashboard",      path: "/admin" },
    { label: "Approve Venues", path: "/admin/approve-venue-page" },
    { label: "Manage Venues",  path: "/admin/manage-venues" },
    { label: "All Bookings",   path: "/admin/all-booking" },
  ];

  return (
    <aside className="
      min-h-screen w-64 flex flex-col items-center pt-8 text-sm
      border-r transition-all
      bg-white text-gray-700 border-gray-200
      dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
    ">
      {/* Avatar */}
      <div className="relative group">
        <label htmlFor="admin-image">
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover cursor-pointer"
          />
          <input
            type="file"
            id="admin-image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className="absolute inset-0 bg-black/20 rounded-full hidden group-hover:flex items-center justify-center cursor-pointer">
            <span className="text-xs text-white">Change</span>
          </div>
        </label>
      </div>

      {/* Save button */}
      {image && (
        <button
          onClick={updateImage}
          className="mt-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded cursor-pointer"
        >
          Save
        </button>
      )}

      {/* Admin name */}
      <p className="mt-3 text-base font-medium max-md:hidden">
        {user?.name || "Admin"}
      </p>

      {/* Role badge */}
      <span className="mt-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
        Admin
      </span>

      {/* Navigation */}
      <nav className="w-full mt-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition rounded-r-full
                ${isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium border-r-4 border-blue-500 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
