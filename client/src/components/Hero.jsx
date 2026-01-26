import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HERO BACKGROUND */}
      <div
        className="relative h-[90vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://sports.kayacorp.com.np/wp-content/uploads/2024/06/badminton-pvc.webp')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Book Your Perfect
            <span className="text-blue-400"> Sports Venue</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-10">
            Fast, easy and reliable venue booking for futsal, cricket, badminton & more.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search futsal, cricket ground, badminton..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition whitespace-nowrap">
              Search
            </button>
          </div>

          {/* Quick Categories */}
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-2 rounded-full hover:bg-white/30 transition">
              ⚽ Futsal
            </button>
            <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-2 rounded-full hover:bg-white/30 transition">
              🏏 Cricket
            </button>
            <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-2 rounded-full hover:bg-white/30 transition">
              🏸 Badminton
            </button>
            <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-2 rounded-full hover:bg-white/30 transition">
              🏀 Basketball
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;