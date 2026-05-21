const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: [
                "superadmin",
                "owner",
                "student"
            ],
            default: "student"
        },

        messId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mess",
            default: null
        },
        studentStartDate: {
            type: Date,
            default: null
        },

        studentEndDate: {
            type: Date,
            default: null
        },

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "User",
    userSchema
);

