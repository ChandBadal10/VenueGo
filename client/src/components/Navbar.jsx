import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { setShowLogin, user, logout, axios } = useAppContext();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for modal

  const profileRef = useRef();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // DELETE ACCOUNT FUNCTION
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
      console.log("Delete error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-gray-200 shadow-md" : "bg-gray-100"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300">
        {/* Logo */}
        <Link to="/" className="text-2xl md:text-3xl font-extrabold text-gray-800">
          Venue<span className="text-blue-600">Go</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/venues" className="hover:text-blue-600 transition">Venues</Link>
          <Link to="/my-bookings" className="hover:text-blue-600 transition">My Bookings</Link>
          <Link to="/trainer" className="hover:text-blue-600 transition">Trainer</Link>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-5">
          {/* Add Venue */}
          <button
            onClick={async () => {
              if (!user) {
                toast.error("You must login to add a venue");
                setShowLogin(true);
                return;
              }
              try {
                const { data } = await axios.get("/venue/status");
                if (!data.exists) navigate("/owner");
                else if (data.status !== "approved") toast.error("Your venue is not approved yet.");
                else navigate("/venue-dashboard");
              } catch {
                toast.error("Error checking venue status");
              }
            }}
            className="font-medium text-gray-700 hover:text-blue-600 transition"
          >
            Add Venue
          </button>

          {/* Profile Dropdown */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              >
                <FaUserCircle size={28} />
                <span className="font-medium capitalize">{user.name || "Profile"}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg border z-50">
                  <button
                    onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={() => { navigate("/my-bookings"); setProfileOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Bookings
                  </button>

                  <button
                    onClick={() => { setShowDeleteModal(true); setProfileOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Delete Account
                  </button>

                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg font-medium"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-800">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-100 border-b border-gray-300 px-6 py-4">
          <div className="flex flex-col gap-4 text-gray-700 font-medium">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/venues" onClick={() => setMenuOpen(false)}>Venues</Link>
            <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>
            <Link to="/trainer" onClick={() => setMenuOpen(false)}>Trainer</Link>

            {user && (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>My Profile</Link>

                <button
                  onClick={() => { setMenuOpen(false); setShowDeleteModal(true); }}
                  className="text-left text-red-600"
                >
                  Delete Account
                </button>
              </>
            )}

            <button
              onClick={() => { setMenuOpen(false); user ? logout() : setShowLogin(true); }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg font-medium"
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDeleteAccount();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
