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



export const getAdminDashboard = async (req, res) => {
  try {

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

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const revenueData = monthlyRevenue.map(item => ({
      month: monthNames[item._id.month - 1],
      revenue: item.revenue
    }));

    //  WEEKLY BOOKING TREND
    const weeklyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { day: { $dayOfWeek: "$createdAt" } },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const bookingData = weeklyBookings.map(item => ({
      day: dayNames[item._id.day - 1],
      bookings: item.bookings
    }));

    return res.json({
      success: true,

      // main stats
      totalUsers,
      totalVenueOwners,
      addVenues: totalVenues,
      totalBookings,
      totalRevenue,

      // charts
      revenueData,
      bookingData,

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




// manage venue part

export const getAllVenuesAdmin = async (req, res) => {
  try {
    const venues = await AddVenue.find()
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      venues
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};





export const deleteVenueGroupAdmin = async (req, res) => {
  try {
    const { venueName, location } = req.body;

    if (!venueName || !location) {
      return res.json({
        success: false,
        message: "venueName and location required"
      });
    }

    // delete all slots
    await AddVenue.deleteMany({
      venueName: new RegExp(`^${venueName}$`, "i"),
      location: new RegExp(`^${location}$`, "i")
    });

    // delete main venue
    await Venue.deleteMany({
      venueName: new RegExp(`^${venueName}$`, "i"),
      location: new RegExp(`^${location}$`, "i")
    });

    res.json({
      success: true,
      message: "Venue deleted from platform"
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const toggleVenueAvailabilityAdmin = async (req, res) => {
  try {
    const { venueName, location } = req.body;

    if (!venueName || !location) {
      return res.json({
        success: false,
        message: "venueName and location required"
      });
    }

    const slot = await AddVenue.findOne({
      venueName,
      location
    });

    if (!slot) {
      return res.json({
        success: false,
        message: "Venue not found"
      });
    }

    const newStatus = !slot.isActive;

    await AddVenue.updateMany(
      { venueName, location },
      { $set: { isActive: newStatus } }
    );

    res.json({
      success: true,
      status: newStatus ? "Available" : "Unavailable"
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
