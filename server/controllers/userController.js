// import mbv from "mailboxvalidator-nodejs";
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

export const registerUser = async (req, res)=> {
    try{

        const {name, email, password, role} = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: "fill all the fields"})
        }

        // const validateEmail = validateEmail(email)

        // if (validateEmail.valid) {

            if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" });
            }

            const userExists = await User.findOne({email});

            if(userExists){
                return res.json({success: false, message: "User already exists"})
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({name, email, password: hashedPassword, role: role || "user"})

            const token = generateToken(user._id.toString())
            res.json({success: true, token, role: user.role, user: {id: user.Id, name: user.name, email: user.email, role: user.role}});

        // }

        res.json({success: false, message: error.message})



    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})

    }

}



// export const validateEmail = async (email) => {

//     // Step 1: Basic regex validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         return { valid: false, reason: "Invalid email format" };
//     }

//     // Step 2: API Validation
//     mbv.MailboxValidator_init(process.env.EMAIL_VALIDATOR_API_KEY);

//     try {
//         const data = await mbv.MailboxValidator_single_query(email);
//         console.log(email);
//         // console.log(data);

//         // Fix: Ensure ALL conditions are checked correctly
//         if (
//             data.is_smtp === true &&  // SMTP check
//             data.is_verified === true && // Verified email
//             data.is_domain === true && // Valid domain
//             data.is_disposable !== true && // Not disposable
//             data.is_high_risk !== true // Not high risk
//         ) {
//             return { valid: true, reason: "Email is valid" };
//         }

//         return { valid: false, reason: "Invalid or risky email" };
//     } catch (error) {
//         return { valid: false, reason: "API error: " + error.message };
//     }
// };


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

        return res.json({
            success: true,
            message: "Password has been reset successfully"
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


