// src/pages/owner/Layout.jsx
import React from 'react'
import NavBarOwner from '../../components/owner/NavBarOwner';
import Sidebar from '../../components/owner/Sidebar';
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen'>

      <NavBarOwner />


      <div className="flex flex-1">
        <Sidebar />


        <main className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout;
