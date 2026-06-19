const mongoose = require("mongoose");

const menuSchema =
    new mongoose.Schema({

        messId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mess"
        },

        day: {
            type: String,
            enum: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ]
        },

        breakfast: [String],

        lunch: [String],

        dinner: [String],
        nonVegMeals: {
            type: [String],
            default: []
        }

    },
        {
            timestamps: true
        }
    );

module.exports =
    mongoose.model(
        "Menu",
        menuSchema
    );