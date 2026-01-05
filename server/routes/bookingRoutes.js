import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createBooking,
  getBookedSlots
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", protect, createBooking);
bookingRouter.get("/slots", getBookedSlots);

export default bookingRouter;
