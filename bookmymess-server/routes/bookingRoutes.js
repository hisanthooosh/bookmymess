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
    confirmPayment,
    getOrderHistory,
    getTodayExtraSummary,
    getLatestOrderStatus

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
router.put(
    "/confirm-payment/:bookingId/:paymentIndex",
    confirmPayment
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
router.get(
    "/status/:studentId",
    getLatestOrderStatus
);
router.get(
    "/history/:studentId",
    getOrderHistory
);
module.exports =
    router;