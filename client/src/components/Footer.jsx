import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-gray-200 pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* BRAND */}
        <div className="text-center sm:text-left">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl cursor-pointer font-bold text-white mb-4"
          >
            Venue<span className="text-blue-600">Go</span>
          </h1>

          <p className="text-gray-400 text-sm md:text-base">
            Smart Sports Venue Booking Platform. Book your perfect venue anytime, anywhere.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex justify-center sm:justify-start gap-6 mt-6 text-lg">
            <a href="#" className="hover:text-blue-600 transition p-2">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-600 transition p-2">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-600 transition p-2">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-600 transition p-2">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm md:text-base">
            <li>
              <Link to="/" className="hover:text-blue-600 transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/venues" className="hover:text-blue-600 transition">
                Venues
              </Link>
            </li>

            <li>
              <Link to="/my-bookings" className="hover:text-blue-600 transition">
                My Bookings
              </Link>
            </li>

            <li>
              <Link to="/trainer" className="hover:text-blue-600 transition">
                Trainer
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="text-center sm:text-left text-sm md:text-base">
          <h3 className="text-xl font-semibold text-white mb-4">
            Contact
          </h3>

          <div className="space-y-2">
            <p>Email: support@venuego.com</p>
            <p>Phone: +977 9822630642</p>
            <p>Address: Kathmandu, Nepal</p>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-semibold text-white mb-4">
            Subscribe
          </h3>

          <p className="text-gray-400 mb-4 text-sm md:text-base">
            Get updates about new venues and offers
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-md sm:rounded-l-lg sm:rounded-r-none outline-none text-gray-900"
            />

            <button className="bg-blue-600 px-4 py-2 rounded-md sm:rounded-r-lg sm:rounded-l-none text-white hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-800 mt-12 py-6 text-center text-gray-500 text-sm md:text-base">
        &copy; {new Date().getFullYear()} VenueGo. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
