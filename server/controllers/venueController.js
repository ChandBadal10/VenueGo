import Venue from "../models/Venue.js";
import AddVenue from "../models/AddVenue.js";
import imagekit from "../configs/imagekit.js";

// ------------------ Register Venue ------------------


export const registerVenue = async (req, res) => {
  try {

    const { venueName, category, phone, email, location, description } = req.body;

    if (!venueName || !category || !phone || !email || !location || !description) {
      return res.json({ success: false, message: "Please fill all the fields" });
    }

    if (!req.file) {
      return res.json({ success: false, message: "Venue Image is required" });
    }

    // Upload image to ImageKit
    let imageUpload;
    try {
      // Convert buffer to base64
      const base64File = req.file.buffer.toString('base64');

      imageUpload = await imagekit.upload({
        file: base64File, // Use base64 string instead of buffer
        fileName: `${Date.now()}_${req.file.originalname}`,
        folder: "/venues", // Optional: organize images in folders
      });
      console.log("Image uploaded successfully:", imageUpload.url);
    } catch (err) {
      console.error("ImageKit upload failed:", err);
      return res.json({ success: false, message: "Image upload failed: " + (err.message || "Unknown error") });
    }

    const venue = await Venue.create({
      ownerId: req.user._id,
      venueName,
      category,
      phone,
      email,
      location,
      description,
      image: imageUpload.url,
      status: "pending",
    });

    return res.json({
      success: true,
      message: "Venue registered successfully! Waiting for admin approval.",
      venue,
    });
  } catch (error) {
    console.error("Venue Register Error:", error);
    return res.json({ success: false, message: error.message || "Server error" });
  }
};

//Check Venue Status
export const checkVenueStatus = async (req, res) => {
  try {
    const venue = await Venue.findOne({ ownerId: req.user._id });
    if (!venue) return res.json({ exists: false });

    return res.json({ exists: true, status: venue.status });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Delete Venue
export const deleteVenueGroup = async (req, res) => {
  try {
    const { venueName, location } = req.body;
    await AddVenue.deleteMany({
      venueName: new RegExp(`^${venueName}$`, "i"),
      location: new RegExp(`^${location}$`, "i"),
    });

    res.json({ success: true, message: "Venue deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//  Toggle Availability
export const toggleVenueAvailability = async (req, res) => {
  try {
    const { venueName, location } = req.body;
    if (!venueName || !location) return res.json({ success: false, message: "venueName and location required" });

    const slot = await AddVenue.findOne({ venueName, location, ownerId: req.user._id });
    if (!slot) return res.json({ success: false, message: "Venue not found" });

    const newStatus = !slot.isActive;
    await AddVenue.updateMany(
      { venueName, location, ownerId: req.user._id },
      { $set: { isActive: newStatus } }
    );

    res.json({ success: true, status: newStatus ? "Available" : "Unavailable" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



