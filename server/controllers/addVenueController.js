import AddVenue from "../models/AddVenue.js";

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
      description
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
      return res.json({
        success: false,
        message: "All fields are required"
      });
    }

    const venue = await AddVenue.create({
      ownerId: req.user._id,
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
      message: "Venue added successfully",
      venue
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message
    });
  }
};
