import React from "react";

const Home = () => {
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

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white/80"></div>

        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-xl">
            Book Your
            <span className="text-blue-600"> Perfect Sports Venue</span>
          </h1>

          <p className="mt-4 text-lg md:text-xl text-gray-700 drop-shadow">
            Fast, easy and reliable venue booking for futsal, cricket, badminton & more.
          </p>

          {/* Search Bar  */}
          <div className="mt-10 max-w-2xl mx-auto bg-white/50 backdrop-blur-xl border border-white/70 rounded-2xl shadow-2xl p-3 flex gap-3">
            <input
              type="text"
              placeholder="Search futsal, cricket ground, badminton..."
              className="flex-1 px-4 py-3 bg-transparent text-gray-700 outline-none"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
