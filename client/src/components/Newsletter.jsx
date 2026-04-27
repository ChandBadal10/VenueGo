import React, { useEffect, useState } from "react";

const Newsletter = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center text-center space-y-2 mb-20 px-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <h1 className="md:text-4xl text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Never Miss a Deal!
      </h1>

      <p className="md:text-lg text-sm text-gray-500/70 dark:text-gray-300/70 pb-6 md:pb-8 max-w-lg">
        Subscribe to get the latest offers, new arrivals, and exclusive discounts
      </p>

      <form className="flex flex-col md:flex-row items-center w-full max-w-2xl gap-3 md:gap-0">
        <input
          className="border border-gray-300 dark:border-gray-700 rounded-md md:rounded-r-none h-12 md:h-13 outline-none w-full px-3 text-gray-500 dark:text-gray-200 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          type="email"
          placeholder="Enter your email id"
          required
        />

        <button
          type="submit"
          className="w-full md:w-auto md:px-12 px-8 h-12 md:h-13 text-white bg-blue-600 hover:bg-blue-400 rounded-md md:rounded-l-none
            transition-all duration-300
            hover:shadow-lg hover:shadow-blue-500/30
            active:scale-95
            cursor-pointer"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;