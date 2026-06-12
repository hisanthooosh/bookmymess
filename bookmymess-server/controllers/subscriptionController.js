const crypto = require("crypto");
const User = require("../models/User");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({

    key_id:
        process.env.RAZORPAY_KEY_ID,

    key_secret:
        process.env.RAZORPAY_KEY_SECRET

});

const createOrder = async (req, res) => {

    try {

        const { plan } = req.body;

        const plans = {

            "1_month": 10,

            "3_months": 30,

            "6_months": 60,

            "12_months": 120

        };

        const amount = plans[plan];

        if (!amount) {

            return res.status(400).json({

                success: false,

                message: "Invalid Plan"

            });

        }

        const order =

            await razorpay.orders.create({

                amount: amount * 100,

                currency: "INR",

                receipt:
                    `sub_${Date.now()}`

            });

        res.json({

            success: true,

            order,

            key:
                process.env.RAZORPAY_KEY_ID

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
const verifyPayment = async (req, res) => {

    try {

        const {

            userId,
            plan,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature

        } = req.body;

        const body =

            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature =

            crypto
                .createHmac(
                    "sha256",
                    process.env
                        .RAZORPAY_KEY_SECRET
                )
                .update(body)
                .digest("hex");

        if (
            expectedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid Signature"

            });

        }

        const user =
            await User.findById(
                userId
            );

        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }

        const startDate =
            new Date();

        const endDate =
            new Date();

        if (
            plan === "1_month"
        ) {

            endDate.setMonth(
                endDate.getMonth() + 1
            );

        }
        else if (
            plan === "3_months"
        ) {

            endDate.setMonth(
                endDate.getMonth() + 3
            );

        }
        else if (
            plan === "6_months"
        ) {

            endDate.setMonth(
                endDate.getMonth() + 6
            );

        }
        else if (
            plan === "12_months"
        ) {

            endDate.setMonth(
                endDate.getMonth() + 12
            );

        }

        user.subscriptionActive =
            true;

        user.subscriptionPlan =
            plan;

        user.subscriptionStartDate =
            startDate;

        user.subscriptionEndDate =
            endDate;

        user.subscriptionPaymentId =
            razorpay_payment_id;

        await user.save();

        res.json({

            success: true,

            message:
                "Subscription Activated"

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};
module.exports = {

    createOrder,

    verifyPayment

};