import Booking from "../models/Booking.js";
import AddVenue from "../models/AddVenue.js";

// Nepal is UTC+5:45 (unique 45-minute offset)
// Change this if you deploy to a different timezone:
// India = 5*60+30=330, Pakistan = 5*60=300, IST = 330
const TIMEZONE_OFFSET_MINUTES = 5 * 60 + 45;

/**
 * Converts Nepal local time (date: "YYYY-MM-DD", time: "HH:MM")
 * into a proper UTC Date object by subtracting the Nepal offset.
 */
function toUTC(date, time) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  const localMs = Date.UTC(year, month - 1, day, hours, minutes, 0);
  return new Date(localMs - TIMEZONE_OFFSET_MINUTES * 60 * 1000);
}

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
      return res.json({ success: false, message: "Missing booking details" });
    }

    const venueSlot = await AddVenue.findById(venueId);

    if (!venueSlot || !venueSlot.isActive) {
      return res.json({ success: false, message: "Venue not available" });
    }

    // CHECK USER MAX BOOKING LIMIT
    if (venueSlot.maxBookingsPerUser > 0) {
      const userBookingCount = await Booking.countDocuments({
        userId: req.user._id,
        venueId,
        status: "confirmed",
      });
      if (userBookingCount >= venueSlot.maxBookingsPerUser) {
        return res.json({
          success: false,
          message: `You can book this venue maximum ${venueSlot.maxBookingsPerUser} times only`,
        });
      }
    }

    // COUNT TOTAL BOOKINGS FOR THIS SLOT
    const bookingCount = await Booking.countDocuments({
      venueId,
      date,
      startTime,
      endTime,
      status: "confirmed",
    });

    // CAPACITY CHECK
    if (bookingCount >= venueSlot.capacity) {
      return res.json({
        success: false,
        message: `Venue is fully booked (${bookingCount}/${venueSlot.capacity})`,
      });
    }

    // Convert Nepal local time → real UTC
    const startDateTime = toUTC(date, startTime);

    if (isNaN(startDateTime.getTime())) {
      return res.json({ success: false, message: "Invalid date/time format" });
    }

    // Reminder fires exactly 1 hour before game start
    const reminderTime = new Date(startDateTime.getTime() - 60 * 60 * 1000);

    // Debug logs — remove in production
    const nowUTC = new Date();
    console.log("Local input:         ", date, startTime, "(Nepal time)");
    console.log("startDateTime (UTC): ", startDateTime.toISOString());
    console.log("reminderTime  (UTC): ", reminderTime.toISOString());
    console.log("now           (UTC): ", nowUTC.toISOString());
    console.log(
      "Reminder fires in:  ",
      Math.round((reminderTime - nowUTC) / 1000 / 60),
      "minutes from now"
    );

    // CREATE BOOKING
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
      startDateTime,
      reminderTime,
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








// GET BOOKED SLOTS WITH AVAILABILITY
export const getBookedSlots = async (req, res) => {
  try {
    const { venueId, date } = req.query;

    if (!venueId || !date) {
      return res.json({ success: false, message: "Missing venueId or date" });
    }

    const venue = await AddVenue.findById(venueId);
    if (!venue) {
      return res.json({ success: false, message: "Venue not found" });
    }

    const bookingCount = await Booking.countDocuments({
      venueId,
      date,
      status: "confirmed",
    });

    const bookedSlots = await Booking.find({
      venueId,
      date,
      status: "confirmed",
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





//get all bookings for venue owner


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
        status: b.status,
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





// get all bookings for the user

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ userId })
      .populate("venueId", "venueName location")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// get all bookings for the admin

export const getAllBookingsAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.json({ success: false, message: "Access denied. Admin only" });
    }

    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("venueId", "venueName location")
      .sort({ createdAt: -1 });

    res.json({ success: true, total: bookings.length, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};