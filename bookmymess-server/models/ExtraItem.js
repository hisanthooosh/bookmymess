const mongoose =
require("mongoose");

const extraItemSchema =
new mongoose.Schema({

    messId:{
        type:
        mongoose.Schema.Types.ObjectId,

        ref:"Mess"
    },

    day:{
        type:String
    },

    mealType:{
        type:String,

        enum:[

            "breakfast",
            "lunch",
            "dinner"

        ]
    },

    itemName:{
        type:String
    },

    price:{
        type:Number
    }

},
{
timestamps:true
}
);

module.exports=
mongoose.model(

"ExtraItem",

extraItemSchema

);