import Booking from "../models/Booking.js";
import AddVenue from "../models/AddVenue.js";

/**
 * CREATE BOOKING
 * POST /api/bookings/create
 */
export const createBooking = async (req, res) => {
  try {
    const {
      venueId,
      venueName,
      venueType,
      price,
      date,
      startTime,
      endTime,
      location,
      description
    } = req.body;

    if (!venueId || !date || !startTime || !endTime) {
      return res.json({
        success: false,
        message: "Missing booking details"
      });
    }

    const venueSlot = await AddVenue.findById(venueId);

    if (!venueSlot || !venueSlot.isActive) {
      return res.json({
        success: false,
        message: "Venue not available"
      });
    }

    // Prevent double booking
    const alreadyBooked = await Booking.findOne({
      venueId,
      date,
      startTime,
      endTime
    });

    if (alreadyBooked) {
      return res.json({
        success: false,
        message: "Slot already booked"
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      ownerId: venueSlot.ownerId,
      venueId,
      venueName,
      venueType,
      price,
      date,
      startTime,
      endTime,
      location,
      description
    });

    return res.json({
      success: true,
      message: "Booking confirmed",
      booking
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

/**
 * GET BOOKED SLOTS
 * GET /api/bookings/slots
 */
export const getBookedSlots = async (req, res) => {
  try {
    const { venueId, date } = req.query;

    if (!venueId || !date) {
      return res.json({ success: false });
    }

    const bookedSlots = await Booking.find({
      venueId,
      date
    }).select("date startTime endTime");

    return res.json({
      success: true,
      bookedSlots
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
