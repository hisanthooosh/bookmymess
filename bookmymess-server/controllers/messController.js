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

        const messesWithStats =
            await Promise.all(

                messes.map(
                    async (mess) => {

                        const totalStudents =
                            await User.countDocuments({
                                messId: mess._id,
                                role: "student"
                            });

                        const activeStudents =
                            await User.countDocuments({
                                messId: mess._id,
                                role: "student",
                                studentEndDate: {
                                    $gt: new Date()
                                }
                            });

                        const inactiveStudents =
                            await User.countDocuments({
                                messId: mess._id,
                                role: "student",
                                studentEndDate: {
                                    $lte: new Date()
                                }
                            });

                        return {

                            ...mess.toObject(),

                            totalStudents,

                            activeStudents,

                            inactiveStudents

                        };

                    }
                )

            );

        res.status(200).json({

            success: true,
            messes: messesWithStats

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
const getDashboardStats = async (req, res) => {

    try {

        const totalMesses =
            await Mess.countDocuments();

        const totalStudents =
            await User.countDocuments({
                role: "student"
            });

        const activeStudents =
            await User.countDocuments({
                role: "student",
                studentEndDate: {
                    $gt: new Date()
                }
            });

        const inactiveStudents =
            await User.countDocuments({
                role: "student",
                studentEndDate: {
                    $lte: new Date()
                }
            });

        res.status(200).json({

            success: true,

            totalMesses,

            totalStudents,

            activeStudents,

            inactiveStudents

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
const updateMess = async (req, res) => {

    try {

        const {
            messName,
            ownerName,
            ownerPhone
        } = req.body;

        const mess =
            await Mess.findById(
                req.params.id
            );

        if (!mess) {

            return res.status(404).json({

                success: false,
                message: "Mess not found"

            });

        }

        mess.messName = messName;
        mess.ownerName = ownerName;
        mess.ownerPhone = ownerPhone;

        await mess.save();

        await User.findByIdAndUpdate(

            mess.ownerId,

            {
                name: ownerName,
                phone: ownerPhone
            }

        );

        res.status(200).json({

            success: true,
            message: "Mess updated successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
const deleteMess = async (req, res) => {

    try {

        const mess =
            await Mess.findById(
                req.params.id
            );

        if (!mess) {

            return res.status(404).json({

                success: false,
                message: "Mess not found"

            });

        }

        await User.findByIdAndDelete(
            mess.ownerId
        );

        await Mess.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({

            success: true,
            message: "Mess deleted successfully"

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
    getAllMesses,
    getDashboardStats,
    updateMess,
    deleteMess

};