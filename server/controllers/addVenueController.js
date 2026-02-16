import AddVenue from "../models/AddVenue.js";
import imagekit from "../configs/imagekit.js";

// ------------------ Create Venue with Image ------------------
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
    } = req.body;

    if (
      !venueName ||
      !venueType ||
      !price ||
      !date ||
      !startTime ||
      !endTime ||
      !location ||
      !description
    ) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Image upload
    let imageUrl = "";
    if (req.file) {
      try {
        const base64File = req.file.buffer.toString("base64");
        const imageUpload = await imagekit.upload({
          file: base64File,
          fileName: `${Date.now()}_${req.file.originalname}`,
          folder: "/venues",
        });
        imageUrl = imageUpload.url;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (err) {
        console.error("ImageKit upload failed:", err);
        return res.json({
          success: false,
          message: "Image upload failed: " + (err.message || "Unknown error"),
        });
      }
    } else {
      return res.json({ success: false, message: "Venue image is required" });
    }

    // AUTO-SET CAPACITY BASED ON VENUE TYPE
    let capacity = 1; // Default for single-person venues

    const venueTypeLower = venueType.toLowerCase();

    // Group venues that can accommodate multiple people
    if (
      venueTypeLower.includes("gym") ||
      venueTypeLower.includes("swimming") ||
      venueTypeLower.includes("pool") ||
      venueTypeLower.includes("fitness") ||
      venueTypeLower.includes("yoga") ||
      venueTypeLower.includes("dance")

    ) {
      capacity = 20; // Set to 20 for group venues
    }

    console.log(`Venue type: ${venueType}, Auto-set capacity: ${capacity}`);

    const venue = await AddVenue.create({
      ownerId: req.user._id,
      venueName,
      venueType,
      price,
      date,
      startTime,
      endTime,
      location,
      description,
      image: imageUrl,
      isActive: true,
      capacity: capacity,  // AUTO-SET CAPACITY
      bookedCount: 0,
    });

    return res.json({
      success: true,
      message: "Venue added successfully",
      venue,
    });
  } catch (error) {
    console.error("Create Venue Error:", error);
    return res.json({ success: false, message: error.message || "Server error" });
  }
};

// ------------------ Get All Venues ------------------
export const getAllVenues = async (req, res) => {
  try {
    const venues = await AddVenue.find().sort({ createdAt: -1 });
    return res.json({ success: true, venues });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ------------------ Get Owner Venues ------------------
export const getOwnerVenues = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const venues = await AddVenue.find({ ownerId }).sort({ createdAt: -1 });
    return res.json({ success: true, venues });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ------------------ Get Single Venue by ID ------------------
export const getVenueById = async (req, res) => {
  try {
    const venue = await AddVenue.findById(req.params.id);
    if (!venue) return res.json({ success: false, message: "Venue not found" });

    return res.json({ success: true, venue });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ------------------ Get Venue With All Slots ------------------
export const getVenueWithSlots = async (req, res) => {
  try {
    const { id } = req.params;

    const mainVenue = await AddVenue.findById(id);
    if (!mainVenue) return res.json({ success: false, message: "Venue not found" });

    const allSlots = await AddVenue.find({
      venueName: mainVenue.venueName,
      location: mainVenue.location,
    }).sort({ date: 1, startTime: 1 });

    const slotsByDate = {};
    allSlots.forEach((slot) => {
      if (!slotsByDate[slot.date]) slotsByDate[slot.date] = [];
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