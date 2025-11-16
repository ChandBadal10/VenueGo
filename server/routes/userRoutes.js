import express from "express"
import { getUserData, loginUser, registerUser, resetPassword, sendResetOtp } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserData);


userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword)
export default userRouter;