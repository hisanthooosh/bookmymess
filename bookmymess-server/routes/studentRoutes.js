const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const User = require("../models/User");
const Booking =
    require("../models/Booking");

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

router.get(
    "/expiry-stats/:messId",

    async (req, res) => {

        try {

            const today =
                new Date();

            today.setHours(
                0, 0, 0, 0
            );

            const tomorrow =
                new Date(today);

            tomorrow.setDate(
                tomorrow.getDate() + 1
            );

            const next7Days =
                new Date(today);

            next7Days.setDate(
                next7Days.getDate() + 7
            );


            const students =
                await User.find({

                    messId: req.params.messId,
                    role: "student"

                });


            const endingToday =

                students.filter(student => {

                    const end =
                        new Date(
                            student.studentEndDate
                        );

                    end.setHours(
                        0, 0, 0, 0
                    );

                    return end.getTime()
                        ===
                        today.getTime();

                }).length;


            const endingTomorrow =

                students.filter(student => {

                    const end =
                        new Date(
                            student.studentEndDate
                        );

                    end.setHours(
                        0, 0, 0, 0
                    );

                    return end.getTime()
                        ===
                        tomorrow.getTime();

                }).length;


            const ending7Days =

                students.filter(student => {

                    const end =
                        new Date(
                            student.studentEndDate
                        );

                    return (
                        end >= today
                        &&
                        end <= next7Days
                    );

                }).length;


            res.json({

                endingToday,
                endingTomorrow,
                ending7Days

            });

        }

        catch (error) {

            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);

router.get(
    "/attendance-list/:messId",

    async (req, res) => {

        try {

            const students =
                await User.find({

                    messId: req.params.messId,
                    role: "student"

                }).select("-password");


            /* tomorrow attendance */

            const tomorrow =
                new Date();

            tomorrow.setDate(
                tomorrow.getDate() + 1
            );

            tomorrow.setHours(
                0,
                0,
                0,
                0
            );


            const tomorrowEnd =
                new Date(tomorrow);

            tomorrowEnd.setHours(
                23,
                59,
                59,
                999
            );


            const data =
                await Promise.all(

                    students.map(
                        async (student) => {

                            const today =
                                new Date();

                            today.setHours(
                                0,
                                0,
                                0,
                                0
                            );

                            const todayEnd =
                                new Date(today);

                            todayEnd.setHours(
                                23,
                                59,
                                59,
                                999
                            );

                            const booking =
                                await Booking.findOne({

                                    studentId:
                                        student.studentId,

                                    messId:
                                        req.params.messId,

                                    bookingDate: {

                                        $gte: today,
                                        $lte: todayEnd
                                    }

                                });




                            const remainingDays =
                                Math.max(

                                    0,

                                    Math.ceil(

                                        (

                                            new Date(
                                                student.studentEndDate
                                            )

                                            -

                                            new Date()

                                        )

                                        /

                                        (
                                            1000 *
                                            60 *
                                            60 *
                                            24
                                        )

                                    )

                                );


                            return {

                                ...student.toObject(),

                                remainingDays,

                                breakfast:
                                    booking?.breakfast,

                                lunch:
                                    booking?.lunch,

                                dinner:
                                    booking?.dinner,

                                extraItems:
                                    booking?.extraItems || []

                            };

                        }
                    )
                );


            res.json(data);

        }

        catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    }
);
module.exports = router;