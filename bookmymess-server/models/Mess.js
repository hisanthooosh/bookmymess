const mongoose=require("mongoose");

const messSchema=
new mongoose.Schema({

    messName:{
        type:String,
        required:true
    },

    ownerName:{
        type:String,
        required:true
    },

    ownerPhone:{
        type:String,
        required:true
    },

    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},
{
    timestamps:true
});

module.exports=
mongoose.model(
    "Mess",
    messSchema
);