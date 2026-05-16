import React, { useEffect, useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-900 dark:bg-gray-800 text-gray-200 dark:text-gray-200 pt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* BRAND */}
        <div
          className="text-center sm:text-left"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}
        >
          <h1
            onClick={() => navigate("/")}
            className="text-2xl cursor-pointer font-bold text-white dark:text-white mb-4 hover:text-blue-400 transition-colors duration-300"
          >
            Venue<span className="text-blue-600">Go</span>
          </h1>

          <p className="text-gray-400 dark:text-gray-300 text-sm md:text-base">
            Smart Sports Venue Booking Platform. Book your perfect venue anytime, anywhere.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex justify-center sm:justify-start gap-6 mt-6 text-lg">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 p-2 hover:-translate-y-1 hover:scale-110 inline-block"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* QUICK LINKS */}
        <div
          className="text-center sm:text-left"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}
        >
          <h3 className="text-xl font-semibold text-white dark:text-white mb-4">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm md:text-base">
            {[
              { to: "/", label: "Home" },
              { to: "/venues", label: "Venues" },
              { to: "/my-bookings", label: "My Bookings" },
              { to: "/trainer", label: "Trainer" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:translate-x-1 inline-block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* CONTACT */}
        <div
          className="text-center sm:text-left text-sm md:text-base"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
          }}
        >
          <h3 className="text-xl font-semibold text-white dark:text-white mb-4">
            Contact
          </h3>

          <div className="space-y-2">
            <p className="hover:text-gray-100 transition-colors duration-200 cursor-default">Email: support@venuego.com</p>
            <p className="hover:text-gray-100 transition-colors duration-200 cursor-default">Phone: +977 9822630642</p>
            <p className="hover:text-gray-100 transition-colors duration-200 cursor-default">Address: Kathmandu, Nepal</p>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div
          className="text-center sm:text-left"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
          }}
        >
          <h3 className="text-xl font-semibold text-white dark:text-white mb-4">
            Subscribe
          </h3>

          <p className="text-gray-400 dark:text-gray-300 mb-4 text-sm md:text-base">
            Get updates about new venues and offers
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 rounded-md sm:rounded-l-lg sm:rounded-r-none outline-none text-gray-900 dark:text-gray-200 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400
                focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />

            <button className="bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 px-4 py-2 rounded-md sm:rounded-r-lg sm:rounded-l-none text-white
              transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div
        className="border-t border-gray-800 dark:border-gray-700 mt-12 py-6 text-center text-gray-500 dark:text-gray-400 text-sm md:text-base"
        style={{
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 0.5s",
        }}
      >
        &copy; {new Date().getFullYear()} VenueGo. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
