import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import { toast }
    from "react-toastify";

function StudentDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );
    const mealPlan = user?.mealPlan || {
        breakfast: true,
        lunch: true,
        dinner: true
    };
    const [breakfast, setBreakfast] =
        useState(null);

    const [lunch, setLunch] =
        useState(null);

    const [dinner, setDinner] =
        useState(null);
    const [lunchType, setLunchType] =
        useState("");

    const [dinnerType, setDinnerType] =
        useState("");
    const [tiffinParcel, setTiffinParcel] = useState(false);
    const [sidebarOpen, setSidebarOpen] =
        useState(false);
    const [todayMenu, setTodayMenu] =
        useState(null);
    const [paymentInfo,
        setPaymentInfo] =
        useState(null);
    const [transactionId,
        setTransactionId] =
        useState("");

    const [paid,
        setPaid] =
        useState(false);

    const [bookingSaved, setBookingSaved] =
        useState(false);
    const [isEditing, setIsEditing] =
        useState(true);
    const now = new Date();
    const [extraItems,
        setExtraItems] =
        useState([]);

    const [selectedExtras,
        setSelectedExtras] =
        useState([]);
    const [orderStatus, setOrderStatus] =
        useState("");
    const [confirmedExtraItems,
        setConfirmedExtraItems] =
        useState([]);
    const [todayExtraItems,
        setTodayExtraItems] =
        useState([]);
    const [orderHistory, setOrderHistory] =
        useState([]);
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
    const fetchExtraItems =
        async () => {

            try {

                const res =

                    await API.get(

                        `/extra-item/${user.messId}`

                    );

                setExtraItems(
                    res.data
                );

            }

            catch (error) {

                console.log(
                    error
                );

            }

        }

    const fetchPaymentInfo =
        async () => {

            try {

                const res =

                    await API.get(

                        `/owner/payment/${user.messId}`

                    );

                setPaymentInfo(
                    res.data
                );

            }

            catch (error) {

                console.log(
                    error
                );

            }

        }
    const tomorrowDay =
        new Date(
            Date.now() + 86400000
        )
            .toLocaleDateString(
                "en-US",
                {
                    weekday: "long"
                }
            );

    const filteredExtraItems =

        extraItems.filter(

            item =>

                item.day === tomorrowDay

        );
    const fetchTomorrowBooking =
        async () => {

            try {

                const res =
                    await API.get(
                        `/booking/tomorrow/${user.studentId}/${user.messId}`
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
                    setLunchType(
                        res.data.lunchType || ""
                    );

                    setDinnerType(
                        res.data.dinnerType || ""
                    );
                    setTiffinParcel(
                        res.data.tiffinParcel || false
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
    const fetchOrderStatus = async () => {
        try {

            const res = await API.get(
                `/booking/status/${user.studentId}/${user.messId}`
            );

            if (res.data.booking) {

                setOrderStatus(
                    res.data.booking.orderStatus
                );

                if (
                    res.data.booking.orderStatus ===
                    "confirmed"
                ) {

                    setConfirmedExtraItems(
                        res.data.booking.extraItems || []
                    );

                }

            }

        } catch (error) {
            console.log(error);
        }
    };
    const fetchTodayExtraItems = async () => {

        try {

            const res = await API.get(

                `/booking/today-extra-items/${user.studentId}/${user.messId}`

            );

            setTodayExtraItems(
                res.data.extraItems || []
            );

        }

        catch (error) {

            console.log(error);

        }

    };
    const fetchOrderHistory = async () => {
        try {
            const res =
                await API.get(
                    `/booking/history/${user.studentId}/${user.messId}`
                );

            setOrderHistory(res.data);

        } catch (error) {

            console.log(error);

        }
    };
    useEffect(() => {

        fetchTodayMenu();

        fetchWeeklyMenus();

        fetchTomorrowBooking();

        fetchExtraItems();

        fetchPaymentInfo();
        fetchOrderStatus();
        fetchTodayExtraItems();
        fetchOrderHistory();

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

                    (mealPlan.breakfast && breakfast === null) ||

                    (mealPlan.lunch && lunch === null && !tiffinParcel) ||

                    (mealPlan.dinner && dinner === null)

                ) {

                    return alert(
                        "Please select all available meals"
                    );

                }

                if (

                    totalAmount > 0

                    &&

                    !paid

                ) {

                    return alert(
                        "Please complete payment"
                    );

                }
                if (
                    lunch === true &&
                    tomorrowMenu?.nonVegMeals?.includes("lunch") &&
                    !lunchType
                ) {
                    return alert(
                        "Please select Lunch Type"
                    );
                }

                if (
                    dinner === true &&
                    tomorrowMenu?.nonVegMeals?.includes("dinner") &&
                    !dinnerType
                ) {
                    return alert(
                        "Please select Dinner Type"
                    );
                }
                await API.post(

                    "/booking/save",

                    {

                        studentId:
                            user.studentId,

                        messId:
                            user.messId,

                        breakfast,
                        lunch,
                        lunchType,

                        dinner,
                        dinnerType,
                        tiffinParcel,

                        extraItems:
                            selectedExtras,

                        extraTotal:
                            totalAmount,

                        transactionId

                    }

                );

                setBookingSaved(
                    true
                );

                setIsEditing(
                    false
                );
                setSelectedExtras([]);
                setTransactionId("");
                setPaid(false);

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
    const handleExtraSelect =
        (item, change) => {

            const exists =

                selectedExtras.find(

                    x => x._id === item._id

                );

            if (exists) {

                const updated =

                    selectedExtras
                        .map(x => {

                            if (x._id === item._id) {

                                return {

                                    ...x,

                                    quantity:
                                        x.quantity + change

                                };

                            }

                            return x;

                        })

                        .filter(

                            x => x.quantity > 0

                        );

                setSelectedExtras(
                    updated
                );

            }

            else if (change > 0) {

                setSelectedExtras([

                    ...selectedExtras,

                    {

                        ...item,

                        quantity: 1

                    }

                ]);

            }

        }
    const totalAmount =

        selectedExtras.reduce(

            (total, item) =>

                total +

                (item.price *

                    item.quantity),

            0

        );
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

    const appEndDate =
        user?.subscriptionEndDate
            ? new Date(user.subscriptionEndDate)
            : null;

    const appStartDate =
        user?.subscriptionStartDate
            ? new Date(user.subscriptionStartDate)
            : null;

    const appRemainingDays =
        appEndDate
            ? Math.max(
                0,
                Math.ceil(
                    (appEndDate - new Date()) /
                    (1000 * 60 * 60 * 24)
                )
            )
            : 0;
    useEffect(() => {

        if (!user) {

            navigate("/");
            return;

        }

        const today = new Date();

        const hasSubscription =

            user.subscriptionActive &&

            user.subscriptionEndDate &&

            new Date(
                user.subscriptionEndDate
            ) > today;

        if (!hasSubscription) {

            navigate("/");

        }

    }, []);

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
                        onClick={() => {

                            setActivePage("history");
                            setSidebarOpen(false);

                        }}
                    >
                        📜 Order History
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
                            {
                                todayExtraItems.length > 0 && (

                                    <div
                                        className="
bg-white/20
rounded-xl
p-4
mt-4
"
                                    >

                                        <h3
                                            className="
text-lg
font-bold
mb-3
"
                                        >
                                            🍗 Today's Extra Items
                                        </h3>

                                        {
                                            todayExtraItems.map(
                                                (item, index) => (

                                                    <div
                                                        key={index}
                                                        className="
flex
justify-between
items-center
border-b
border-white/20
py-2
"
                                                    >

                                                        <div>

                                                            <p className="font-semibold">
                                                                {item.itemName}
                                                            </p>

                                                            <p className="text-sm opacity-80">
                                                                🍽 {item.mealType}
                                                            </p>

                                                        </div>

                                                        <span className="font-bold">
                                                            × {item.quantity}
                                                        </span>

                                                    </div>

                                                )
                                            )
                                        }

                                    </div>

                                )
                            }
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

                                {
                                    !mealPlan.breakfast ?

                                        <div className="
    bg-gray-700
    text-white
    p-4
    rounded-xl
    text-center
    font-bold
    ">
                                            🔒 Breakfast Not Included In Your Plan
                                        </div>

                                        :

                                        <div className="
    grid
    grid-cols-2
    gap-3
    ">

                                            <button
                                                onClick={() => {
                                                    if (isEditing && mealPlan.breakfast) {
                                                        setBreakfast(true);
                                                    }
                                                }}
                                                className={`
    p-4
    rounded-xl
    font-bold
    ${breakfast ? "bg-green-700" : "bg-white text-black"}
    `}
                                            >
                                                ✅ I am Coming
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (isEditing && mealPlan.breakfast) {
                                                        setBreakfast(false);
                                                    }
                                                }}
                                                className={`
    p-4
    rounded-xl
    font-bold
    ${breakfast === false ? "bg-red-600" : "bg-white text-black"}
    `}
                                            >
                                                ❌ Not Coming
                                            </button>
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => {
                                                        if (isEditing && mealPlan.breakfast) {

                                                            const newValue = !tiffinParcel;

                                                            setTiffinParcel(newValue);

                                                            if (newValue) {
                                                                setLunch(false);
                                                            }
                                                        }
                                                    }}
                                                    className={`
p-4
rounded-xl
font-bold
w-full
${tiffinParcel
                                                            ? "bg-yellow-500 text-white"
                                                            : "bg-white text-black"}
`}
                                                >
                                                    📦 Take Extra Tiffin For Lunch
                                                </button>
                                            </div>
                                        </div>
                                }

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

                                {
                                    !mealPlan.lunch ?

                                        <div className="
    bg-gray-700
    text-white
    p-4
    rounded-xl
    text-center
    font-bold
    ">
                                            🔒 Lunch Not Included In Your Plan
                                        </div>

                                        :

                                        <div className="
    grid
    grid-cols-2
    gap-3
    ">
                                            {
                                                tiffinParcel &&

                                                <div className="
bg-yellow-500
text-white
p-4
rounded-xl
text-center
font-bold
mb-3
">
                                                    📦 Lunch Locked - Extra Tiffin Taken
                                                </div>
                                            }
                                            <button

                                                disabled={!mealPlan.lunch || tiffinParcel}

                                                onClick={() => {

                                                    if (
                                                        isEditing &&
                                                        mealPlan.lunch
                                                    ) {

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
                                                disabled={!mealPlan.lunch || tiffinParcel}




                                                onClick={() => {

                                                    if (
                                                        isEditing &&
                                                        mealPlan.lunch
                                                    ) {

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

                                }
                                {
                                    lunch === true &&
                                    tomorrowMenu?.nonVegMeals?.includes("lunch") && (

                                        <div className="
        mt-4
        bg-white
        text-black
        p-4
        rounded-xl
        ">

                                            <p className="font-bold mb-3">
                                                🍛 Select Lunch Type
                                            </p>

                                            <div className="flex gap-4">

                                                <button
                                                    onClick={() =>
                                                        setLunchType("veg")
                                                    }
                                                    className={`
                    px-4
                    py-2
                    rounded-xl
                    font-bold

                    ${lunchType === "veg"
                                                            ? "bg-green-600 text-white"
                                                            : "bg-gray-200"}
                    `}
                                                >
                                                    🥗 Veg
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setLunchType("nonveg")
                                                    }
                                                    className={`
                    px-4
                    py-2
                    rounded-xl
                    font-bold

                    ${lunchType === "nonveg"
                                                            ? "bg-red-600 text-white"
                                                            : "bg-gray-200"}
                    `}
                                                >
                                                    🍗 Non-Veg
                                                </button>

                                            </div>

                                        </div>

                                    )
                                }
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

                                {
                                    !mealPlan.dinner ?

                                        <div className="
    bg-gray-700
    text-white
    p-4
    rounded-xl
    text-center
    font-bold
    ">
                                            🔒 Dinner Not Included In Your Plan
                                        </div>

                                        :

                                        <div className="
    grid
    grid-cols-2
    gap-3
    ">

                                            <button
                                                onClick={() => {
                                                    if (isEditing && mealPlan.dinner) {
                                                        setDinner(true);
                                                    }
                                                }}
                                                className={`
    p-4
    rounded-xl
    font-bold
    ${dinner ? "bg-green-700" : "bg-white text-black"}
    `}
                                            >
                                                ✅ I am Coming
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (isEditing && mealPlan.dinner) {
                                                        setDinner(false);
                                                    }
                                                }}
                                                className={`
    p-4
    rounded-xl
    font-bold
    ${dinner === false ? "bg-red-600" : "bg-white text-black"}
    `}
                                            >
                                                ❌ Not Coming
                                            </button>

                                        </div>

                                }
                                {
                                    dinner === true &&
                                    tomorrowMenu?.nonVegMeals?.includes("dinner") && (

                                        <div className="
        mt-4
        bg-white
        text-black
        p-4
        rounded-xl
        ">

                                            <p className="font-bold mb-3">
                                                🌙 Select Dinner Type
                                            </p>

                                            <div className="flex gap-4">

                                                <button
                                                    onClick={() =>
                                                        setDinnerType("veg")
                                                    }
                                                    className={`
                    px-4
                    py-2
                    rounded-xl
                    font-bold

                    ${dinnerType === "veg"
                                                            ? "bg-green-600 text-white"
                                                            : "bg-gray-200"}
                    `}
                                                >
                                                    🥗 Veg
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        setDinnerType("nonveg")
                                                    }
                                                    className={`
                    px-4
                    py-2
                    rounded-xl
                    font-bold

                    ${dinnerType === "nonveg"
                                                            ? "bg-red-600 text-white"
                                                            : "bg-gray-200"}
                    `}
                                                >
                                                    🍗 Non-Veg
                                                </button>

                                            </div>

                                        </div>

                                    )
                                }


                            </div>
                            <div
                                className="
bg-white/20
rounded-2xl
p-4
space-y-4
"
                            >

                                <h3
                                    className="
text-xl
font-bold
"
                                >

                                    🍗 Extra Items

                                </h3>

                                {

                                    extraItems.length === 0

                                        ?

                                        <p>

                                            No extra items

                                        </p>

                                        :

                                        filteredExtraItems.map(

                                            item => (

                                                <div

                                                    key={item._id}

                                                    className="
bg-white
text-black
p-4
rounded-xl
flex
justify-between
items-center
"

                                                >

                                                    <div>

                                                        <p
                                                            className="
font-bold
"
                                                        >

                                                            {item.itemName}

                                                        </p>

                                                        <p>

                                                            ₹{item.price}

                                                        </p>

                                                        <div
                                                            className="
text-sm
text-gray-500
space-y-1
"
                                                        >

                                                            <p>

                                                                📅 {item.day}

                                                            </p>

                                                            <p>

                                                                🍽 {item.mealType}

                                                            </p>

                                                        </div>

                                                    </div>

                                                    <div
                                                        className="
flex
gap-2
items-center
"
                                                    >

                                                        <button

                                                            onClick={() =>

                                                                handleExtraSelect(
                                                                    item,
                                                                    -1
                                                                )

                                                            }

                                                            className="
bg-red-500
text-white
px-3
py-2
rounded
"

                                                        >

                                                            -

                                                        </button>

                                                        <span>

                                                            {

                                                                selectedExtras.find(

                                                                    x => x._id === item._id

                                                                )?.quantity

                                                                ||

                                                                0

                                                            }

                                                        </span>

                                                        <button

                                                            onClick={() =>

                                                                handleExtraSelect(
                                                                    item,
                                                                    1
                                                                )

                                                            }

                                                            className="
bg-green-500
text-white
px-3
py-2
rounded
"

                                                        >

                                                            +

                                                        </button>

                                                    </div>
                                                </div>

                                            )

                                        )

                                }

                                <div
                                    className="
text-xl
font-bold
text-white
"
                                >

                                    Total Extra:

                                    ₹{totalAmount}

                                </div>
                                {orderStatus && (
                                    <div className="bg-white text-black rounded-xl p-4 mt-4">
                                        <h3 className="text-lg font-bold mb-2">
                                            📦 Extra Order Status
                                        </h3>

                                        <p className="font-bold">
                                            {orderStatus === "confirmed"
                                                ? "✅ Order Confirmed"
                                                : "⏳ Order Pending"}
                                        </p>
                                    </div>
                                )}
                                {
                                    orderStatus === "confirmed" &&
                                    confirmedExtraItems.length > 0 && (

                                        <div
                                            className="
bg-white
text-black
rounded-xl
p-4
mt-4
"
                                        >

                                            <h3
                                                className="
text-lg
font-bold
mb-3
"
                                            >
                                                🍗 Confirmed Extra Items
                                            </h3>

                                            {
                                                confirmedExtraItems.map(
                                                    (item, index) => (

                                                        <div
                                                            key={index}
                                                            className="
flex
justify-between
border-b
py-2
"
                                                        >

                                                            <div>

                                                                <p className="font-semibold">
                                                                    {item.itemName}
                                                                </p>

                                                                <p className="text-xs text-gray-500">
                                                                    🍽 {item.mealType}
                                                                </p>

                                                            </div>

                                                            <span>
                                                                × {item.quantity}
                                                            </span>

                                                        </div>

                                                    )
                                                )
                                            }

                                        </div>

                                    )
                                }
                            </div>
                            {
                                totalAmount > 0

                                &&

                                <div
                                    className="
bg-white/20
rounded-2xl
p-4
space-y-4
"
                                >

                                    <h3
                                        className="
text-xl
font-bold
"
                                    >

                                        💳 Payment

                                    </h3>

                                    <p>

                                        UPI Name:

                                        <b>

                                            {paymentInfo?.upiName}

                                        </b>

                                    </p>

                                    <p>

                                        UPI ID:

                                        <b>

                                            {paymentInfo?.upiId}

                                        </b>

                                    </p>

                                    <p>

                                        Amount:

                                        <b>

                                            ₹{totalAmount}

                                        </b>

                                    </p>

                                    <input

                                        type="text"

                                        placeholder="Enter Transaction ID"

                                        value={transactionId}

                                        onChange={(e) =>

                                            setTransactionId(
                                                e.target.value
                                            )

                                        }

                                        className="
w-full
p-4
border
rounded-xl
text-black
"

                                    />
                                    {transactionId && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await navigator.clipboard.writeText(transactionId);
                                                    alert("✅ UTR Copied Successfully");
                                                } catch (error) {
                                                    alert("❌ Copy failed");
                                                }
                                            }}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                        >
                                            📋 Copy UTR
                                        </button>
                                    )}

                                    <button

                                        onClick={() => {

                                            if (
                                                !transactionId.trim()
                                            ) {

                                                return toast.error(
                                                    "Enter transaction ID"
                                                );

                                            }

                                            setPaid(true);

                                            toast.success(
                                                "Payment marked ✅"
                                            );

                                        }}

                                        className={`

w-full
p-3
rounded-xl
font-bold
text-white

${paid

                                                ?

                                                "bg-blue-600"

                                                :

                                                "bg-green-600"

                                            }

`}

                                    >

                                        {

                                            paid

                                                ?

                                                "✅ Payment Completed"

                                                :

                                                "💳 I Paid"

                                        }

                                    </button>

                                </div>

                            }
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

                        </div>
                        <div className="
bg-slate-900
text-white
p-6
rounded-3xl
space-y-4
">

                            <h2 className="
    text-2xl
    font-bold
    ">
                                📱 BookMyMess Subscription
                            </h2>

                            <p>
                                📦 Plan:
                                <b>
                                    {" "}
                                    {user?.subscriptionPlan || "No Plan"}
                                </b>
                            </p>

                            <p>
                                🚀 Start Date:
                                <b>
                                    {" "}
                                    {
                                        appStartDate
                                            ? appStartDate.toLocaleDateString()
                                            : "-"
                                    }
                                </b>
                            </p>

                            <p>
                                📅 End Date:
                                <b>
                                    {" "}
                                    {
                                        appEndDate
                                            ? appEndDate.toLocaleDateString()
                                            : "-"
                                    }
                                </b>
                            </p>

                            <div>

                                <span className={`
px-4
py-2
rounded-full
text-sm
font-bold

${appRemainingDays > 0
                                        ? "bg-green-600"
                                        : "bg-red-600"}
`}>
                                    {
                                        appRemainingDays > 0
                                            ? "🟢 Active"
                                            : "🔴 Expired"
                                    }
                                </span>

                            </div>

                            <p className="
    text-3xl
    font-bold
    ">
                                ⏳ {appRemainingDays} Days Left
                            </p>

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
                {
                    activePage === "history" &&

                    <div className="bg-white p-6 rounded-3xl">

                        <h1 className="text-2xl font-bold mb-6">
                            📜 Order History
                        </h1>

                        {orderHistory.length === 0 ? (

                            <p>No Orders Found</p>

                        ) : (

                            orderHistory.map((order) => (

                                <div
                                    key={order._id}
                                    className="bg-slate-100 p-4 rounded-xl mb-4"
                                >

                                    <p>
                                        📅 Date:
                                        <b>
                                            {new Date(order.createdAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit"
                                            })}
                                        </b>
                                    </p>

                                    <p>
                                        💰 Amount:
                                        <b>
                                            ₹{order.extraTotal}
                                        </b>
                                    </p>

                                    <p>
                                        💳 UTR:
                                        <b>
                                            {order.transactionId || "Not Provided"}
                                        </b>
                                    </p>

                                    <p>
                                        Status:
                                        <b>
                                            {
                                                order.orderStatus === "confirmed"
                                                    ? " ✅ Confirmed"
                                                    : " ⏳ Pending"
                                            }
                                        </b>
                                    </p>

                                </div>

                            ))

                        )}

                    </div>
                }

            </div>

        </div>

    )

}


export default StudentDashboard;