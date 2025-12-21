import express from "express";
import { protect } from "../middleware/auth.js";
import { createVenue } from "../controllers/addVenueController.js";

const addVenueRouter = express.Router();

addVenueRouter.post("/create", protect, createVenue);

export default addVenueRouter;
