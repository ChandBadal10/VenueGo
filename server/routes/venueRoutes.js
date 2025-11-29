
import express from "express";
import { protect } from "../middleware/auth.js";

import {
    upload,
    registerVenue,
    approveVenue,
    rejectVenue,
    checkVenueStatus
} from "../controllers/venueController.js";

const venueRouter = express.Router();


// Register venue (Owner)
venueRouter.post("/register", protect, upload.single("image"), registerVenue);


// Check venue status (Owner)
venueRouter.get("/status", protect, checkVenueStatus);


// Admin Approve
venueRouter.put("/approve", protect, approveVenue);


// Admin Reject
venueRouter.put("/reject", protect, rejectVenue);


export default venueRouter;
