const Booking = require("../models/Booking");

const saveBooking = async (req, res) => {

    try {

        const {

            studentId,
            messId,
            breakfast,
            lunch,
            dinner,

            extraItems = [],

            extraTotal = 0,

            transactionId = ""

        } = req.body;

        /* close time */

        const now = new Date();

        const closeTime = new Date();

        closeTime.setHours(
            21,
            0,
            0,
            0
        );


        /* after 9PM */

        if (now > closeTime) {

            return res.status(400).json({

                message:
                    "Booking Closed"

            });

        }


        /* tomorrow */

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


        /* check booking */

        const existingBooking =
            await Booking.findOne({

                studentId,
                bookingDate: tomorrow

            });


        /* update existing */

        if (existingBooking) {

            existingBooking.breakfast =
                breakfast;

            existingBooking.lunch =
                lunch;

            existingBooking.dinner =
                dinner;

            existingBooking.extraItems =
                extraItems || [];

            existingBooking.extraTotal =
                Number(extraTotal) || 0;

            existingBooking.transactionId =
                transactionId || "";
            await existingBooking.save();

            return res.status(200).json({

                message:
                    "Booking Updated",

                booking:
                    existingBooking

            });

        }


        /* first save */

        const booking =
            await Booking.create({

                studentId,
                messId,

                bookingDate:
                    tomorrow,

                breakfast,
                lunch,
                dinner,

                extraItems:
                    extraItems || [],

                extraTotal:
                    Number(extraTotal) || 0,

                transactionId:
                    transactionId || ""

            });

        res.status(201).json({

            message:
                "Booking Saved",

            booking

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                "Server Error"

        });

    }

};


const getStudentBookings =
    async (req, res) => {

        try {

            const bookings =
                await Booking.find({

                    studentId:
                        req.params.studentId

                })
                    .sort({
                        bookingDate: -1
                    });

            res.json(bookings);

        }

        catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    };

const getTomorrowBooking = async (req, res) => {

    try {

        const tomorrow = new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        tomorrow.setHours(
            0,
            0,
            0,
            0
        );

        const booking =
            await Booking.findOne({

                studentId:
                    req.params.studentId,

                bookingDate:
                    tomorrow

            });

        res.json(
            booking
        );

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message:
                "Server Error"

        });

    }

};
const User =
    require("../models/User");
const getStudentAttendance =
    async (req, res) => {

        try {

            const student =

                await User.findOne({

                    studentId:
                        req.params.studentId

                });

            if (!student) {

                return res.status(404)
                    .json({

                        message:
                            "Student Not Found"

                    });

            }


            /* tomorrow booking */

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

            const booking =

                await Booking.findOne({

                    studentId:
                        req.params.studentId,

                    bookingDate:
                        tomorrow

                });
            const remainingDays =

                Math.ceil(

                    (

                        new Date(
                            student.studentEndDate
                        )

                        -

                        new Date()

                    )

                    /

                    (1000 * 60 * 60 * 24)

                );
            res.json({

                name:
                    student.name,

                studentId:
                    student.studentId,

                phone:
                    student.phone,

                remainingDays,

                breakfast:
                    booking?.breakfast,

                lunch:
                    booking?.lunch,

                dinner:
                    booking?.dinner

            });

        }

        catch (error) {

            console.log(error);

            res.status(500)
                .json({

                    message:
                        "Server Error"

                });

        }

    }
const getOwnerStats =
    async (req, res) => {

        try {

            const messId =
                req.params.messId;


            /* tomorrow */
            /* today */

            const today =
                new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );
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


            /* total students */

            const totalStudents =
                await User.countDocuments({

                    messId,
                    role: "student"

                });


            /* bookings */

            /* tomorrow range */

            const tomorrowEnd =
                new Date(
                    tomorrow
                );

            tomorrowEnd.setHours(
                23,
                59,
                59,
                999
            );


            /* today range */

            const todayEnd =
                new Date(
                    today
                );

            todayEnd.setHours(
                23,
                59,
                59,
                999
            );


            /* bookings */

            const bookings =

                await Booking.find({

                    messId,

                    bookingDate: {

                        $gte: tomorrow,
                        $lte: tomorrowEnd

                    }

                });


            const todayBookings =

                await Booking.find({

                    messId,

                    bookingDate: {

                        $gte: today,
                        $lte: todayEnd

                    }

                });


            /* breakfast */

            const breakfastComing =

                bookings.filter(

                    item =>
                        item.breakfast === true

                ).length;


            const breakfastNotComing =

                bookings.filter(

                    item =>
                        item.breakfast === false

                ).length;


            const breakfastNoResponse =

                totalStudents -

                bookings.length;


            /* lunch */

            const lunchComing =

                bookings.filter(

                    item =>
                        item.lunch === true

                ).length;


            const lunchNotComing =

                bookings.filter(

                    item =>
                        item.lunch === false

                ).length;


            const lunchNoResponse =

                totalStudents -

                bookings.length;


            /* dinner */

            const dinnerComing =

                bookings.filter(

                    item =>
                        item.dinner === true

                ).length;


            const dinnerNotComing =

                bookings.filter(

                    item =>
                        item.dinner === false

                ).length;


            const dinnerNoResponse =

                totalStudents -

                bookings.length;

            /* today breakfast */

            const todayBreakfastComing =

                todayBookings.filter(
                    item => item.breakfast === true
                ).length;

            const todayBreakfastNotComing =

                todayBookings.filter(
                    item => item.breakfast === false
                ).length;

            const todayBreakfastNoResponse =

                totalStudents -
                todayBookings.length;


            /* today lunch */

            const todayLunchComing =

                todayBookings.filter(
                    item => item.lunch === true
                ).length;

            const todayLunchNotComing =

                todayBookings.filter(
                    item => item.lunch === false
                ).length;

            const todayLunchNoResponse =

                totalStudents -
                todayBookings.length;


            /* today dinner */

            const todayDinnerComing =

                todayBookings.filter(
                    item => item.dinner === true
                ).length;

            const todayDinnerNotComing =

                todayBookings.filter(
                    item => item.dinner === false
                ).length;

            const todayDinnerNoResponse =

                totalStudents -
                todayBookings.length;
            res.json({

                tomorrowTotal:
                    bookings.length,

                breakfastComing,
                breakfastNotComing,
                breakfastNoResponse,

                lunchComing,
                lunchNotComing,
                lunchNoResponse,

                dinnerComing,
                dinnerNotComing,
                dinnerNoResponse,
                todayBreakfastComing,
                todayBreakfastNotComing,
                todayBreakfastNoResponse,

                todayLunchComing,
                todayLunchNotComing,
                todayLunchNoResponse,

                todayDinnerComing,
                todayDinnerNotComing,
                todayDinnerNoResponse,

            });

        }

        catch (error) {

            console.log(error);

            res.status(500).json({

                message:
                    "Server Error"

            });

        }

    };
const getExtraOrders =
    async (req, res) => {

        try {

            const orders =

                await Booking.aggregate([

                    {

                        $match: {

                            messId:
                                req.params.messId,

                            extraTotal: {
                                $gt: 0
                            }

                        }

                    },

                    {

                        $lookup: {

                            from: "users",

                            localField:
                                "studentId",

                            foreignField:
                                "studentId",

                            as: "student"

                        }

                    },

                    {

                        $unwind:
                            "$student"

                    },

                    {

                        $sort: {

                            createdAt: -1

                        }

                    }

                ]);

            res.json(
                orders
            );

        }

        catch (error) {

            res.status(500)
                .json({

                    message:
                        error.message

                });

        }

    }
const confirmOrder =
    async (req, res) => {

        try {

            const booking =

                await Booking.findByIdAndUpdate(

                    req.params.id,

                    {

                        orderStatus:
                            "confirmed"

                    },

                    {

                        new: true

                    }

                );

            res.json({

                success: true,

                booking

            });

        }

        catch (error) {

            res.status(500)
                .json({

                    message:
                        error.message

                });

        }

    }
module.exports = {

    saveBooking,

    getStudentBookings,

    getTomorrowBooking,

    getOwnerStats,

    getStudentAttendance,

    getExtraOrders,

    confirmOrder

}