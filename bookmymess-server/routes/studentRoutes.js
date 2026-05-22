const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const User = require("../models/User");

router.post(
    "/add",
    async (req, res) => {

        try {

            const {
                name,
                phone,
                password,
                messId,
                startDate,
                endDate
            } = req.body;

            // check existing phone
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

            // count students only in same mess
            const students =

                await User.find({

                    messId,
                    role: "student"

                })
                    .select("studentId");

            const usedNumbers =

                students.map(student => {

                    return parseInt(

                        student.studentId
                            ?.replace(
                                "STU-",
                                ""
                            )

                    ) || 0;

                });

            let nextNumber = 1;

            while (

                usedNumbers.includes(
                    nextNumber
                )

            ) {

                nextNumber++;

            }

            const studentId =

                `STU-${String(
                    nextNumber
                ).padStart(
                    3,
                    "0"
                )}`;
            // create student ID
            

            // hash password
            const hashedPassword =

                await bcrypt.hash(
                    password,
                    10
                );

            // create student
            const student =

                await User.create({

                    name,
                    phone,
                    password: hashedPassword,
                    messId,
                    studentId,
                    role: "student",

                    studentStartDate: startDate,
                    studentEndDate: endDate

                });

            res.status(201).json({

                success: true,
                message:
                    "Student Created Successfully",

                student

            });

        }

        catch (error) {

            console.log(error);

            res.status(500).json({

                success: false,
                message:
                    "Error creating student"

            });

        }

    }
);
router.get(
    "/:messId",
    async (req, res) => {

        try {

            const students =

                await User.find({

                    messId: req.params.messId,
                    role: "student"

                }).select("-password");

            res.status(200).json({

                success: true,
                students

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,
                message: "Failed to fetch students"

            });

        }

    }
);
router.put(
    "/update/:id",
    async (req, res) => {

        try {

            const {
                name,
                phone,
                studentStartDate,
                studentEndDate
            } = req.body;

            const student =

                await User.findByIdAndUpdate(

                    req.params.id,

                    {
                        name,
                        phone,
                        studentStartDate,
                        studentEndDate
                    },

                    {
                        new: true
                    }

                );

            res.status(200).json({

                success: true,
                student

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,
                message: "Failed to update student"

            });

        }

    }
);
router.delete(
    "/delete/:id",
    async (req, res) => {

        try {

            await User.findByIdAndDelete(
                req.params.id
            );

            res.status(200).json({

                success: true,
                message: "Student deleted successfully"

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,
                message: "Failed to delete student"

            });

        }

    }

);
router.put(
    "/reactivate/:id",
    async (req, res) => {

        try {

            const {
                studentStartDate,
                studentEndDate
            } = req.body;

            const student =

                await User.findByIdAndUpdate(

                    req.params.id,

                    {
                        studentStartDate,
                        studentEndDate
                    },

                    {
                        new: true
                    }

                );

            res.status(200).json({

                success: true,
                message: "Student reactivated successfully",
                student

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,
                message: "Failed to reactivate student"

            });

        }

    }
);
module.exports = router;