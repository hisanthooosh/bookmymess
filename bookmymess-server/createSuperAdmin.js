const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>{

    console.log("MongoDB Connected");

})
.catch((error)=>{

    console.log(error);

});

const createAdmin=async()=>{

    try{

        const hashedPassword=
        await bcrypt.hash(
            "123456",
            10
        );

        const adminExists=
        await User.findOne({
            phone:"9999999999"
        });

        if(adminExists){

            console.log(
                "Super Admin already exists"
            );

            process.exit();
        }

        const admin=
        await User.create({

            name:"Super Admin",

            phone:"9999999999",

            password:hashedPassword,

            role:"superadmin"

        });

        console.log(
            "Admin Created:"
        );

        console.log(admin);

        process.exit();

    }
    catch(error){

        console.log(
            error.message
        );

        process.exit();
    }

}

createAdmin();