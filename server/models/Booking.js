import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddVenue",
      required: true
    },

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
    startDateTime: { type: Date, required: true },
    reminderTime: { type: Date, required: true },
    reminderSent: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed"
    }
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
