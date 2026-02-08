import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Venuese from "./pages/Venuese";
import MyBookings from "./pages/MyBookings";
import VenueDetailPage from "./pages/VenueDetailPage";
import Login from "./components/Login";
import ReserPassword from "./pages/ResetPassword";
import Trainer from "./pages/Trainer";
import AddVenue from "./pages/owner/AddVenue";

import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";
import VenueCard from "./components/VenueCard";
import RegisterationPage from "./pages/owner/RegisterationPage";
import Layout from "./pages/owner/Layout";
import ManageVenue from "./pages/owner/ManageVenue";
import Dashboard from "./pages/owner/Dashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminApproveVenues from "./pages/admin/AdminApproveVenues";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageVenuePage from "./pages/admin/ManageVenuePage";
import AllBookings from "./pages/owner/AllBookings";
import AddTrainer from "./pages/owner/AddTrainer";
import AuthSuccess from "./pages/AuthSuccess";
import AllVenueBookings from "./pages/admin/AllVenueBookings";



const App = () => {
  // const [showLogin, setShowLogin] = useState(false)
  const location = useLocation();
  const { showLogin } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/venue-dashboard");
  const isAdminPath = useLocation().pathname.startsWith("/admin");
  return (
    <>
      <ToastContainer />
      <Toaster />
      {showLogin && <Login />}

      {/* {!isOwnerPath && <Navbar/>} */}
      {!isOwnerPath && !isAdminPath && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/venue-details/:id" element={<VenueDetailPage />} />
        <Route path="/venues" element={<Venuese />} />
        <Route path="/venueCard" element={<VenueCard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/trainer" element={<Trainer />} />
        <Route path="/reset-password" element={<ReserPassword />} />

        {/* owner registration */}
        <Route path="/owner" element={<RegisterationPage />} />

        {/* /OWNER AREA WITH LAYOUT */}
        <Route path="/venue-dashboard" element={<Layout />}>
          {/* /venue-dashboard or /venue-dashboard/ */}
          <Route index element={<Dashboard />} />
          {/* /venue-dashboard/add-venue */}
          <Route path="add-venue" element={<AddVenue />} />


          {/* /venue-dashboard/manage-venue */}
          <Route path="manage-venue" element={<ManageVenue />} />
          <Route path="add-trainer" element={<AddTrainer />} />
          <Route path="all-bookings" element={<AllBookings />} />
        </Route>

        {/* admin  */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="approve-venue-page" element={<AdminApproveVenues />} />
          <Route path="manage-venues" element={<ManageVenuePage />} />
          <Route path="all-booking" element={<AllVenueBookings />} />

        </Route>
      </Routes>

      {/* {!isOwnerPath && <Footer />} */}
    </>
  );
};

export default App;
