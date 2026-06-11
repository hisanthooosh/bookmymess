const Booking = require("../models/Booking");
const OrderHistory = require("../models/OrderHistory");
const saveBooking = async (req, res) => {

    try {

        const {
            studentId,
            messId,
            breakfast,
            lunch,
            dinner,
            tiffinParcel,
            extraItems = [],
            extraTotal = 0,
            transactionId = ""
        } = req.body;
        const cleanExtraItems = (extraItems || []).map((item) => ({
            itemId: item.itemId || item._id,
            itemName: item.itemName,
            quantity: Number(item.quantity || 0),
            price: Number(item.price || 0),
            mealType: item.mealType
        }));

        const mergeSameItems = (items) => {
            const map = {};

            items.forEach((item) => {
                const key = `${item.itemName}-${item.mealType}`;

                if (!map[key]) {
                    map[key] = { ...item };
                } else {
                    map[key].quantity += Number(item.quantity || 0);
                }
            });

            return Object.values(map);
        };

        const newPaymentItems = mergeSameItems(cleanExtraItems);
        if (Number(extraTotal) > 0 && transactionId?.trim()) {

            const usedTransaction =
                await Booking.findOne({

                    messId,

                    "paymentHistory.transactionId":
                        transactionId.trim()

                });

            if (usedTransaction) {

                return res.status(400).json({

                    message:
                        "This UTR is already used"

                });

            }

        }

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
                messId,
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
            existingBooking.tiffinParcel = tiffinParcel;
            const cleanExtraItems = (extraItems || []).map((item) => ({
                itemId: item.itemId || item._id,
                itemName: item.itemName,
                quantity: Number(item.quantity || 0),
                price: Number(item.price || 0),
                mealType: item.mealType
            }));
            const mergedItems = [...(existingBooking.extraItems || [])];

            newPaymentItems.forEach((newItem) => {
                const oldItem = mergedItems.find(
                    (item) =>
                        String(item.itemId) === String(newItem.itemId) &&
                        item.mealType === newItem.mealType
                );

                if (oldItem) {
                    oldItem.quantity =
                        Number(oldItem.quantity || 0) +
                        Number(newItem.quantity || 0);
                } else {
                    mergedItems.push({
                        ...newItem,
                        quantity: Number(newItem.quantity || 0)
                    });
                }
            });

            existingBooking.extraItems = mergedItems;

            existingBooking.extraTotal =
                mergedItems.reduce(
                    (total, item) =>
                        total + Number(item.price || 0) * Number(item.quantity || 0),
                    0
                );

            existingBooking.paymentHistory =
                existingBooking.paymentHistory || [];

            existingBooking.paymentHistory.push({
                transactionId: transactionId || "",
                amount: Number(extraTotal) || 0,
                status: "pending",
                items: newPaymentItems
            });

            await OrderHistory.create({
                studentId,
                messId,
                bookingDate: existingBooking.bookingDate,
                extraItems: newPaymentItems,
                extraTotal: Number(extraTotal) || 0,
                transactionId: transactionId || "",
                orderStatus: "pending"
            });

            existingBooking.orderStatus = "pending";

            existingBooking.transactionId =
                transactionId || "";
            existingBooking.orderStatus = "pending";
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
                tiffinParcel,


                extraItems:
                    extraItems || [],

                extraTotal:
                    Number(extraTotal) || 0,

                transactionId:
                    transactionId || "",

                paymentHistory:
                    Number(extraTotal) > 0
                        ? [
                            {
                                transactionId: transactionId || "",
                                amount: Number(extraTotal) || 0,
                                status: "pending",
                                items: extraItems || []
                            }
                        ]
                        : []
            });
        await OrderHistory.create({
            studentId,
            messId,
            bookingDate: tomorrow,
            extraItems: extraItems || [],
            extraTotal: Number(extraTotal) || 0,
            transactionId: transactionId || "",
            orderStatus: "pending"
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
                        req.params.studentId,

                    messId:
                        req.params.messId

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

                messId:
                    req.params.messId,

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
                        req.params.studentId,

                    messId:
                        req.params.messId

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

                    messId:
                        req.params.messId,

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
                    booking?.dinner,

                extraItems:
                    booking?.extraItems || [],
                tiffinParcel: booking?.tiffinParcel || false,

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
            /* parcel counts */

            const breakfastParcel =

                bookings.filter(
                    item => item.breakfastParcel === true
                ).length;

            const lunchParcel =

                bookings.filter(
                    item =>
                        item.lunchParcel === true ||
                        item.tiffinParcel === true
                ).length;

            const dinnerParcel =

                bookings.filter(
                    item => item.dinnerParcel === true
                ).length;
            const todayBreakfastParcel =
                todayBookings.filter(
                    item => item.breakfastParcel === true
                ).length;

            const todayLunchParcel =
                todayBookings.filter(
                    item =>
                        item.lunchParcel === true ||
                        item.tiffinParcel === true
                ).length;

            const todayDinnerParcel =
                todayBookings.filter(
                    item => item.dinnerParcel === true
                ).length;
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

                todayBreakfastParcel,
                todayLunchParcel,
                todayDinnerParcel,

                breakfastParcel,
                lunchParcel,
                dinnerParcel,

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
                        $addFields: {
                            statusPriority: {
                                $cond: [
                                    { $eq: ["$orderStatus", "pending"] },
                                    0,
                                    1
                                ]
                            }
                        }
                    },
                    {
                        $sort: {
                            statusPriority: 1,
                            updatedAt: -1
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
const confirmOrder = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        booking.orderStatus = "confirmed";

        booking.paymentHistory = (booking.paymentHistory || []).map(
            (payment) => {
                payment.status = "confirmed";
                return payment;
            }
        );

        await booking.save();

        res.json({
            success: true,
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getTodayExtraSummary =
    async (req, res) => {

        try {

            const today =
                new Date();

            today.setHours(
                0, 0, 0, 0
            );

            const todayEnd =
                new Date(today);

            todayEnd.setHours(
                23, 59, 59, 999
            );

            const bookings =

                await Booking.find({

                    messId: req.params.messId,

                    orderStatus: "confirmed",

                    bookingDate: {

                        $gte: today,
                        $lte: todayEnd

                    }

                });

            const summary = {

                breakfast: {},
                lunch: {},
                dinner: {}

            };

            bookings.forEach(

                booking => {

                    booking.extraItems.forEach(

                        item => {

                            if (

                                !summary[
                                item.mealType
                                ][
                                item.itemName
                                ]

                            ) {

                                summary[
                                    item.mealType
                                ][
                                    item.itemName
                                ] = 0;

                            }

                            summary[
                                item.mealType
                            ][
                                item.itemName
                            ] +=
                                item.quantity;

                        }

                    );

                }

            );

            res.json(
                summary
            );

        }

        catch (error) {

            res.status(500)
                .json({

                    message:
                        error.message

                });

        }

    };

const getTomorrowExtraSummary =
    async (req, res) => {

        try {

            const tomorrow =
                new Date();

            tomorrow.setDate(
                tomorrow.getDate() + 1
            );

            tomorrow.setHours(
                0, 0, 0, 0
            );

            const tomorrowEnd =
                new Date(tomorrow);

            tomorrowEnd.setHours(
                23, 59, 59, 999
            );

            const bookings =

                await Booking.find({

                    messId: req.params.messId,

                    orderStatus: "confirmed",

                    bookingDate: {

                        $gte: tomorrow,
                        $lte: tomorrowEnd

                    }

                });

            const summary = {

                breakfast: {},
                lunch: {},
                dinner: {}

            };

            bookings.forEach(

                booking => {

                    booking.extraItems.forEach(

                        item => {

                            if (

                                !summary[
                                item.mealType
                                ][
                                item.itemName
                                ]

                            ) {

                                summary[
                                    item.mealType
                                ][
                                    item.itemName
                                ] = 0;

                            }

                            summary[
                                item.mealType
                            ][
                                item.itemName
                            ] +=
                                item.quantity;

                        }

                    );

                }

            );

            res.json(
                summary
            );

        }

        catch (error) {

            res.status(500)
                .json({

                    message:
                        error.message

                });

        }

    };
const getLatestOrderStatus = async (req, res) => {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const tomorrowEnd = new Date(tomorrow);
        tomorrowEnd.setHours(23, 59, 59, 999);

        const booking = await Booking.findOne({
            studentId: req.params.studentId,
            messId: req.params.messId,
            extraTotal: { $gt: 0 },
            bookingDate: {
                $gte: tomorrow,
                $lte: tomorrowEnd
            }
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            booking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const confirmPayment = async (req, res) => {
    try {
        const { bookingId, paymentIndex } = req.params;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (!booking.paymentHistory[paymentIndex]) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        booking.paymentHistory[paymentIndex].status = "confirmed";
        const confirmedTransactionId =
            booking.paymentHistory[paymentIndex].transactionId?.trim();

        await OrderHistory.updateMany(
            {
                studentId: booking.studentId,
                transactionId: confirmedTransactionId
            },
            {
                orderStatus: "confirmed"
            }
        );

        const allConfirmed = booking.paymentHistory.every(
            (payment) => payment.status === "confirmed"
        );

        booking.orderStatus = allConfirmed ? "confirmed" : "pending";

        await booking.save();

        res.json({
            success: true,
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
const getOrderHistory = async (req, res) => {
    try {
        const history = await OrderHistory.find({
            studentId: req.params.studentId,
            messId: req.params.messId
        }).sort({
            createdAt: -1
        });

        res.json(history);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
module.exports = {

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
    getLatestOrderStatus,
    getTomorrowExtraSummary
}