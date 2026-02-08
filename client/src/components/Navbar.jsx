import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { setShowLogin, user, logout, axios } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled ? "bg-gray-200 shadow-md" : "bg-gray-100"}
      `}
    >
      <div className="flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold text-gray-800"
        >
          Venue<span className="text-blue-600">Go</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/venues" className="hover:text-blue-600 transition">
            Venues
          </Link>
          <Link to="/my-bookings" className="hover:text-blue-600 transition">
            My Bookings
          </Link>
          <Link to="/trainer" className="hover:text-blue-600 transition">
            Trainer
          </Link>
        </div>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={async () => {
              if (!user) {
                toast.error("You must login to add a venue");
                setShowLogin(true);
                return;
              }

              try {
                const { data } = await axios.get("/api/venue/status");

                if (!data.exists) {
                  navigate("/owner");
                } else if (data.status !== "approved") {
                  toast.error("Your venue is not approved yet.");
                } else {
                  navigate("/venue-dashboard");
                }
              } catch {
                toast.error("Error checking venue status");
              }
            }}
            className="font-medium text-gray-700 hover:text-blue-600 transition"
          >
            Add Venue
          </button>

          <button
            onClick={() => {
              user ? logout() : setShowLogin(true);
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg font-medium"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-800"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-100 border-b border-gray-300 px-6 py-4">
          <div className="flex flex-col gap-4 text-gray-700 font-medium">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Home
            </Link>

            <Link
              to="/venues"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Venues
            </Link>

            <Link
              to="/my-bookings"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              My Bookings
            </Link>

            <Link
              to="/trainer"
              onClick={() => setMenuOpen(false)}
              className="hover:text-blue-600 transition"
            >
              Trainer
            </Link>

            <button
              onClick={async () => {
                setMenuOpen(false);

                if (!user) {
                  toast.error("You must login to add a venue");
                  setShowLogin(true);
                  return;
                }

                try {
                  const { data } = await axios.get("/api/venue/status");

                  if (!data.exists) {
                    navigate("/owner");
                  } else if (data.status !== "approved") {
                    toast.error("Your venue is not approved yet.");
                  } else {
                    navigate("/venue-dashboard");
                  }
                } catch {
                  toast.error("Error checking venue status");
                }
              }}
              className="text-left hover:text-blue-600 transition"
            >
              Add Venue
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                user ? logout() : setShowLogin(true);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded-lg font-medium"
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
