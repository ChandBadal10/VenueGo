import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FaBars, FaTimes, FaUserCircle, FaMoon, FaSun } from "react-icons/fa";
import ManageProfile from "./ManageProfile";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { setShowLogin, user, logout, axios } = useAppContext();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const profileRef = useRef();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in");
        return;
      }
      const res = await axios.delete("/api/user/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        logout();
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  const handleAddVenue = async () => {
    if (!user) {
      toast.error("You must login to add a venue");
      setShowLogin(true);
      return;
    }
    try {
      const { data } = await axios.get("/api/venue/status");
      if (!data.exists) navigate("/owner");
      else if (data.status !== "approved") toast.error("Your venue is not approved yet.");
      else navigate("/venue-dashboard");
    } catch {
      toast.error("Error checking venue status");
    }
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Venues", to: "/venues" },
    { label: "My Bookings", to: "/my-bookings" },
    { label: "Trainer", to: "/trainer" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-gray-900 shadow-md"
          : "bg-gray-50 dark:bg-gray-950"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 dark:border-gray-700">

        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white shrink-0">
          Venue<span className="text-blue-600">Go</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-700 dark:text-gray-200">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-5">

          {/* Dark Mode Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <FaSun size={15} /> : <FaMoon size={15} />}
          </motion.button>

          {/* Add Venue */}
          <button
            onClick={handleAddVenue}
            className="font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
          >
            Add Venue
          </button>

          {/* Profile / Login */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
              >
                <FaUserCircle size={28} />
                <span className="max-w-[100px] truncate">{user.name || "Profile"}</span>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <button onClick={() => { setShowProfileModal(true); setProfileOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                      Manage Profile
                    </button>
                    <button onClick={() => { navigate("/my-bookings"); setProfileOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                      My Bookings
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700" />
                    <button onClick={() => { setShowDeleteModal(true); setProfileOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                      Delete Account
                    </button>
                    <button onClick={() => { logout(); setProfileOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile: theme + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-yellow-400"
          >
            {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-700 dark:text-gray-200"
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-4 flex flex-col gap-1">

              {/* Nav Links */}
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {/* Add Venue */}
              <button
                onClick={() => { setMenuOpen(false); handleAddVenue(); }}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                Add Venue
              </button>

              <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

              {/* Auth */}
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2">
                    <FaUserCircle size={18} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{user.name || "Profile"}</span>
                  </div>
                  <button onClick={() => { setShowProfileModal(true); setMenuOpen(false); }} className="px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                    Manage Profile
                  </button>
                  <button onClick={() => { setShowDeleteModal(true); setMenuOpen(false); }} className="px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors text-left">
                    Delete Account
                  </button>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setShowLogin(true); setMenuOpen(false); }}
                  className="mt-1 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Delete Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { handleDeleteAccount(); setShowDeleteModal(false); }}
                  className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showProfileModal && (
        <ManageProfile isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      )}
    </motion.header>
  );
};

export default Navbar;