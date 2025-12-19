// controllers/venueController.js
import Venue from "../models/Venue.js";
import multer from "multer";
import path from "path";


// ------------------ Multer Storage ------------------ //

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/venues/");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + "_" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
        );
    }
});

export const upload = multer({ storage });



// ------------------ Register Venue ------------------ //

export const registerVenue = async (req, res) => {
    try {
        const { venueName, category, phone, email, location, description } = req.body;

        if (!venueName || !category || !phone || !email || !location || !description) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        if (!req.file) {
            return res.json({ success: false, message: "Venue Image is required" });
        }

        const venue = await Venue.create({
            ownerId: req.user._id,
            venueName,
            category,
            phone,
            email,
            location,
            description,
            image: req.file.path,
            status: "pending"
        });

        return res.json({
            success: true,
            message: "Venue registration submitted, waiting for admin approval.",
            venue
        });

    } catch (error) {
        console.log("Venue Register Error:", error.message);
        return res.json({ success: false, message: error.message });
    }
};









// ------------------ Admin Approve Venue ------------------ //

// export const approveVenue = async (req, res) => {
//     try {
//         const { venueId } = req.body;

//         const venue = await Venue.findById(venueId);

//         if (!venue) {
//             return res.json({ success: false, message: "Venue not found" });
//         }

//         venue.status = "approved";
//         await venue.save();

//         return res.json({
//             success: true,
//             message: "Venue approved successfully"
//         });

//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// };



// ------------------ Admin Reject Venue ------------------ //

// export const rejectVenue = async (req, res) => {
//     try {
//         const { venueId } = req.body;

//         const venue = await Venue.findById(venueId);

//         if (!venue) {
//             return res.json({ success: false, message: "Venue not found" });
//         }

//         venue.status = "rejected";
//         await venue.save();

//         return res.json({
//             success: true,
//             message: "Venue rejected successfully"
//         });

//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// };



// ------------------ Check Venue Status ------------------ //

export const checkVenueStatus = async (req, res) => {
    try {
        const venue = await Venue.findOne({ ownerId: req.user._id });

        if (!venue) {
            return res.json({ exists: false });
        }

        return res.json({
            exists: true,
            status: venue.status
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
