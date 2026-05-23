const Booking = require("../models/Booking");

const saveBooking = async (req, res) => {

    try {

        const {

            studentId,
            messId,
            breakfast,
            lunch,
            dinner

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
                dinner

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

            const bookings =
                await Booking.find({

                    messId,
                    bookingDate:
                        tomorrow

                });


            const todayBookings =
                await Booking.find({

                    messId,
                    bookingDate:
                        today

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
module.exports = {

    saveBooking,
    getStudentBookings,
    getTomorrowBooking,
    getOwnerStats

};