const express = require("express");

const router = express.Router();

const {
    saveMenu,
    getMenus,
    getTodayMenu
} = require(
    "../controllers/menuController"
);

router.post(
    "/save",
    saveMenu
);

router.get(
    "/today/:id",
    getTodayMenu
);

router.get(
    "/:id",
    getMenus
);

module.exports = router;