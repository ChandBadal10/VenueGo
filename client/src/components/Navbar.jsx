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

  return (
    <motion.header
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-200 dark:bg-gray-900 shadow-md"
          : "bg-gray-100 dark:bg-gray-950"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 dark:border-gray-700">

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Link to="/" className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white">
            Venue<span className="text-blue-600">Go</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700 dark:text-gray-200">
          {["Home","Venues","My Bookings","Trainer"].map((item, i) => (
            <motion.div key={i} whileHover={{ y: -2 }}>
              <Link to={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ","-")}`} className="hover:text-blue-600 transition">
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-5">

          {/* Dark Mode */}
          <motion.button whileTap={{ scale: 0.9 }} whileHover={{ rotate: 15 }}
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </motion.button>

          {/* Add Venue */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={async () => {
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
            }}
            className="font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"
          >
            Add Venue
          </motion.button>

          {/* Profile */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <motion.button whileHover={{ scale: 1.05 }}
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
              >
                <FaUserCircle size={28} />
                <span>{user.name || "Profile"}</span>
              </motion.button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border dark:border-gray-700 z-50"
                  >
                    {/* same content */}
                    <button onClick={() => { setShowProfileModal(true); setProfileOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Manage Profile</button>
                    <button onClick={() => { navigate("/my-bookings"); setProfileOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">My Bookings</button>
                    <button onClick={() => { setShowDeleteModal(true); setProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-700">Delete Account</button>
                    <button onClick={() => { logout(); setProfileOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium"
            >
              Login
            </motion.button>
          )}
        </div>

        {/* Mobile Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
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
            className="md:hidden bg-gray-100 dark:bg-gray-950 px-6 py-4"
          >
            {/* same content */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg"
            >
              {/* same content */}
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