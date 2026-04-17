import AddVenue from "../models/AddVenue.js";
import imagekit from "../configs/imagekit.js";

// CREATE VENUE
export const createVenue = async (req, res) => {
  try {
    const {
      venueName,
      venueType,
      price,
      date,
      startTime,
      endTime,
      location,
      description,
      capacity,
    } = req.body;

    if (
      !venueName?.trim() ||
      !venueType?.trim() ||
      !price ||
      !date ||
      !startTime ||
      !endTime ||
      !location?.trim() ||
      !description?.trim() ||
      capacity === undefined ||
      capacity === ""
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate capacity is a positive number
    if (isNaN(Number(capacity)) || Number(capacity) <= 0) {
      return res.json({
        success: false,
        message: "Capacity must be a positive number",
      });
    }

    // IMAGE UPLOAD
    let imageUrl = "";

    if (req.file) {
      try {
        const base64File = req.file.buffer.toString("base64");

        const upload = await imagekit.upload({
          file: base64File,
          fileName: `${Date.now()}_${req.file.originalname}`,
          folder: "/venues",
        });

        imageUrl = upload.url;
      } catch (err) {
        return res.json({
          success: false,
          message: "Image upload failed",
        });
      }
    } else {
      return res.json({
        success: false,
        message: "Venue image is required",
      });
    }

    // CREATE VENUE
    const venue = await AddVenue.create({
      ownerId: req.user._id,
      venueName: venueName.trim(),
      venueType: venueType.trim(),
      price: Number(price),
      date,
      startTime,
      endTime,
      location: location.trim(),
      description: description.trim(),
      image: imageUrl,
      isActive: true,
      capacity: Number(capacity),
      bookedCount: 0,
    });

    return res.json({
      success: true,
      message: "Venue added successfully",
      venue,
    });
  } catch (error) {
    console.error("Create Venue Error:", error);
    return res.json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// GET ALL VENUES
export const getAllVenues = async (req, res) => {
  try {
    const venues = await AddVenue.find().sort({ createdAt: -1 });
    return res.json({ success: true, venues });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// OWNER VENUES
export const getOwnerVenues = async (req, res) => {
  try {
    const venues = await AddVenue.find({ ownerId: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, venues });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// SINGLE VENUE
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

// VENUE WITH SLOTS
export const getVenueWithSlots = async (req, res) => {
  try {
    const { id } = req.params;

    const mainVenue = await AddVenue.findById(id);
    if (!mainVenue) {
      return res.json({ success: false, message: "Venue not found" });
    }

    const allSlots = await AddVenue.find({
      venueName: mainVenue.venueName,
      location: mainVenue.location,
    }).sort({ date: 1, startTime: 1 });

    const slotsByDate = {};

    allSlots.forEach((slot) => {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }

      slotsByDate[slot.date].push({
        _id: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        date: slot.date,
        price: slot.price,
        isActive: slot.isActive,
        image: slot.image,
        capacity: slot.capacity,
        bookedCount: slot.bookedCount,
        availableSlots: slot.capacity - slot.bookedCount,
      });
    });

    return res.json({
      success: true,
      venue: mainVenue,
      allSlots,
      slotsByDate,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};