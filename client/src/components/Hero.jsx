import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

const Hero = () => {

  const navigate = useNavigate();
  const location = useLocation()



  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center px-6 md:px-12">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight">
          Quick <span className="text-gray-800 font-bold">and Easy</span>
          <br />
          Field Reservations
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto">
          Book your favorite sports fields for ⚽ <b>football</b>, 🎾{" "}
          <b>tennis</b>, 🏐 <b>volleyball</b>, and more, at the{" "}
          <span className="text-gray-900 font-semibold">best locations</span>{" "}
          nearby.
        </p>

        {/* Button */}
        <div
         className="mt-10">
          <button onClick={()=> navigate("/my-bookings")} className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 text-lg font-medium">
            Book Your Spot
          </button>
        </div>

        {/* Rating
        <div className="flex flex-col items-center justify-center mt-8">
          <div className="flex items-center space-x-2">
            <div className="text-yellow-400 text-2xl">⭐️⭐️⭐️⭐️⭐️</div>
            <p className="text-gray-800 text-lg font-semibold">4.8</p>
          </div>
          <p className="text-green-600 font-medium mt-1 text-base md:text-lg">
            Trusted by 10K people
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default Hero