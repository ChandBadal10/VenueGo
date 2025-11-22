// routes/adminRoutes.js
import express from "express";
import { adminProtect } from "../middleware/adminAuth.js";
import { protect } from "../middleware/auth.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const router = express.Router();



// Admin login endpoint (optional, you can use /api/user/login instead)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id.toString(), role: admin.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ success: true, token, role: admin.role, user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }});
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

// Example protected route
router.get("/dashboard", protect, adminProtect, (req, res) => {
  res.json({ success: true, message: "Welcome admin", admin: { id: req.admin._id, email: req.admin.email, name: req.admin.name } });
});

export default router;
