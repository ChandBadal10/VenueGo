import Booking from "../models/Booking.js";
import AddVenue from "../models/AddVenue.js";

/**
 * CREATE BOOKING (WITH CAPACITY CHECK)
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
      description,
    } = req.body;

    if (!venueId || !date || !startTime || !endTime) {
      return res.json({
        success: false,
        message: "Missing booking details",
      });
    }

    const venueSlot = await AddVenue.findById(venueId);

    if (!venueSlot || !venueSlot.isActive) {
      return res.json({
        success: false,
        message: "Venue not available",
      });
    }

    //  CHECK USER MAX BOOKING LIMIT
    if (venueSlot.maxBookingsPerUser > 0) {
      const userBookingCount = await Booking.countDocuments({
        userId: req.user._id,
        venueId,
      });

      if (userBookingCount >= venueSlot.maxBookingsPerUser) {
        return res.json({
          success: false,
          message: `You can book this venue maximum ${venueSlot.maxBookingsPerUser} times only`,
        });
      }
    }

    //  COUNT TOTAL BOOKINGS FOR THIS SLOT
    const bookingCount = await Booking.countDocuments({
      venueId,
      date,
      startTime,
      endTime,
    });

    //  CAPACITY CHECK
    if (bookingCount >= venueSlot.capacity) {
      return res.json({
        success: false,
        message: `Venue is fully booked (${bookingCount}/${venueSlot.capacity})`,
      });
    }


    //  CREATE BOOKING
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
      description,
    });

    await AddVenue.findByIdAndUpdate(venueId, {
      bookedCount: bookingCount + 1,
    });

    return res.json({
      success: true,
      message: "Booking confirmed",
      booking,
    });

  } catch (error) {
    console.error("Booking error:", error);
    return res.json({ success: false, message: error.message });
  }
};


//  GET BOOKED SLOTS WITH AVAILABILITY

export const getBookedSlots = async (req, res) => {
  try {
    const { venueId, date } = req.query;

    if (!venueId || !date) {
      return res.json({ success: false });
    }

    const venue = await AddVenue.findById(venueId);

    if (!venue) {
      return res.json({ success: false, message: "Venue not found" });
    }

    // Count actual bookings
    const bookingCount = await Booking.countDocuments({
      venueId,
      date,
    });

    const bookedSlots = await Booking.find({
      venueId,
      date,
    }).select("date startTime endTime userId");

    return res.json({
      success: true,
      bookedSlots,
      capacity: venue.capacity,
      bookedCount: bookingCount,
      availableSlots: venue.capacity - bookingCount,
      isFull: bookingCount >= venue.capacity,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const bookings = await Booking.find({ ownerId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings: bookings.map((b) => ({
        _id: b._id,
        venueName: b.venueName,
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,
        price: b.price,
        user: {
          name: b.userId?.name,
          email: b.userId?.email,
        },
      })),
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId })
      .populate("venueId", "venueName location")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBookingsAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.json({
        success: false,
        message: "Access denied. Admin only",
      });
    }

    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("venueId", "venueName location")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};



