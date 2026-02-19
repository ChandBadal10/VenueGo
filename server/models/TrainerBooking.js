import mongoose from "mongoose";

const trainerBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    trainerName: String,
    specialization: String,
    venueName: String,
    date: String,
    startTime: String,
    endTime: String,
    price: Number,
  },
  { timestamps: true }
);

export default mongoose.model("TrainerBooking", trainerBookingSchema);
