import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async(req, res, next) => {
    try{
    const token = req.headers.authorization;
    if(!token) {
        return res.json({success: false, message:"Not authorized"})
    }

    if (token.startsWith("Bearer ")) token = token.split( " " )[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded?.id) {
        return res.json({success: false, message: "Not authorized"});
    }

    req.user = await User.findById(decoded.id).select("-password");
    if(!req.user) {
        return res.json({success: false, message: "User not found"})
    }

    next();


    // try{
    //     const userId = jwt.decode(token, process.env.JWT_SECRET);

    //     if(!userId) {
    //         return res.json({success: false, message:"not authorized"})
    //     }

    //     req.user = await User.findById(userId).select("-password")
    //     next();


    } catch(error) {
         return res.json({success: false, message:"not authorized"})
    }
};