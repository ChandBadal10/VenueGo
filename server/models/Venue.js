import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        venueName: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        image: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        isAvailable: {
        type: Boolean,
        default: true
}

    },
    {timestamps: true}
);


const Venue = mongoose.models.Venue || mongoose.model("Venue", venueSchema);


export default Venue;