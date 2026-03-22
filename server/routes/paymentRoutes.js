import express from "express";
import { generateSignature } from "../controllers/paymentController.js";


const paymentRouter  = express.Router();

paymentRouter.post("/generate-signature", generateSignature);

export default paymentRouter;