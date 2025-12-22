import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["owner", "user", "admin"],
        default: "user"
    },
    image: {
        type: String,
        default: ""
    },
    verifyOtp: {
        type: String,
        default: ""
    },
    verifyOtpExpiredAt: {
        type: Number,
        default: 0,
    },

    resetOtp: {
        type: String,
        default: "",

    },
    resetOtpExpiredAt: {
        type: Number,
        default: 0
    }

}, {timestamps: true})


const User = mongoose.models.User || mongoose.model("User", userSchema)


export default User;