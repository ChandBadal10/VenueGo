import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ success: false, message: "Not authorized" });

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1]; // ✅ use let instead of const
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ success: false, message: "Not authorized" });

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    req.user = user; // attach user to request
    next();
  } catch (error) {
    console.log("Protect middleware error:", error.message);
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};
