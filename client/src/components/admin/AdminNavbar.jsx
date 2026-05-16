import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Moon, Sun } from "lucide-react";

const AdminNavbar = () => {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark/light
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header
      className="
        flex flex-wrap items-center justify-between
        px-4 sm:px-6 md:px-12 lg:px-16
        py-4
        border-b transition-all
        bg-white text-gray-700
        dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
      "
    >
      {/* Logo */}
      <div
        className="text-2xl sm:text-3xl font-bold cursor-pointer flex items-center"
        onClick={() => navigate("/admin")}
      >
        Venue<span className="text-blue-600 dark:text-blue-400">Go</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 hidden sm:inline">
          Admin
        </span>
      </div>

      {/* Right Section */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-2 sm:mt-0">

        {/* Welcome */}
        <div className="text-base sm:text-lg font-medium">
          Welcome, {user?.name || "Admin"}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="
            p-2 rounded-lg
            bg-gray-200 hover:bg-gray-300
            dark:bg-gray-700 dark:hover:bg-gray-600
            transition
          "
        >
          {darkMode ? (
            <Sun size={20} className="text-yellow-400" />
          ) : (
            <Moon size={20} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base transition
            bg-blue-500 hover:bg-blue-600 text-white
            dark:bg-blue-600 dark:hover:bg-blue-700
          "
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
