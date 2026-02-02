import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/auth.js";

const router = express.Router();


//Step1 redirect to google login

router.get("/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account"
  })
);


router.get("/google/callback",

    passport.authenticate("google", {session:false}),
    (req,res) => {
        try{
            const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

            res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`)
        } catch(error) {
            console.log("Google login error: ", error)
            res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`)

        }
    }
)

router.get("/me", protect, (req, res) => {
    res.json({success: true, user:req.user})
} )

export default router;