import Trainer from "../models/Trainer.js";
import imagekit from "../configs/imagekit.js";

// CREATE TRAINER (OWNER ONLY)
export const createTrainer = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, email, phone, experience, specialization, bio } = req.body;

    // Validation
    if (!name || !email || !phone || !experience || !specialization) {
      return res
        .status(400)
        .json({ success: false, message: "Fill all required fields" });
    }

    // Upload image if provided
    let imageUrl = "";
    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer, // multer memory storage
        fileName: `trainer-${Date.now()}`, // unique filename
      });
      imageUrl = result.url;
    }

    // Create trainer
    const trainer = await Trainer.create({
      name,
      email,
      phone,
      experience,
      specialization,
      bio,
      image: imageUrl,
      owner: ownerId,
    });

    return res.json({
      success: true,
      message: "Trainer added successfully",
      trainer,
    });
  } catch (error) {
    console.error("Create Trainer Error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// GET ALL TRAINERS (User dashboard)
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    return res.json({ success: true, trainers });
  } catch (error) {
    console.error("Get All Trainers Error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
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
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// GET SINGLE TRAINER
export const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer)
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });

    return res.json({ success: true, trainer });
  } catch (error) {
    console.error("Get Trainer By ID Error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
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

    if (!trainer)
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });

    return res.json({
      success: true,
      message: "Trainer deleted successfully",
    });
  } catch (error) {
    console.error("Delete Trainer Error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};
