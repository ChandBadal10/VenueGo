import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    name: {
       type: String,
       required: true
      },
    email: {
       type: String,
       required: true
      },
    phone: {
      type: String,
      required: true
    },
    experience: {
      type: Number,
      required: true
    },
    specialization: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Trainer =
  mongoose.models.Trainer || mongoose.model("Trainer", trainerSchema);

export default Trainer;
