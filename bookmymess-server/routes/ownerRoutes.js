const express = require("express");

const router = express.Router();

const {
    addOwner
} = require("../controllers/ownerController");

router.post(
    "/add",
    addOwner
);

module.exports = router;