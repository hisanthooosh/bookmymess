const express = require("express");

const router = express.Router();

const {
    addMess,
    getAllMesses
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

module.exports = router;