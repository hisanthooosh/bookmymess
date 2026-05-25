const express = require("express");

const router =
    express.Router();

const {

    saveBooking,
    getStudentBookings,
    getTomorrowBooking,
    getOwnerStats,
    getStudentAttendance,
    getExtraOrders,
    confirmOrder,
    getTodayExtraSummary

}

    = require(
        "../controllers/bookingController"
    );
router.get(

    "/extra-orders/:messId",

    getExtraOrders

);
router.get(

    "/extra-summary/:messId",

    getTodayExtraSummary

);
router.put(

    "/confirm-order/:id",

    confirmOrder

);
router.get(

    "/extra-orders/:messId",

    getExtraOrders

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