const express = require("express");

const router =
    express.Router();

const {

    saveBooking,
    getStudentBookings,
    getTomorrowBooking

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


module.exports =
    router;