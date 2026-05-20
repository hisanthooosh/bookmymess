const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const login = async(req,res)=>{

    try{

        const {phone,password}=req.body;

        if(!phone || !password){

            return res.status(400).json({
                success:false,
                message:"Please enter all fields"
            });
        }

        const user=await User.findOne({
            phone
        });

        if(!user){

            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }

        const isMatch=await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch){

            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            });
        }

        const token=jwt.sign(
            {
                id:user._id,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );

        res.status(200).json({
            success:true,
            token,
            user
        });

    }
    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

}

module.exports={
    login
}