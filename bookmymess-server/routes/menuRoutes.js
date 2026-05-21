const express = require("express");

const router = express.Router();

const {

    saveMenu,
    getMenus

} = require(
    "../controllers/menuController"
);

router.post(
    "/save",
    saveMenu
);

router.get(
    "/:id",
    getMenus
);

module.exports = router;