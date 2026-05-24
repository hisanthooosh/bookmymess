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
                        `/booking/tomorrow/${user.studentId}`
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

        fetchExtraItems();

        fetchPaymentInfo();

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

                if (

                    totalAmount > 0

                    &&

                    !paid

                ) {

                    return alert(
                        "Please complete payment"
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
                        dinner,

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