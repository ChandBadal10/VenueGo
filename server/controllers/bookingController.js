import Booking from "../models/Booking.js";
import AddVenue from "../models/AddVenue.js";

/**
 * CREATE BOOKING
 * POST /api/bookings/create
 */
export const createBooking = async (req, res) => {
  try {
    const { venueId, venueName, venueType, price, date, startTime, endTime, location, description } = req.body;

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
    const alreadyBooked = await Booking.findOne({ venueId, date, startTime, endTime });

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

// get all bookings

export const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const bookings = await Booking.find({ ownerId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings: bookings.map(b => ({
        _id: b._id,
        venueName: b.venueName,
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,
        price: b.price,
        user: {
          name: b.userId?.name,
          email: b.userId?.email
        }
      }))
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// get user bookings



export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId })
      .populate("venueId", "venueName location")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// export const cancelBooking = async (req, res) => {
//   try {
//     const bookingId = req.params.id;
//     const userId = req.user._id;

//     const booking = await Booking.findOne({
//       _id: bookingId,
//       userId
//     });

//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found"
//       });
//     }

//     if (booking.status === "Cancelled") {
//       return res.json({
//         success: false,
//         message: "Booking already cancelled"
//       });
//     }

//     booking.status = "Cancelled";
//     await booking.save();

//     res.json({
//       success: true,
//       message: "Booking cancelled successfully"
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };




