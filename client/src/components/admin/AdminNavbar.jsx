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
    <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-white">
      <div
        className="text-3xl font-bold cursor-pointer"
        onClick={() => navigate("/admin")}
      >
        Venue<span className="text-blue-700">Go</span>
        <span className="text-sm text-gray-500 ml-2">Admin</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <div className="text-lg font-medium text-gray-600">
          Welcome, {user?.name || "Admin"}
        </div>

        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminNavbar;
