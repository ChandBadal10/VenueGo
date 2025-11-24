import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'



const Navbar = () => {

  const {setShowLogin, user, logout, axios} = useAppContext()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24
        xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all
        ${location.pathname === "/" && "bg-light"}`}>

        <Link to="/" className="text-3xl font-bold text-black-600">
          Venue<span className='text-blue-600'>Go</span>
        </Link>

        {/* Center: Nav Links */}
        <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full
        max-sm:top-16 max-sm:border-t border-borderColor right-0 flex
        flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8
        max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light" : "bg-white"}`}>

          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          {/* <Link to="/about" className="hover:text-blue-600 transition">About</Link> */}
          <Link to="/venues" className="hover:text-blue-600 transition">Venues</Link>
          <Link to="/my-bookings" className="hover:text-blue-600 transition">My Bookings</Link>
          <Link to="/trainer" className="hover:text-blue-600 transition">Trainer</Link>

        </div>


        {/* <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
        <input type="text" className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" placeholder="Search products" />

        </div> */}

        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>
          <button onClick={() => {
            if(user) {
              navigate("/owner")
            } else{
              toast.error("You must login to add a venue");
              setShowLogin(true);
            }
          }

          } className='cursor-pointer'>Add Venue </button>


          <button onClick={()=> {user ? logout() : setShowLogin(true)}} className='cursor-pointer px-8 py-2 bg-blue-600 hover:bg-blue-600 transition-all text-white rounded-lg'>{ user ? "Logout" : "Login"} </button>
        </div>



    </div>
  )
}

export default Navbar;