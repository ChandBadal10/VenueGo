import mongoose from "mongoose";

const addVenueSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    venueName: {
      type: String,
      required: true
    },

    venueType: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    date: {
      type: String,
      required: true
    },

    startTime: {
      type: String,
      required: true
    },

    endTime: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    // ImageKit URL for the venue image
    image: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);

const AddVenue =
  mongoose.models.AddVenue || mongoose.model("AddVenue", addVenueSchema);

export default AddVenue;