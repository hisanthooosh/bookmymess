const User = require("../models/User");
const bcrypt = require("bcryptjs");

const addOwner = async (req, res) => {

    try {

        const {
            name,
            phone,
            password,
            messId
        } = req.body;

        const existingUser =
            await User.findOne({
                phone
            });

        if (existingUser) {

            return res.status(400).json({

                success: false,
                message: "Phone already exists"

            });

        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        const owner =
            await User.create({

                name,
                phone,
                password: hashedPassword,
                role: "owner",
                messId

            });

        res.status(201).json({

            success: true,
            message: "Owner Created Successfully",
            owner

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
const updatePaymentInfo =
    async (req, res) => {

        try {

            const {

                upiId,
                upiName

            } = req.body;

            const owner =
                await User.findByIdAndUpdate(

                    req.params.id,

                    {

                        upiId,
                        upiName

                    },

                    {
                        new: true
                    }

                );

            res.status(200).json({

                success: true,

                message:
                    "Payment info updated",

                owner

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

    addOwner,

    updatePaymentInfo

};