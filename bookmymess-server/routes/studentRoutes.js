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
            const totalStudents =

                await User.countDocuments({

                    messId,
                    role: "student"

                });

            // create student ID
            const studentId =

                `STU-${String(
                    totalStudents + 1
                ).padStart(3, "0")}`;

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
module.exports = router;