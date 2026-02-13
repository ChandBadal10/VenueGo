import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createTrainer,
  getOwnerTrainers,
  getAllTrainers,
  getTrainerById,
  deleteTrainer,
} from "../controllers/trainerController.js";

const trainerRouter = express.Router();

// OWNER CREATE
trainerRouter.post("/create", protect, createTrainer);

// OWNER VIEW HIS TRAINERS
trainerRouter.get("/owner", protect, getOwnerTrainers);

// USERS VIEW ALL
trainerRouter.get("/all", getAllTrainers);

// GET SINGLE
trainerRouter.get("/:id", getTrainerById);

// DELETE
trainerRouter.delete("/:id", protect, deleteTrainer);

export default trainerRouter;
