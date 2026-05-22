const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true
        },

        messId: {
            type: String,
            required: true
        },

        bookingDate: {
            type: Date,
            required: true
        },

        breakfast: {
            type: Boolean,
            default: false
        },

        lunch: {
            type: Boolean,
            default: false
        },

        dinner: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Booking",
    bookingSchema
);