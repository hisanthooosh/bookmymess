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
        }, studentId: {
            type: String,
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
        subscriptionActive: {
            type: Boolean,
            default: false
        },

        subscriptionPlan: {
            type: String,
            default: ""
        },

        subscriptionStartDate: {
            type: Date,
            default: null
        },

        subscriptionEndDate: {
            type: Date,
            default: null
        },

        subscriptionPaymentId: {
            type: String,
            default: ""
        },
        upiId: {

            type: String,

            default: ""

        },
        mealPlan: {
            breakfast: {
                type: Boolean,
                default: true
            },
            lunch: {
                type: Boolean,
                default: true
            },
            dinner: {
                type: Boolean,
                default: true
            }
        },
        upiName: {

            type: String,

            default: ""

        },
        upiId: {
            type: String,
            default: ""
        },

        upiName: {
            type: String,
            default: ""
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

