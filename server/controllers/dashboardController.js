import AddVenue from "../models/AddVenue.js";
import Booking from "../models/Booking.js";

export const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const totalVenues = await AddVenue.countDocuments({
      ownerId,
      isActive: true
    });

    const totalBookings = await Booking.countDocuments({ ownerId });

    const totalRevenueAgg = await Booking.aggregate([
      { $match: { ownerId } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyAgg = await Booking.aggregate([
      {
        $match: {
          ownerId,
          createdAt: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);

    const monthlyRevenue = monthlyAgg[0]?.total || 0;

    const recentBookings = await Booking.find({ ownerId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalVenues,
        totalBookings,
        totalRevenue,
        monthlyRevenue,
        recentBookings
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
