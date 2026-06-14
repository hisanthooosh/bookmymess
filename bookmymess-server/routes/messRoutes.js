const express = require("express");

const router = express.Router();

const {
    addMess,
    getAllMesses,
    getDashboardStats,
    updateMess,
    deleteMess
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
router.put(
    "/update/:id",
    updateMess
);
router.delete(
    "/delete/:id",
    deleteMess
);
module.exports = router;