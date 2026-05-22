import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

function StudentDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );
    const [breakfast, setBreakfast] =
        useState(null);

    const [lunch, setLunch] =
        useState(null);

    const [dinner, setDinner] =
        useState(null);
    const [sidebarOpen, setSidebarOpen] =
        useState(false);
    const [todayMenu, setTodayMenu] =
        useState(null);

    const [bookingSaved, setBookingSaved] =
        useState(false);
    const [isEditing, setIsEditing] =
        useState(true);
    const now = new Date();

    const closeTime = new Date();

    closeTime.setHours(
        21,
        0,
        0,
        0
    );

    const bookingClosed =
        now > closeTime;

    const [activePage, setActivePage] =
        useState("dashboard");

    const [weeklyMenus, setWeeklyMenus] =
        useState([]);
    const [tomorrowMenu, setTomorrowMenu] =
        useState(null);

    const fetchTodayMenu =
        async () => {

            try {

                const res =

                    await API.get(

                        `/menu/today/${user.messId}`

                    );

                setTodayMenu(
                    res.data.menu
                );

            }

            catch (error) {

                console.log(
                    error
                );

            }

        }
    const fetchWeeklyMenus =
        async () => {

            try {

                const res =
                    await API.get(

                        `/menu/${user.messId}`

                    );

                setWeeklyMenus(
                    res.data.menus
                );

            }

            catch (error) {

                console.log(error);

            }

        }
    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/");

    }

    const fetchTomorrowBooking =
        async () => {

            try {

                const res =
                    await API.get(

                        `/booking/tomorrow/${user._id}`

                    );

                if (res.data) {

                    setBreakfast(
                        res.data.breakfast
                    );

                    setLunch(
                        res.data.lunch
                    );

                    setDinner(
                        res.data.dinner
                    );

                    setBookingSaved(
                        true
                    );

                    setIsEditing(
                        false
                    );

                }

            }

            catch (error) {

                console.log(error);

            }

        };
    useEffect(() => {

        fetchTodayMenu();
        fetchWeeklyMenus();

        fetchTomorrowBooking();

    }, []);
    useEffect(() => {

        if (weeklyMenus.length > 0) {

            const tomorrow = new Date(
                Date.now() + 86400000
            );

            const tomorrowDay =
                tomorrow.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "long"
                    }
                );

            const menu =
                weeklyMenus.find(
                    (item) =>
                        item.day === tomorrowDay
                );

            setTomorrowMenu(menu);

        }

    }, [weeklyMenus]);
    const saveBooking =
        async () => {

            try {
                if (

                    breakfast === null ||
                    lunch === null ||
                    dinner === null

                ) {

                    return alert(
                        "Please select all meals"
                    );

                }
                await API.post(
                    "/booking/save",
                    {

                        studentId:
                            user._id,

                        messId:
                            user.messId,

                        breakfast,
                        lunch,
                        dinner

                    }
                );

                setBookingSaved(true);

                setIsEditing(false);
                alert(
                    bookingSaved
                        ?
                        "Booking Updated ✅"
                        :
                        "Booking Saved ✅"
                );

            }

            catch (error) {

                alert(

                    error?.response
                        ?.data?.message
                    ||
                    "Error"

                );

            }

        };

    const endDate =
        new Date(
            user?.studentEndDate
        );

    const remainingDays =
        Math.ceil(

            (
                endDate -
                new Date()
            )

            /

            (
                1000 * 60 * 60 * 24
            )

        );

    const isExpired =
        remainingDays <= 0;
    return (

        <div className="min-h-screen flex bg-slate-100 relative">

            {
                sidebarOpen &&

                <div
                    className="
fixed
inset-0
bg-black/50
z-40
lg:hidden
"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />
            }

            {/* Sidebar */}

            <div className={`

fixed
top-0
left-0
h-screen
w-[280px]
bg-slate-950
text-white
p-6
z-50
duration-300
shadow-2xl
flex
flex-col
justify-between

${sidebarOpen
                    ?
                    "translate-x-0"
                    :
                    "-translate-x-full"
                }

lg:translate-x-0

`}>

                <h1 className="text-3xl font-bold">

                    👨‍🎓 Student

                </h1>

                <p className="mt-2 text-gray-400">

                    {user?.name}

                </p>

                <div className="space-y-4 mt-10">

                    <button
                        className="
w-full
p-4
bg-slate-800
rounded-xl
text-left
"
                        onClick={() => {

                            setActivePage("dashboard");
                            setSidebarOpen(false);

                        }}
                    >
                        🏠 Dashboard
                    </button>

                    <button
                        className="
w-full
p-4
bg-slate-800
rounded-xl
text-left
"
                        onClick={() => {

                            setActivePage("menu");
                            setSidebarOpen(false);

                        }}
                    >

                        🍛 Menu

                    </button>

                    <button
                        className="
w-full
p-4
bg-slate-800
rounded-xl
text-left
"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                    >

                        📋 Meal Booking

                    </button>

                </div>
                <div className="mt-auto pt-6">

                    <button
                        onClick={logout}
                        className="
w-full
p-4
bg-red-500
hover:bg-red-600
rounded-xl
font-semibold
duration-300
"
                    >

                        🚪 Logout

                    </button>

                </div>

            </div>

            {/* Main content */}

            <div className="
flex-1
lg:ml-[280px]
p-4
md:p-8
">

                <div className="
bg-white
rounded-2xl
shadow
p-4
mb-6
flex
justify-between
items-center
">

                    <div className="flex gap-4 items-center">

                        <button
                            className="
lg:hidden
text-3xl
"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                        >

                            ☰

                        </button>

                        <div>

                            <h1 className="font-bold text-2xl">

                                Student Dashboard

                            </h1>

                            <p className="text-gray-500">

                                Welcome {user?.name}

                            </p>

                        </div>

                    </div>

                    <div
                        className="
w-12
h-12
rounded-full
bg-blue-500
text-white
flex
justify-center
items-center
font-bold
"
                    >

                        {user?.name?.charAt(0)}

                    </div>

                </div>
                {
                    activePage === "dashboard" &&

                    <div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">


                        <div className="
bg-purple-500
text-white
p-6
rounded-3xl
space-y-4
">

                            <h2 className="
text-2xl
font-bold
">

                                🎓 Subscription

                            </h2>

                            <p>

                                🆔 Student ID:

                                <b>

                                    {user?.studentId}

                                </b>

                            </p>


                            <div>

                                <span className={`

px-4
py-2
rounded-full
text-sm
font-bold

${isExpired
                                        ?
                                        "bg-red-600"
                                        :
                                        "bg-green-600"
                                    }

`}>

                                    {
                                        isExpired
                                            ?
                                            "🔴 Expired"
                                            :
                                            "🟢 Active"
                                    }

                                </span>

                            </div>


                            <p>

                                📅 Ends:

                                {
                                    endDate.toLocaleDateString()
                                }

                            </p>

                            <p className="
text-3xl
font-bold
">

                                ⏳ {

                                    isExpired
                                        ?
                                        0
                                        :
                                        remainingDays

                                }

                                Days Left

                            </p>

                        </div>

                        <div className="
bg-blue-500
text-white
p-6
rounded-3xl
space-y-3
">

                            <h2 className="text-2xl font-bold">

                                🍛 Today's Menu

                            </h2>

                            <div className="border-b border-white/30 pb-3">

                                <p className="text-lg font-semibold">

                                    📅 {
                                        new Date().toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "long"
                                            }
                                        )
                                    }

                                </p>

                                <p className="text-sm opacity-80">

                                    🗓 {
                                        new Date().toLocaleDateString(
                                            "en-US",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric"
                                            }
                                        )
                                    }

                                </p>

                            </div>

                            <p>

                                🍳 Breakfast:

                                {
                                    todayMenu?.breakfast
                                        ?.join(", ")
                                    ||
                                    "No menu"
                                }

                            </p>

                            <p>

                                🍛 Lunch:

                                {
                                    todayMenu?.lunch
                                        ?.join(", ")
                                    ||
                                    "No menu"
                                }

                            </p>

                            <p>

                                🌙 Dinner:

                                {
                                    todayMenu?.dinner
                                        ?.join(", ")
                                    ||
                                    "No menu"
                                }

                            </p>

                        </div>

                        <div className="
bg-green-500
text-white
p-6
rounded-3xl
space-y-6
">

                            <h2 className="
text-2xl
font-bold
">


                                📋 Tomorrow Meal Booking

                            </h2>

                            <p className="opacity-80">

                                {
                                    new Date(
                                        Date.now() + 86400000
                                    ).toDateString()
                                }

                            </p>


                            {/* Breakfast */}

                            <div>

                                <div className="
bg-white/20
backdrop-blur-md
border
border-white/20
rounded-2xl
p-4
mb-3
shadow-lg
">

                                    <div className="
flex
flex-col
sm:flex-row
sm:items-center
sm:justify-between
gap-2
">

                                        <h3 className="
text-lg
font-bold
text-white
">

                                            🍳 Breakfast

                                        </h3>

                                        <span className="
text-sm
bg-white/20
px-3
py-1
rounded-full
font-medium
break-words
">

                                            {

                                                tomorrowMenu?.breakfast
                                                    ?.join(", ")

                                                || "No Menu"

                                            }

                                        </span>

                                    </div>

                                </div>

                                <div className="
grid
grid-cols-2
gap-3
">

                                    <button

                                        onClick={() => {

                                            if (isEditing) {

                                                setBreakfast(true)

                                            }

                                        }}

                                        className={`

p-4
rounded-xl
font-bold

${breakfast
                                                ?
                                                "bg-green-700"
                                                :
                                                "bg-white text-black"
                                            }

`}

                                    >

                                        ✅ I am Coming

                                    </button>

                                    <button

                                        onClick={() => {

                                            if (isEditing) {

                                                setBreakfast(false)

                                            }

                                        }}

                                        className={`

p-4
rounded-xl
font-bold

${breakfast === false
                                                ?
                                                "bg-red-600"
                                                :
                                                "bg-white text-black"
                                            }

`}

                                    >

                                        ❌ Not Coming

                                    </button>

                                </div>

                            </div>



                            {/* Lunch */}

                            <div>

                                <div className="
bg-white/20
backdrop-blur-md
border
border-white/20
rounded-2xl
p-4
mb-3
shadow-lg
">

                                    <div className="
flex
flex-col
sm:flex-row
sm:items-center
sm:justify-between
gap-2
">

                                        <h3 className="
text-lg
font-bold
text-white
">

                                            🍛 Lunch

                                        </h3>

                                        <span className="
text-sm
bg-white/20
px-3
py-1
rounded-full
font-medium
break-words
">

                                            {

                                                tomorrowMenu?.lunch
                                                    ?.join(", ")

                                                || "No Menu"

                                            }

                                        </span>

                                    </div>

                                </div>

                                <div className="
grid
grid-cols-2
gap-3
">

                                    <button

                                        onClick={() => {

                                            if (isEditing) {

                                                setLunch(true)

                                            }

                                        }}

                                        className={`

p-4
rounded-xl
font-bold

${lunch
                                                ?
                                                "bg-green-700"
                                                :
                                                "bg-white text-black"
                                            }

`}

                                    >

                                        ✅ I am Coming

                                    </button>

                                    <button

                                        onClick={() => {

                                            if (isEditing) {

                                                setLunch(false)

                                            }

                                        }}

                                        className={`

p-4
rounded-xl
font-bold

${lunch === false
                                                ?
                                                "bg-red-600"
                                                :
                                                "bg-white text-black"
                                            }

`}

                                    >

                                        ❌ Not Coming

                                    </button>

                                </div>

                            </div>



                            {/* Dinner */}

                            <div>

                                <div className="
bg-white/20
backdrop-blur-md
border
border-white/20
rounded-2xl
p-4
mb-3
shadow-lg
">

                                    <div className="
flex
flex-col
sm:flex-row
sm:items-center
sm:justify-between
gap-2
">

                                        <h3 className="
text-lg
font-bold
text-white
">

                                            🌙 Dinner

                                        </h3>

                                        <span className="
text-sm
bg-white/20
px-3
py-1
rounded-full
font-medium
break-words
">

                                            {

                                                tomorrowMenu?.dinner
                                                    ?.join(", ")

                                                || "No Menu"

                                            }

                                        </span>

                                    </div>

                                </div>

                                <div className="
grid
grid-cols-2
gap-3
">

                                    <button

                                        onClick={() => {

                                            if (isEditing) {

                                                setDinner(true)

                                            }

                                        }}

                                        className={`

p-4
rounded-xl
font-bold

${dinner
                                                ?
                                                "bg-green-700"
                                                :
                                                "bg-white text-black"
                                            }

`}

                                    >

                                        ✅ I am Coming

                                    </button>

                                    <button

                                        onClick={() => {

                                            if (isEditing) {

                                                setDinner(false)

                                            }

                                        }}

                                        className={`

p-4
rounded-xl
font-bold

${dinner === false
                                                ?
                                                "bg-red-600"
                                                :
                                                "bg-white text-black"
                                            }

`}

                                    >

                                        ❌ Not Coming

                                    </button>

                                </div>

                            </div>

                            {
                                bookingClosed ?

                                    <div className="
bg-red-600
text-white
p-4
rounded-xl
text-center
font-bold
">

                                        🔒 Booking Closed

                                    </div>

                                    :

                                    !bookingSaved ?

                                        <button

                                            onClick={saveBooking}

                                            className="
w-full
bg-blue-600
p-4
rounded-xl
font-bold
"

                                        >

                                            Save Booking

                                        </button>

                                        :

                                        <button

                                            onClick={() => {

                                                setBookingSaved(false);

                                                setIsEditing(true);

                                            }}

                                            className="
w-full
bg-orange-500
p-4
rounded-xl
font-bold
"

                                        >

                                            ✏ Update Booking

                                        </button>

                            }

                            📋 Book Meal

                        </div>


                    </div>
                }
                {
                    activePage === "menu" &&

                    <div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">

                        {
                            weeklyMenus.map((menu) => (

                                <div
                                    key={menu._id}
                                    className="
bg-blue-500
text-white
p-6
rounded-3xl
space-y-3
"
                                >

                                    <h2 className="text-2xl font-bold">

                                        🍛 {menu.day}

                                    </h2>

                                    <p>

                                        🍳 Breakfast:

                                        {
                                            menu.breakfast?.join(", ")
                                        }

                                    </p>

                                    <p>

                                        🍛 Lunch:

                                        {
                                            menu.lunch?.join(", ")
                                        }

                                    </p>

                                    <p>

                                        🌙 Dinner:

                                        {
                                            menu.dinner?.join(", ")
                                        }

                                    </p>

                                </div>

                            ))
                        }

                    </div>
                }

            </div>

        </div>

    )

}


export default StudentDashboard;