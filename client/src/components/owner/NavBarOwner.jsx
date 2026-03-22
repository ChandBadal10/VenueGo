import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Moon, Sun } from "lucide-react";

const NavBarOwner = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle theme
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

  return (
    <div
      className="
      flex items-center justify-between
      px-6 md:px-16 lg:px-24 xl:px-32
      py-4
      border-b
      transition-all
      bg-white text-gray-700
      dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700
    "
    >
      {/* Logo */}
      <div
        className="text-3xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Venue<span className="text-blue-600 dark:text-blue-400">Go</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Welcome */}
        <div className="text-lg font-medium">
          Welcome, {user?.name || "Venue Owner"}
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
            <Moon size={20} className="text-gray-700" />
          )}
        </button>
      </div>
    </div>
  );
};

export default NavBarOwner;
