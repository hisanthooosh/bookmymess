const express = require("express");

const router = express.Router();
const {

    addOwner,

    updatePaymentInfo,

    getPaymentInfo

} = require("../controllers/ownerController");

router.post(
    "/add",
    addOwner
);
router.put(
    "/payment/:id",
    updatePaymentInfo
);
router.get(

    "/payment/:messId",

    getPaymentInfo

);
module.exports = router;