import express from "express";
import { protect } from "../middleware/auth.js";
import { approveVenue, rejectVenue } from "../controllers/adminController.js";

import { upload, registerVenue,  checkVenueStatus } from "../controllers/venueController.js";

const venueRouter = express.Router();


// Register venue (Owner)
venueRouter.post("/register", protect, upload.single("image"), registerVenue);


venueRouter.put("/approve", protect, approveVenue);


venueRouter.put("/reject", protect, rejectVenue);
// Check venue status (Owner)
venueRouter.get("/status", protect, checkVenueStatus);


export default venueRouter;
