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
        lunchType: {
            type: String,
            enum: ["veg", "nonveg"],
            default: "veg"
        },


        dinner: {
            type: Boolean,
            default: false
        },
        dinnerType: {
            type: String,
            enum: ["veg", "nonveg"],
            default: "veg"
        },
        tiffinParcel: {
            type: Boolean,
            default: false
        },
        extraItems: [

            {

                itemId: String,

                itemName: String,

                quantity: Number,

                price: Number,

                mealType: String

            }

        ],

        extraTotal: {

            type: Number,

            default: 0

        },

        orderStatus: {

            type: String,

            enum: [

                "pending",
                "confirmed"

            ],

            default: "pending"

        },

        transactionId: {

            type: String,

            default: ""

        },
        paymentHistory: [
            {
                transactionId: String,
                amount: Number,
                status: {
                    type: String,
                    enum: ["pending", "confirmed"],
                    default: "pending"
                },
                items: [
                    {
                        itemId: String,
                        itemName: String,
                        quantity: Number,
                        price: Number,
                        mealType: String
                    }
                ],
                createdAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Booking",
    bookingSchema
);