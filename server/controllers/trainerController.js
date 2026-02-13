import Trainer from "../models/Trainer.js";
import Venue from "../models/Venue.js";

// CREATE TRAINER (OWNER ONLY)
export const createTrainer = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const { name, email, phone, experience, specialization, bio, venueId } =
      req.body;

    if (!name || !email || !phone || !experience || !specialization || !venueId) {
      return res.json({ success: false, message: "Fill all required fields" });
    }

    // Check venue belongs to owner
    const venue = await Venue.findOne({ _id: venueId, owner: ownerId });
    if (!venue) {
      return res.json({
        success: false,
        message: "You can only add trainer to your own venue",
      });
    }

    const trainer = await Trainer.create({
      name,
      email,
      phone,
      experience,
      specialization,
      bio,
      venue: venueId,
      owner: ownerId,
    });

    return res.json({
      success: true,
      message: "Trainer added successfully",
      trainer,
    });
  } catch (error) {
    console.log("Create Trainer Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

// GET ALL TRAINERS (USER SIDE)
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find()
      .populate("venue", "name location")
      .sort({ createdAt: -1 });

    return res.json({ success: true, trainers });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// GET OWNER TRAINERS
export const getOwnerTrainers = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const trainers = await Trainer.find({ owner: ownerId }).populate(
      "venue",
      "name"
    );

    return res.json({ success: true, trainers });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// GET SINGLE TRAINER
export const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate(
      "venue",
      "name location"
    );

    if (!trainer) {
      return res.json({ success: false, message: "Trainer not found" });
    }

    return res.json({ success: true, trainer });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// DELETE TRAINER
export const deleteTrainer = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const ownerId = req.user.id;

    const trainer = await Trainer.findOneAndDelete({
      _id: trainerId,
      owner: ownerId,
    });

    if (!trainer) {
      return res.json({ success: false, message: "Trainer not found" });
    }

    return res.json({
      success: true,
      message: "Trainer deleted successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
