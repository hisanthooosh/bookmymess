const mongoose = require("mongoose");

const orderHistorySchema = new mongoose.Schema(
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

        transactionId: {
            type: String,
            default: ""
        },

        orderStatus: {
            type: String,
            enum: ["pending", "confirmed"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("OrderHistory", orderHistorySchema);