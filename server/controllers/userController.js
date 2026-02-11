import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../configs/nodeMailer.js";




//Generate JWT Token

const generateToken = (userId) => {
    const payload = {id: userId._id?.toString() || userId.id, role: userId.role || userId.role};// db bata user role
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d" })
};




// Register User

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "fill all the fields" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    // generateToken should accept a user object in your codebase
    const token = generateToken(user);

    // send success response ONCE and return
    return res.json({
      success: true,
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.log("Register User Error:", error);
    return res.json({ success: false, message: error.message });
  }
};





//Login User

export const loginUser = async (req, res) => {
    try{
        const  {email, password} = req.body;
        const user = await User.findOne({email})

        if(!user) {
            return res.json({success: false, message: "User not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials"})
        }

        // const token = generateToken(user._id.toString())
        const token = generateToken(user);
        return res.json({
            success: true,
            token,
            role: user.role,
            user: { id: user._Id, name: user.name, email: user.email, role: user.role}
        })



    } catch(error) {
        console.log(error.message);
        res.json({success: false, message: error.message})


    }
}



//Get user data using Token(JWT)

export const getUserData = async (req, res) => {
    try{
        const {user} = req;
        return res.json({success: true, user});

    } catch(error) {
        console.log(error.message);
        res.json({success: false, message: error.message})

    }
}





// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting your password is ${otp}.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "OTP sent to your email" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



// Reset Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({
            success: false,
            message: "Email, OTP, and new password are required"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.resetOtpExpiredAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpiredAt = 0;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Changed",
            text: `Your password has been changed successfully.`
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// DELETE USER ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id; // from protect middleware

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await User.findByIdAndDelete(userId);

    return res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.log("Delete Account Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};