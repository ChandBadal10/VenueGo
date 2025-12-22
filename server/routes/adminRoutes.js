import express from "express";
import { protect } from "../middleware/auth.js";
import { adminProtect } from "../middleware/adminAuth.js";

import { adminLogin, getAdminDashboard, getPendingVenues, approveVenue,rejectVenue } from "../controllers/adminController.js";

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


export default adminRouter;
