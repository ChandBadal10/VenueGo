import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const AdminNavbar = () => {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 md:px-12 lg:px-16 py-3">
        {/* Logo */}
        <div
          className="text-2xl sm:text-3xl font-bold cursor-pointer flex items-center"
          onClick={() => navigate("/admin")}
        >
          Venue<span className="text-blue-700">Go</span>
          <span className="text-sm text-gray-500 ml-2 hidden sm:inline">Admin</span>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-2 sm:mt-0">
          <div className="text-base sm:text-lg font-medium text-gray-600">
            Welcome, {user?.name || "Admin"}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 sm:px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
