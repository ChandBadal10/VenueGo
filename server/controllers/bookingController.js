import Booking from "../models/Booking.js";
import Venue from "../models/Venue.js";




// Create booking

export const createBooking = async (req, res) => {

    try{
        const {venueId, date, slot} = req.body;

        // validate inputs

        if(!venueId || !date || !slot) {
            return res.json({success: false, message: "Venue, date and slot are required"});
        }


        // check the venue is approved or not by admin

        const venue = await Venue.findById(venueId);
        if(!venue || venue.status !== "approved") {
            return res.json({success: false, message: "Venue not available"});
        }

        // prevent double booking

        const existingBooking = await Booking.findOne({venueId, date, slot, status: {$ne: "cancelled"}})


        if(existingBooking) {
            return res.json({success: false, message: "This slot is already booked"});
        }



        //create booking

        const booking = await Booking.create({userId: req.user._id, venueId, date, slot, price: venue.pricePerHour || 0});

        return res.json({success: true, message: "Booking created successfully", booking});

    } catch(error) {
        return res.json({success: false, message: error.message})

    }
};



export const getMyBookings = async (req, res) => {
    try{
        const bookings = await Booking.find({userId: req.user._id})
        .populate("venueId", "venueName location image")
        .sort({createdAt: -1});

        return res.json({success: true, bookings})

    } catch(error) {
        return res.json({success: false, message: error.message})
    }
}



export const getBookedSlots = async (req, res) => {
  try {
    const { venueId, date } = req.query;

    if (!venueId || !date) {
      return res.json({
        success: false,
        message: "Venue and date are required"
      });
    }

    const bookings = await Booking.find({
      venueId,
      date,
      status: { $ne: "cancelled" }
    });

    const bookedSlots = bookings.map(b => b.slot);

    return res.json({
      success: true,
      bookedSlots
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
};

