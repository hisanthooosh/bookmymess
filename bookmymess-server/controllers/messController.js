const Mess = require("../models/Mess");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const addMess = async (req, res) => {

    try {

        const {
            messName,
            ownerName,
            ownerPhone,
            pin
        } = req.body;


        const existingOwner =
            await User.findOne({
                phone: ownerPhone
            });

        if (existingOwner) {

            return res.status(400).json({

                success: false,
                message: "Phone already exists"

            });

        }


        const hashedPin =
            await bcrypt.hash(
                pin,
                10
            );


        const owner =
            await User.create({

                name: ownerName,
                phone: ownerPhone,
                password: hashedPin,
                role: "owner"

            });


        const mess =
            await Mess.create({

                messName,
                ownerName,
                ownerPhone,
                ownerId: owner._id

            });


        owner.messId = mess._id;

        await owner.save();


        res.status(201).json({

            success: true,
            message: "Mess Added Successfully",
            mess

        });

    }
    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


const getAllMesses = async (req, res) => {

    try {

        const messes =
            await Mess.find()
                .populate(
                    "ownerId",
                    "name phone"
                );

        res.status(200).json({

            success: true,
            messes

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

module.exports = {

    addMess,
    getAllMesses

};