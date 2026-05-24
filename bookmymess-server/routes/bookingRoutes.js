const express = require("express");

const router =
    express.Router();

const {

    saveBooking,
    getStudentBookings,
    getTomorrowBooking,
    getOwnerStats,
    getStudentAttendance

}

    = require(
        "../controllers/bookingController"
    );


router.post(
    "/save",
    saveBooking
);
router.get(
    "/tomorrow/:studentId",
    getTomorrowBooking
);
router.get(
    "/student/:studentId",
    getStudentBookings
);
router.get(
    "/stats/:messId",
    getOwnerStats
);
router.get(

    "/attendance/:studentId",

    getStudentAttendance

);
module.exports =
    router;