import TrainerBooking from "../models/TrainerBooking.js";
import Trainer from "../models/Trainer.js";

// CREATE TRAINER BOOKING
export const createTrainerBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      trainerId,
      trainerName,
      specialization,
      venueName,
      date,
      startTime,
      endTime,
      price,
    } = req.body;

    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Find matching slot
    const slot = trainer.slots.find(
      (s) =>
        s.date === date &&
        s.startTime === startTime &&
        s.endTime === endTime
    );

    if (!slot) {
      return res.status(400).json({
        success: false,
        message: "Slot not found",
      });
    }

    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "Slot already booked",
      });
    }

    // Mark slot as booked
    slot.isBooked = true;
    await trainer.save();

    // Create booking
    await TrainerBooking.create({
      user: userId,
      trainer: trainerId,
      trainerName,
      specialization,
      venueName,
      date,
      startTime,
      endTime,
      price,
    });

    return res.json({
      success: true,
      message: "Trainer session booked successfully",
    });
  } catch (error) {
    console.error("Trainer Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL BOOKINGS (ADMIN)
export const getAllTrainerBookings = async (req, res) => {
  try {
    const bookings = await TrainerBooking.find()
      .populate("user", "name email")
      .populate("trainer", "name venueName specialization");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET TRAINER BOOKINGS (FOR OWNER DASHBOARD)
export const getTrainerBookings = async (req, res) => {
  try {
    // Assuming owner wants bookings for their trainers
    const ownerId = req.user.id;

    // Find all bookings where the trainer belongs to this owner
    const bookings = await TrainerBooking.find()
      .populate({
        path: "trainer",
        match: { owner: ownerId }, // make sure Trainer model has owner field
        select: "name venueName specialization",
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Filter out bookings where trainer does not belong to this owner
    const ownerBookings = bookings.filter((b) => b.trainer);

    res.json({
      success: true,
      bookings: ownerBookings.map((b) => ({
        _id: b._id,
        trainerName: b.trainer?.name || "N/A",
        venueName: b.trainer?.venueName || "N/A",
        specialization: b.trainer?.specialization || "N/A",
        date: b.date,
        startTime: b.startTime,
        endTime: b.endTime,
        price: b.price,
        user: {
          name: b.user?.name,
          email: b.user?.email,
        },
      })),
    });
  } catch (error) {
    console.error("Trainer Bookings Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};