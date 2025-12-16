import React from 'react'
import { useState } from 'react';


const Dashboard = () => {

  const [data, setData] = useState({
    totalVenues: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })


  return (
    <div className='p-8  min-h-screen'>

      <h1 className='text-2xl font-semibold mb-2'>
        Venue Owner Dashboard
      </h1>

      <p className='text-gray-500 mb-8 max-w-3xl'>
          Monitor overall platform performance including total venues, booking, revenue, and recent activities
      </p>




      {/* cards */}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10'>
        <div className='bg-gray-100 rounded-xl p-6'>
          <p className='text-gray-600 text-sm'> Total Venues </p>
          <h2 className='text-xl font-semibold mt-1'>0</h2>
        </div>

        <div className='bg-gray-100 rounded-xl p-6'>
          <p className='text-gray-600 text-sm'>Total Bookings</p>
          <h2 className='text-xl font-semibold mt-1'>0</h2>
        </div>

        <div className='bg-gray-100 rounded-xl p-6'>
          <p className='text-gray-600 text-sm'>Pending</p>
          <h2 className='text-xl font-semibold mt-1'>0</h2>
        </div>

        <div className='bg-gray-100 rounded-xl p-6'>
          <p className='text-gray-600 text-sm'>Confirmed</p>
          <h2 className='text-xl font-semibold mt-1'>0</h2>
        </div>

</div>


        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 '>

          <div className='bg-gray-100 rounded-xl p-6 md:col-span-2'>
            <h3 className='font-semibold mb-1'>Recent Bookings</h3>
            <p className='text-gray-500 text-sm mb-6'>
                Latest customer bookings
            </p>

            <div className='text-gray-400 text-sm'>
                No recent bookings available
            </div>
          </div>



        <div className="bg-gray-100 rounded-xl p-6">
          <h3 className="font-semibold mb-1">Monthly Revenue</h3>
          <p className="text-gray-500 text-sm mb-4">
            Revenue for current month
          </p>

          <p className="text-blue-600 text-xl font-semibold">$0</p>
        </div>
        </div>





    </div>
  )
}

export default Dashboard;