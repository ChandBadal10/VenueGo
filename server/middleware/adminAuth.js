import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const adminProtect = async (req, res, next) => {
    try{
        if(!req.user) {
            let token = req.headers.authorization;
            if(!token) {
                return res.json({success: false, message: "No token"});

            }

            if(token.startsWith("Bearer ")) token = token.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.user = await User.findById(decoded.id).select("-password");
        }

        if(!req.user || req.user.role !== "admin") {
            return res.json({success: false, message: "Admin access only"});
        }

        req.admin = req.user;
        next();
    } catch(error) {
        console.log("adminProtect error:", error.message);
        return res.json({success: false, message: "Unauthorized"});
    }
}