import Venue from "../models/Venue.js";
import multer from "multer";
import path from "path";
import AddVenue from "../models/AddVenue.js";

//  Multer Storage

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



// Register Venue

export const registerVenue = async (req, res) => {
    try {
        const { venueName, category, phone, email, location, description } = req.body;

        if (!venueName || !category || !phone || !email || !location || !description) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        if (!req.file) {
            return res.json({ success: false, message: "Venue Image is required" });
        }

        const venue = await Venue.create({ ownerId: req.user._id, venueName, category, phone, email, location, description, image: req.file.path, status: "pending"});

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

// Delete Venue
export const deleteVenueGroup = async (req, res) => {
    try {
    const { venueName, location } = req.body;

    await AddVenue.deleteMany({
      venueName: new RegExp(`^${venueName}$`, "i"),
      location: new RegExp(`^${location}$`, "i")
    });

    res.json({ success: true, message: "Venue deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Toggle Availability

export const toggleVenueAvailability = async (req, res) => {
  try {
    const { venueName, location } = req.body;

    if (!venueName || !location) {
      return res.json({
        success: false,
        message: "venueName and location required"
      });
    }

    // Read current state
    const slot = await AddVenue.findOne({
      venueName,
      location,
      ownerId: req.user._id
    });

    if (!slot) {
      return res.json({
        success: false,
        message: "Venue not found"
      });
    }

    const newStatus = !slot.isActive;

    // Toggle ALL slots of that venue
    await AddVenue.updateMany(
      {
        venueName,
        location,
        ownerId: req.user._id
      },
      {
        $set: { isActive: newStatus }
      }
    );

    res.json({
      success: true,
      status: newStatus ? "Available" : "Unavailable"
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};