import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-gray-200 pt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Venue<span className="text-blue-600">Go</span>
          </h1>
          <p className="text-gray-400">
            Smart Sports Venue Booking Platform. Book your perfect venue anytime, anywhere.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-blue-600 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-blue-600 transition"><FaTwitter /></a>
            <a href="#" className="hover:text-blue-600 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-600 transition"><FaLinkedinIn /></a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-600 transition">Home</Link></li>
            {/* <li><Link to="/about" className="hover:text-blue-600 transition">About</Link></li> */}
            <li><Link to="/venues" className="hover:text-blue-600 transition">Venues</Link></li>
            <li><Link to="/my-bookings" className="hover:text-blue-600 transition">My Bookings</Link></li>
            <li><Link to="/trainer" className="hover:text-blue-600 transition">Trainer</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
          <p>Email: support@venuego.com</p>
          <p>Phone: +977 9822630642</p>
          <p>Address: Kathmandu, Nepal</p>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Subscribe</h3>
          <p className="text-gray-400 mb-4">Get updates about new venues and offers</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-l-lg outline-none text-gray-900"
            />
            <button className="bg-blue-600 px-4 py-2 rounded-r-lg text-white hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-800 mt-12 py-6 text-center text-gray-500">
        &copy; {new Date().getFullYear()} VenueGo. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
