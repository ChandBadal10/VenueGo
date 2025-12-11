import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext';
const NavBarOwner = () => {
  const { user } = useAppContext();
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



     <div className="flex items-center gap-4">
        {/* User Name */}
        <div className="text-xl font-medium text-gray-600">
          Welcome,  {user?.name || "Venue Owner"}
        </div>
        </div>
    </div>

  )
}

export default NavBarOwner