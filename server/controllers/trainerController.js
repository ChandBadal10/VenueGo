import Trainer from "../models/Trainer.js";
import imagekit from "../configs/imagekit.js";

// CREATE TRAINER (OWNER ONLY)
export const createTrainer = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const {
      name,
      email,
      phone,
      experience,
      specialization,
      bio,
      venueName,
      slotDate,
      startTime,
      endTime,
      price,
    } = req.body;

    if (
      !name || !email || !phone || !experience || !specialization ||
      !venueName || !slotDate || !startTime || !endTime || !price
    ) {
      return res.status(400).json({ success: false, message: "Fill all required fields" });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ success: false, message: "Start time must be before end time" });
    }

    // Upload image if provided
    let imageUrl = "";
    if (req.file && req.file.buffer) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: `trainer-${Date.now()}`,
      });
      imageUrl = result.url;
    }

    // Check if trainer with same name + email + venue exists for this owner
    const existingTrainer = await Trainer.findOne({ name, email, venueName, owner: ownerId });

    if (existingTrainer) {
      // Append new slot
      existingTrainer.slots.push({
        date: slotDate,
        startTime,
        endTime,
        price: Number(price),
        isBooked: false,
      });

      // Update image only if new image uploaded
      if (imageUrl) existingTrainer.image = imageUrl;

      await existingTrainer.save();

      return res.json({
        success: true,
        message: "Slot added to existing trainer",
        trainer: existingTrainer,
      });
    }

    // Create new trainer if not exists
    const trainer = await Trainer.create({
      name,
      email,
      phone,
      experience,
      specialization,
      bio,
      image: imageUrl,
      venueName,
      owner: ownerId,
      slots: [
        { date: slotDate, startTime, endTime, price: Number(price), isBooked: false }
      ],
    });

    return res.json({ success: true, message: "Trainer added successfully", trainer });

  } catch (error) {
    console.error("Create Trainer Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// GET ALL TRAINERS (User dashboard)
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    return res.json({ success: true, trainers });
  } catch (error) {
    console.error("Get All Trainers Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET OWNER TRAINERS (Owner dashboard)
export const getOwnerTrainers = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const trainers = await Trainer.find({ owner: ownerId }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, trainers });
  } catch (error) {
    console.error("Get Owner Trainers Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE TRAINER
export const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }
    return res.json({ success: true, trainer });
  } catch (error) {
    console.error("Get Trainer By ID Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// DELETE TRAINER (Owner only)
export const deleteTrainer = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const trainerId = req.params.id;

    const trainer = await Trainer.findOneAndDelete({
      _id: trainerId,
      owner: ownerId,
    });

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    return res.json({ success: true, message: "Trainer deleted successfully" });
  } catch (error) {
    console.error("Delete Trainer Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};