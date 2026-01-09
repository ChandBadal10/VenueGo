import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Venue from "../models/Venue.js";
import transporter from "../configs/nodeMailer.js";

// Generate Admin Token
const generateToken = (admin) => {
  const payload = { id: admin._id.toString(), role: admin.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// -------------------- Admin Login -------------------- //
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password required",
      });
    }

    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(admin);

    return res.json({
      success: true,
      token,
      role: admin.role,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.log("Admin Login Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// Admin Dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Welcome admin",
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get Pending Venues
export const getPendingVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ status: "pending" });
    return res.json({ success: true, venues });
  } catch (error) {
    console.log("Pending Venue Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

//Approve Venue
export const approveVenue = async (req, res) => {
  try {
    const { venueId } = req.body;

    if (!venueId) {
      return res.json({ success: false, message: "venueId is required" });
    }

    const venue = await Venue.findById(venueId);

    if (!venue) {
      return res.json({ success: false, message: "Venue not found" });
    }

    venue.status = "approved";
    await venue.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: venue.email,
      subject: "Venue Approved",
      text: `  Congratulations!  Your venue "${venue.venueName}"
              has been approved by the admin. You can now add time slots and start accepting bookings from users. Thank you for choosing VenueGo
              Best Regards,

              VenueGo Team`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Venue approved and email sent to owner",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//  Reject Venue
export const rejectVenue = async (req, res) => {
  try {
    const { venueId } = req.body;

    if (!venueId) {
      return res.json({ success: false, message: "venueId is required" });
    }

    const venue = await Venue.findById(venueId);

    if (!venue) {
      return res.json({ success: false, message: "Venue not found" });
    }

    venue.status = "rejected";
    await venue.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: venue.email,
      subject: "Venue Rejected",
      text: `Hello ${venue.venueName}, We regret to inform you that your venue has not been approved by the admin at this time.
            After reviewing the submitted details, your venue did not meet the current approval requirements. You are welcome to update your venue information and submit it again for review.
            If you have any questions or need assistance, feel free to contact our support team.
            Best Regards,
            VenueGo Team`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Venue rejected successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
