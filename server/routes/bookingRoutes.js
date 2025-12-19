import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createBooking,
  getMyBookings,
  getBookedSlots
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// User creates booking
bookingRouter.post("/create", protect, createBooking);

// User sees own bookings
bookingRouter.get("/my", protect, getMyBookings);

// VenueDetails – booked slots
bookingRouter.get("/slots", getBookedSlots);

export default bookingRouter;
