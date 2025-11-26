// routes/venueRoutes.js
import express from "express";
import { protect } from "../middleware/auth.js";
import Venue from "../models/Venue.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/venues"); // folder to store images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

// -------------------- Venue Registration -------------------- //
// Use `upload.single("image")` if only one image is uploaded
router.post("/register", protect, upload.single("image"), async (req, res) => {
  try {
    // Multer puts text fields in req.body and file info in req.file
    const { venueName, category, phone, email, location, description } = req.body;

    if (!venueName || !category || !req.file) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newVenue = new Venue({
      ownerId: req.user._id,
      venueName,
      category,
      phone,
      email,
      location,
      description,
      image: req.file.path, // save path to image
      status: "pending",
    });

    await newVenue.save();

    res.json({ success: true, message: "Venue registered successfully" });
  } catch (err) {
    console.log("Register error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
