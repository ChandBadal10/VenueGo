// routes/adminRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Venue from "../models/Venue.js";
import { protect } from "../middleware/auth.js";
import { adminProtect } from "../middleware/adminAuth.js";

const router = express.Router();

// -------------------- Admin Login -------------------- //
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id.toString(), role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      role: admin.role,
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------- Admin Dashboard Example -------------------- //
router.get("/dashboard", protect, adminProtect, (req, res) => {
  res.json({
    success: true,
    message: "Welcome admin",
    admin: { id: req.admin._id, email: req.admin.email, name: req.admin.name },
  });
});

// -------------------- Pending Venues -------------------- //
router.get("/venues/pending", protect, adminProtect, async (req, res) => {
  try {
    const venues = await Venue.find({ status: "pending" });
    res.json({ success: true, venues });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------- Approve Venue -------------------- //
router.post("/venue/approve", protect, adminProtect, async (req, res) => {
  try {
    const { venueId } = req.body;
    if (!venueId) return res.status(400).json({ success: false, message: "venueId is required" });

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });

    venue.status = "approved";
    await venue.save();

    res.json({ success: true, message: "Venue approved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------- Reject Venue -------------------- //
router.post("/venue/reject", protect, adminProtect, async (req, res) => {
  try {
    const { venueId } = req.body;
    if (!venueId) return res.status(400).json({ success: false, message: "venueId is required" });

    const venue = await Venue.findById(venueId);
    if (!venue) return res.status(404).json({ success: false, message: "Venue not found" });

    venue.status = "rejected";
    await venue.save();

    res.json({ success: true, message: "Venue rejected successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
