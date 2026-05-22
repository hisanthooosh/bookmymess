const Menu = require("../models/Menu");

const saveMenu = async (req, res) => {

    try {

        const {
            messId,
            day,
            breakfast,
            lunch,
            dinner
        } = req.body;


        const existing =

            await Menu.findOne({

                messId,
                day

            });


        if (existing) {

            existing.breakfast =
                breakfast;

            existing.lunch =
                lunch;

            existing.dinner =
                dinner;

            await existing.save();

            return res.status(200).json({

                success: true,
                message: "Menu Updated"

            });

        }


        await Menu.create({

            messId,
            day,
            breakfast,
            lunch,
            dinner

        });

        res.status(201).json({

            success: true,
            message: "Menu Saved"

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


const getMenus = async (req, res) => {

    try {

        const menus =

            await Menu.find({

                messId: req.params.id

            });

        res.status(200).json({

            success: true,
            menus

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

const getTodayMenu = async (req, res) => {

    try {

        const days = [

            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"

        ];

        const today =

            days[
            new Date().getDay()
            ];

        console.log(
            "Today:",
            today
        );

        console.log(
            "MessId:",
            req.params.id
        );

        const allMenus =

            await Menu.find({
                messId: req.params.id
            });

        console.log(
            "All Menus:",
            allMenus
        );

        const menu =

            await Menu.findOne({

                messId: req.params.id,
                day: today

            });

        console.log(
            "Matched Menu:",
            menu
        );

        res.status(200).json({

            success: true,
            menu

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

}
module.exports = {
    saveMenu,
    getMenus,
    getTodayMenu
}