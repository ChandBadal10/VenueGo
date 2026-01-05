import express from "express";
import { protect } from "../middleware/auth.js";
import { createVenue } from "../controllers/addVenueController.js";
import { getAllVenues } from "../controllers/addVenueController.js";
import { getVenueById } from "../controllers/addVenueController.js";
import { getOwnerVenues } from "../controllers/addVenueController.js";



const addVenueRouter = express.Router();




addVenueRouter.post("/create", protect, createVenue);
addVenueRouter.get("/owner", protect, getOwnerVenues);
addVenueRouter.get("/all", getAllVenues);

addVenueRouter.get("/:id", getVenueById);


export default addVenueRouter;
