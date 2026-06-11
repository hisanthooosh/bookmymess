const express = require("express");

const router = express.Router();

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
    getTomorrowExtraSummary,
    getLatestOrderStatus
} = require("../controllers/bookingController");

router.get(
    "/extra-orders/:messId",
    getExtraOrders
);

router.get(
    "/extra-summary/:messId",
    getTodayExtraSummary
);
router.get(
    "/tomorrow-extra-summary/:messId",
    getTomorrowExtraSummary
);
router.put(
    "/confirm-order/:id",
    confirmOrder
);

router.put(
    "/confirm-payment/:bookingId/:paymentIndex",
    confirmPayment
);

router.post(
    "/save",
    saveBooking
);

router.get(
    "/tomorrow/:studentId/:messId",
    getTomorrowBooking
);

router.get(
    "/student/:studentId/:messId",
    getStudentBookings
);

router.get(
    "/stats/:messId",
    getOwnerStats
);

router.get(
    "/attendance/:studentId/:messId",
    getStudentAttendance
);

router.get(
    "/status/:studentId/:messId",
    getLatestOrderStatus
);

router.get(
    "/history/:studentId/:messId",
    getOrderHistory
);

module.exports = router;