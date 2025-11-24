import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Venuese from './pages/Venuese'
import MyBookings from './pages/MyBookings'
import VenueDetailPage from './pages/VenueDetailPage'
import Login from './components/Login'
import ReserPassword from './pages/ResetPassword'
import Trainer from './pages/Trainer'
import Layout from './pages/owner/Layout'
import AddVenue from './pages/owner/AddVenue'
import ManageBookings from './pages/owner/ManageBookings'
import { Toaster } from "react-hot-toast"
import { useAppContext } from './context/AppContext'
import { ToastContainer } from "react-toastify";
import VenueCard from './components/VenueCard'
import RegisterationPage from './pages/owner/RegisterationPage'
import AdminDashboard from './pages/admin/AdminDashboard'



const App = () => {

  // const [showLogin, setShowLogin] = useState(false)
  // const location = useLocation();
  const {showLogin} = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith("/owner");
  const isAdminPath = useLocation().pathname.startsWith("/admin");
  return (
    <>
      <ToastContainer />
      <Toaster />
      {showLogin && <Login/>}

      {/* {!isOwnerPath && <Navbar/>} */}
      {!isOwnerPath && !isAdminPath && <Navbar />}


      <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/venue-details/:id" element={<VenueDetailPage/>} />
              <Route path='/venues' element={<Venuese/>} />
              <Route path='/venueCard' element={<VenueCard/>} />
              <Route path='/my-bookings' element={<MyBookings/>} />
              <Route path='/trainer' element={<Trainer/>} />
              <Route path="/reset-password" element={ <ReserPassword />}   />


              <Route path='/owner' element={<RegisterationPage/>} />
              <Route path="add-venue" element={<AddVenue/>} />
              <Route path="manage-bookings" element={<ManageBookings/>} />





              <Route path='/admin' element={<AdminDashboard />} />




      </Routes>

      {/* {!isOwnerPath && <Footer />} */}

    </>
  )
}

export default App