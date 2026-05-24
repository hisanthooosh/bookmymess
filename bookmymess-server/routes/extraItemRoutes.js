const express =
    require(
        "express"
    );

const router =
    express.Router();

const {

    saveExtraItem,

    getExtraItems,

    updateExtraItem,

    deleteExtraItem

} = require(

    "../controllers/extraItemController"

);

router.post(
    "/save",
    saveExtraItem
);
router.put(

    "/update/:id",

    updateExtraItem

);

router.delete(

    "/delete/:id",

    deleteExtraItem

);
router.get(
    "/:id",
    getExtraItems
);

module.exports =
    router;