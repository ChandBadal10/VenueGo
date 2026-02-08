import React from 'react'

const Newsletter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 mb-20 px-4">

      <h1 className="md:text-4xl text-2xl font-semibold">
        Never Miss a Deal!
      </h1>

      <p className="md:text-lg text-sm text-gray-500/70 pb-6 md:pb-8 max-w-lg">
        Subscribe to get the latest offers, new arrivals, and exclusive discounts
      </p>

      <form className="flex flex-col md:flex-row items-center w-full max-w-2xl gap-3 md:gap-0">

        <input
          className="border border-gray-300 rounded-md md:rounded-r-none h-12 md:h-13 outline-none w-full px-3 text-gray-500"
          type="email"
          placeholder="Enter your email id"
          required
        />

        <button
          type="submit"
          className="w-full md:w-auto md:px-12 px-8 h-12 md:h-13 text-white bg-blue-600 hover:bg-blue-400 transition-all cursor-pointer rounded-md md:rounded-l-none"
        >
          Subscribe
        </button>

      </form>

    </div>
  )
}

export default Newsletter
