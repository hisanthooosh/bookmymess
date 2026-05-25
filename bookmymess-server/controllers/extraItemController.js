const ExtraItem =
    require(
        "../models/ExtraItem"
    );

const saveExtraItem =
    async (req, res) => {

        try {

            const item =

                await ExtraItem.create(

                    req.body

                );

            res.status(201)
                .json({

                    success: true,

                    item

                });

        }

        catch (error) {

            res.status(500)
                .json({

                    success: false,

                    message:
                        error.message

                });

        }

    }

const getExtraItems =
    async (req, res) => {

        try {

            const items =

                await ExtraItem.find({

                    messId:
                        req.params.id

                });

            res.json(
                items
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
const updateExtraItem =
    async (req, res) => {

        try {

            const item =

                await ExtraItem.findByIdAndUpdate(

                    req.params.id,

                    req.body,

                    { new: true }

                );

            res.json({

                success: true,

                item

            });

        }

        catch (error) {

            res.status(500)
                .json({

                    message: error.message

                });

        }

    }

const deleteExtraItem =
    async (req, res) => {

        try {

            await ExtraItem.findByIdAndDelete(

                req.params.id

            );

            res.json({

                success: true,

                message:
                    "Deleted"

            });

        }

        catch (error) {

            res.status(500)
                .json({

                    message: error.message

                });

        }

    }
module.exports = {

    saveExtraItem,

    getExtraItems,

    updateExtraItem,

    deleteExtraItem

};