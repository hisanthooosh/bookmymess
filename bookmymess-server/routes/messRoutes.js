const express = require("express");

const router = express.Router();

const {
    addMess,
    getAllMesses,
    getDashboardStats
} = require(
    "../controllers/messController"
);

router.post(
    "/add",
    addMess
);

router.get(
    "/all",
    getAllMesses
);
router.get(
    "/dashboard-stats",
    getDashboardStats
);
module.exports = router;