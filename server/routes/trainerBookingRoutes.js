import express from "express";
import { createTrainerBooking, getAllTrainerBookings, getTrainerBookings } from "../controllers/trainerBookingController.js";
import { protect } from "../middleware/auth.js";

const trainerBookingRouter = express.Router();

trainerBookingRouter.post("/create", protect, createTrainerBooking);
trainerBookingRouter.get("/", getAllTrainerBookings);

// Owner: get all trainer bookings
trainerBookingRouter.get("/trainer", protect, getTrainerBookings);

export default trainerBookingRouter;
