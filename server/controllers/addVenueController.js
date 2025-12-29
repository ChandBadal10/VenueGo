import AddVenue from "../models/AddVenue.js";

export const createVenue = async (req, res) => {
  try {
    const { venueName, venueType, price, date, startTime, endTime, location, description } = req.body;

    if (!venueName || !venueType || !price || !date || !startTime || !endTime || !location || !description) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const venue = await AddVenue.create({ ownerId: req.user._id, venueName, venueType, price, date, startTime, endTime, location, description });

    return res.json({ success: true, message: "Venue added successfully", venue });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Get all venues
export const getAllVenues = async (req, res) => {
  try {
    const venues = await AddVenue.find().sort({ createdAt: -1 });
    return res.json({ success: true, venues });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//  Get single venue by ID
export const getVenueById = async (req, res) => {
  try {
    const venue = await AddVenue.findById(req.params.id);
    if (!venue) {
      return res.json({ success: false, message: "Venue not found" });
    }

    return res.json({ success: true, venue });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};




// Get venue with all its time slots
export const getVenueWithSlots = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the main venue
    const mainVenue = await Venue.findById(id);

    if (!mainVenue) {
      return res.json({ success: false, message: "Venue not found" });
    }

    // Find all venues with the same name and location (all time slots)
    const allSlots = await Venue.find({ venueName: mainVenue.venueName, location: mainVenue.location }).sort({ date: 1, startTime: 1 });

    // Group slots by date
    const slotsByDate = {};
    allSlots.forEach(venue => {
      if (!slotsByDate[venue.date]) {
        slotsByDate[venue.date] = [];
      }
      slotsByDate[venue.date].push({
        _id: venue._id,
        startTime: venue.startTime,
        endTime: venue.endTime,
        date: venue.date
      });
    });

    return res.json({
      success: true,
      venue: mainVenue,
      allSlots: allSlots,
      slotsByDate: slotsByDate
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const deleteVenueGroup = async (req, res) => {
  try {
    const { venueName, location } = req.body;

    await AddVenue.deleteMany({
      venueName: { $regex: new RegExp("^" + venueName + "$", "i") },
      location: { $regex: new RegExp("^" + location + "$", "i") }
    });

    return res.json({
      success: true,
      message: "Venue deleted successfully"
    });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


