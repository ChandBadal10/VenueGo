import express from "express";
import { protect } from "../middleware/auth.js";
import { adminProtect } from "../middleware/adminAuth.js";

import { adminLogin, getAdminDashboard, getPendingVenues, approveVenue,rejectVenue, getAllVenuesAdmin, deleteVenueGroupAdmin, toggleVenueAvailabilityAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();


// Admin Login
adminRouter.post("/login", adminLogin);


// Admin Dashboard
adminRouter.get("/dashboard", protect, adminProtect, getAdminDashboard);


// Get Pending Venues
adminRouter.get("/venues/pending", protect, adminProtect, getPendingVenues);


// Approve Venue
adminRouter.post("/venue/approve", protect, adminProtect, approveVenue);


// Reject Venue
adminRouter.post("/venue/reject", protect, adminProtect, rejectVenue);


// Get all venues
adminRouter.get("/venues", protect, adminProtect,  getAllVenuesAdmin);


// Delete venue (global)
adminRouter.delete( "/venue/delete-group", protect, adminProtect, deleteVenueGroupAdmin);

// Toggle availability (global)
adminRouter.patch( "/venue/toggle-availability", protect, adminProtect, toggleVenueAvailabilityAdmin);
export default adminRouter;
