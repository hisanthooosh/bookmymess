const Mess = require("../models/Mess");

const addMess = async (req, res) => {

    try {

        const {
            messName,
            ownerName,
            ownerPhone,
            address
        } = req.body;

        const mess = await Mess.create({

            messName,
            ownerName,
            ownerPhone,
            address

        });

        res.status(201).json({

            success: true,
            message: "Mess Added Successfully",
            mess

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


const getAllMesses = async (req, res) => {

    try {

        const messes =
            await Mess.find();

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