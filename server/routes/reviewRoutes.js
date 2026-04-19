import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createReview,
  getVenueReviews,
  getOwnerReviews,
  deleteReview,
  checkCanReview,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

// Public — anyone can see venue reviews
reviewRouter.get("/venue/:venueId", getVenueReviews);

// Protected — must be logged in
reviewRouter.post("/create", protect, createReview);
reviewRouter.get("/owner",   protect, getOwnerReviews);
reviewRouter.get("/can-review/:venueId", protect, checkCanReview);
reviewRouter.delete("/:reviewId", protect, deleteReview);

export default reviewRouter;