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

    image: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    },


    capacity: {
      type: Number,
      default: 1
    },

    bookedCount: {
      type: Number,
      default: 0
    },

    maxBookingsPerUser: {
  type: Number,
  default: 0,
},
  },
  { timestamps: true }
);

const AddVenue =
  mongoose.models.AddVenue || mongoose.model("AddVenue", addVenueSchema);

export default AddVenue;