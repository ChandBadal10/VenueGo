import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../configs/multer.js";
import {
  createTrainer,
  getOwnerTrainers,
  getAllTrainers,
  getTrainerById,
  deleteTrainer,
} from "../controllers/trainerController.js";

const router = express.Router();

// OWNER CREATE TRAINER WITH IMAGE
router.post("/create", protect, upload.single("image"), createTrainer);

// OWNER VIEW HIS TRAINERS
router.get("/owner", protect, getOwnerTrainers);

// USERS VIEW ALL TRAINERS
router.get("/all", getAllTrainers);

// GET SINGLE TRAINER
router.get("/:id", getTrainerById);

// DELETE TRAINER
router.delete("/:id", protect, deleteTrainer);

export default router;
