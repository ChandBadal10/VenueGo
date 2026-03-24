import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Venue from "../models/Venue.js";
import transporter from "../configs/nodeMailer.js";
import Booking from "../models/Booking.js";
import AddVenue from "../models/AddVenue.js";

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
      return res.json({ success: false, message: "Email and password required" });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = generateToken(admin);

    return res.json({
      success: true,
      token,
      role: admin.role,
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.log("Admin Login Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- Pending Venues -------------------- //
export const getPendingVenues = async (req, res) => {
  try {
    const venues = await Venue.find({ status: "pending" });
    return res.json({ success: true, venues });
  } catch (error) {
    console.log("Pending Venue Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- Approve Venue -------------------- //
export const approveVenue = async (req, res) => {
  try {
    const { venueId } = req.body;
    if (!venueId) return res.json({ success: false, message: "venueId is required" });

    const venue = await Venue.findById(venueId);
    if (!venue) return res.json({ success: false, message: "Venue not found" });

    venue.status = "approved";
    await venue.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: venue.email,
      subject: "Venue Approved",
      text: `Congratulations! Your venue "${venue.venueName}" has been approved by the admin. You can now add time slots and start accepting bookings. Thank you for choosing VenueGo.\n\nBest Regards,\nVenueGo Team`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Venue approved and email sent to owner" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- Reject Venue -------------------- //
export const rejectVenue = async (req, res) => {
  try {
    const { venueId } = req.body;
    if (!venueId) return res.json({ success: false, message: "venueId is required" });

    const venue = await Venue.findById(venueId);
    if (!venue) return res.json({ success: false, message: "Venue not found" });

    venue.status = "rejected";
    await venue.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: venue.email,
      subject: "Venue Rejected",
      text: `Hello ${venue.venueName}, We regret to inform you that your venue has not been approved at this time. You are welcome to update your venue information and resubmit.\n\nBest Regards,\nVenueGo Team`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Venue rejected successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- Admin Dashboard -------------------- //
export const getAdminDashboard = async (req, res) => {
  try {

    // ── Basic stats ────────────────────────────────────────────────────────
    const totalUsers = await User.countDocuments({ role: "user" });
    const ownerIds = await AddVenue.distinct("ownerId");
    const totalVenueOwners = ownerIds.length;
    const totalVenues = await AddVenue.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();

    const revenueResult = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // ── Monthly Revenue ────────────────────────────────────────────────────
    const monthlyRevenue = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          revenue: { $sum: "$price" }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const revenueData = monthlyRevenue.map(item => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue
    }));

    // ── Weekly Bookings (current week only — resets every Sunday) ──────────
    // Get this week's Sunday at midnight (00:00:00)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek); // go back to Sunday
    weekStart.setHours(0, 0, 0, 0);

    // Get next Sunday (end of week)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    // Query only bookings created in this current week (Sun → Sat)
    const weeklyBookings = await Booking.aggregate([
      {
        // ✅ Only bookings from this Sunday onwards
        $match: {
          createdAt: { $gte: weekStart, $lt: weekEnd }
        }
      },
      {
        $group: {
          _id: { day: { $dayOfWeek: "$createdAt" } }, // 1=Sun, 2=Mon, ... 7=Sat
          bookings: { $sum: 1 }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    // Build full 7-day array — days with no bookings show as 0
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Create a map of existing data: { 1: 5, 3: 2 } (dayOfWeek → count)
    const bookingMap = {};
    weeklyBookings.forEach(item => {
      bookingMap[item._id.day] = item.bookings;
    });

    // Fill all 7 days — missing days default to 0
    const bookingData = dayNames.map((day, index) => ({
      day,
      bookings: bookingMap[index + 1] || 0  // dayOfWeek: 1=Sun...7=Sat
    }));

    return res.json({
      success: true,
      totalUsers,
      totalVenueOwners,
      addVenues: totalVenues,
      totalBookings,
      totalRevenue,
      revenueData,
      bookingData, // ✅ always 7 items, resets every Sunday
      weekStart: weekStart.toISOString(), // optional: useful for frontend to display
      admin: {
        id: req.admin._id,
        name: req.admin.name,
        email: req.admin.email
      }
    });

  } catch (error) {
    console.log("Dashboard Error:", error.message);
    return res.json({ success: false, message: error.message });
  }
};

// -------------------- Manage Venues -------------------- //
export const getAllVenuesAdmin = async (req, res) => {
  try {
    const venues = await AddVenue.find()
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, venues });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteVenueGroupAdmin = async (req, res) => {
  try {
    const { venueName, location } = req.body;

    if (!venueName || !location) {
      return res.json({ success: false, message: "venueName and location required" });
    }

    await AddVenue.deleteMany({
      venueName: new RegExp(`^${venueName}$`, "i"),
      location: new RegExp(`^${location}$`, "i")
    });

    await Venue.deleteMany({
      venueName: new RegExp(`^${venueName}$`, "i"),
      location: new RegExp(`^${location}$`, "i")
    });

    res.json({ success: true, message: "Venue deleted from platform" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleVenueAvailabilityAdmin = async (req, res) => {
  try {
    const { venueName, location } = req.body;

    if (!venueName || !location) {
      return res.json({ success: false, message: "venueName and location required" });
    }

    const slot = await AddVenue.findOne({ venueName, location });
    if (!slot) return res.json({ success: false, message: "Venue not found" });

    const newStatus = !slot.isActive;

    await AddVenue.updateMany(
      { venueName, location },
      { $set: { isActive: newStatus } }
    );

    res.json({ success: true, status: newStatus ? "Available" : "Unavailable" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};