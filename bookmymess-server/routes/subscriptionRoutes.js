const express = require("express");

const router = express.Router();

const {
    createOrder,
    verifyPayment
} = require(

    "../controllers/subscriptionController"

);

router.post(

    "/create-order",

    createOrder

);
router.post(
    "/verify-payment",
    verifyPayment
);
module.exports = router;