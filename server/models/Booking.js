import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    venueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true
    },

    date: {
        type: String,
        required: true
    },

    slot: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    // status: {
    //     type: String,
    //     enum: ["pending", "confirmed", "cancelled"],
    //     default: "pending"
    // }
}, {timestamps: true}
);


const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;