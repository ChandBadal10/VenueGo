import express from "express";
import { protect } from "../middleware/auth.js";
import { approveVenue, rejectVenue } from "../controllers/adminController.js";

import {  registerVenue,  checkVenueStatus } from "../controllers/venueController.js";
import upload from "../configs/multer.js";
import { deleteVenueGroup } from "../controllers/venueController.js";
import { toggleVenueAvailability } from "../controllers/venueController.js";

const venueRouter = express.Router();


// Register venue (Owner)
venueRouter.post("/register", protect, upload.single("image"), registerVenue);

//Admin approve reject
venueRouter.put("/approve", protect, approveVenue);

venueRouter.put("/reject", protect, rejectVenue);


// Check venue status (Owner)
venueRouter.get("/status", protect, checkVenueStatus);

venueRouter.delete("/delete-group", protect, deleteVenueGroup);
venueRouter.patch("/toggle-availability", protect, toggleVenueAvailability);



export default venueRouter;
