const express = require("express");

const router = express.Router();
const {

    addOwner,

    updatePaymentInfo

} = require("../controllers/ownerController");

router.post(
    "/add",
    addOwner
);
router.put(
    "/payment/:id",
    updatePaymentInfo
);
module.exports = router;