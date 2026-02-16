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

const addTrainerRouter = express.Router();

// OWNER CREATE TRAINER WITH IMAGE
addTrainerRouter.post("/create", protect, upload.single("image"), createTrainer);

// OWNER VIEW HIS TRAINERS
addTrainerRouter.get("/owner", protect, getOwnerTrainers);

// USERS VIEW ALL TRAINERS
addTrainerRouter.get("/all", getAllTrainers);

// GET SINGLE TRAINER
addTrainerRouter.get("/:id", getTrainerById);

// DELETE TRAINER
addTrainerRouter.delete("/:id", protect, deleteTrainer);

export default addTrainerRouter;
