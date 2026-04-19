import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // Who wrote the review
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Which venue is being reviewed
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddVenue",
      required: true,
    },

    // The venue owner
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Star rating 1 to 5
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Written comment
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    // Venue name — stored directly so it shows even if venue is deleted
    venueName: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

//  One user can only review the same venue once
reviewSchema.index({ userId: 1, venueId: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;