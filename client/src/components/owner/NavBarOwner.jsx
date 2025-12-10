import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext';
const NavBarOwner = () => {
  const { logout } = useAppContext();
  const navigate = useNavigate();


  return (
    <div className='flex items-center justify-between px-6 md:px-16 lg:px-24
        xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all'>

      {/* Logo */}
      <div className='text-3xl font-bold text-black-600 cursor-pointer'
      onClick={()=> navigate("/")}
      >
        Venue<span className='text-blue-700'>Go</span>
      </div>

    {/* Logout */}
    <button className='cursor-pointer px-8 py-2 bg-blue-600 hover:bg-blue-600 transition-all text-white rounded-lg'
    onClick={logout}>
      Logout
    </button>
    </div>

  )
}

export default NavBarOwner