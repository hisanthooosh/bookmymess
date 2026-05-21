import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useEffect } from "react";
import { toast } from "react-toastify";

function OwnerDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [activePage, setActivePage] =
        useState("dashboard");

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.info(
            "Logged out successfully"
        );

        setTimeout(() => {

            navigate("/");

        }, 500);

    }

    const [selectedDay, setSelectedDay] =
        useState("Sunday");

    const [breakfast, setBreakfast] =
        useState([""]);

    const [lunch, setLunch] =
        useState([""]);

    const [dinner, setDinner] =
        useState([""]);

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [savedMenus, setSavedMenus] =
        useState([]);
    const [studentName, setStudentName] =
        useState("");

    const [studentPhone, setStudentPhone] =
        useState("");

    const [studentPassword, setStudentPassword] =
        useState("");
    const addItem = (type) => {

        if (type === "breakfast") {

            setBreakfast([
                ...breakfast,
                ""
            ]);

        }

        if (type === "lunch") {

            setLunch([
                ...lunch,
                ""
            ]);

        }

        if (type === "dinner") {

            setDinner([
                ...dinner,
                ""
            ]);

        }

    }

    useEffect(() => {

        const menu =

            savedMenus.find(

                (item) =>

                    item.day === selectedDay

            );

        if (menu) {

            setBreakfast(
                menu.breakfast
            );

            setLunch(
                menu.lunch
            );

            setDinner(
                menu.dinner
            );

        }

        else {

            setBreakfast([""]);
            setLunch([""]);
            setDinner([""]);

        }

    }, [
        selectedDay,
        savedMenus
    ]);

    const saveMenu = async () => {

        try {

            await API.post(

                "/menu/save",

                {

                    messId: user.messId,

                    day: selectedDay,

                    breakfast:
                        breakfast.filter(
                            item => item.trim()
                        ),

                    lunch:
                        lunch.filter(
                            item => item.trim()
                        ),

                    dinner:
                        dinner.filter(
                            item => item.trim()
                        )

                }

            );

            await fetchMenus();

            toast.success(
                "Menu Saved Successfully 🎉"
            );

        }

        catch (error) {

            toast.error(
                "Failed to save menu ❌"
            );

        }

    }

    const fetchMenus = async () => {

        try {

            const res =

                await API.get(
                    `/menu/${user.messId}`
                );

            setSavedMenus(
                res.data.menus
            );

        }

        catch (error) {

            toast.error(
                "Failed to save menu ❌"
            );

        }

    }

    useEffect(() => {

        fetchMenus();

    }, []);

    const updateItem = (

        type,
        index,
        value

    ) => {

        if (type === "breakfast") {

            const data = [...breakfast];

            data[index] = value;

            setBreakfast(data);

        }

        if (type === "lunch") {

            const data = [...lunch];

            data[index] = value;

            setLunch(data);

        }

        if (type === "dinner") {

            const data = [...dinner];

            data[index] = value;

            setDinner(data);

        }

    }
    const addStudent = async () => {

        try {

            const res =
                await API.post(

                    "/student/add",

                    {

                        name: studentName,
                        phone: studentPhone,
                        password: studentPassword,
                        messId: user.messId

                    }

                );

            toast.success(
                "Student Added Successfully 🎉"
            );

            setStudentName("");
            setStudentPhone("");
            setStudentPassword("");

        }

        catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to add student"

            );

        }

    }
    const removeItem = (

        type,
        index

    ) => {

        if (type === "breakfast") {

            setBreakfast(

                breakfast.filter(
                    (_, i) => i !== index
                )

            );

        }

        if (type === "lunch") {

            setLunch(

                lunch.filter(
                    (_, i) => i !== index
                )

            );

        }

        if (type === "dinner") {

            setDinner(

                dinner.filter(
                    (_, i) => i !== index
                )

            );

        }

    }

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
lg:fixed
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

                {/* Top Section */}

                <div>

                    <h1 className="text-3xl font-bold">

                        🍽 Owner Panel

                    </h1>

                    <p className="text-gray-400 mt-2">

                        {user?.name}

                    </p>

                    <div className="space-y-3 mt-10">

                        <button
                            onClick={() => setActivePage("dashboard")}
                            className="w-full p-4 bg-slate-800 rounded-xl text-left"
                        >

                            🏠 Dashboard

                        </button>

                        <button
                            onClick={() => setActivePage("students")}
                            className="w-full p-4 bg-slate-800 rounded-xl text-left"
                        >

                            👨‍🎓 Students

                        </button>

                        <button
                            onClick={() => setActivePage("menu")}
                            className="w-full p-4 bg-slate-800 rounded-xl text-left"
                        >

                            🍛 Menu

                        </button>

                        <button
                            onClick={() => setActivePage("bookings")}
                            className="w-full p-4 bg-slate-800 rounded-xl text-left"
                        >

                            📋 Meal Bookings

                        </button>

                    </div>

                </div>

                {/* Bottom Logout Button */}

                <div className="pt-6">

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

            {/* Main Content */}

            <div className="
flex-1
lg:ml-[280px]
p-4
md:p-8
overflow-x-hidden
">

                {/* Top Navbar */}

                <div className="
sticky
top-0
bg-white
shadow
rounded-2xl
mb-6
p-4
flex
justify-between
items-center
z-30
">

                    <div className="flex items-center gap-4">

                        <button
                            className="lg:hidden text-3xl"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                        >

                            ☰

                        </button>

                        <div>

                            <h2 className="font-bold text-xl">

                                Owner Dashboard

                            </h2>

                            <p className="text-sm text-gray-500">

                                Welcome {user?.name}

                            </p>

                        </div>

                    </div>

                    {/* Right Profile Section */}

                    <div className="flex items-center gap-3">

                        {/* Desktop Mess Name */}

                        <div className="hidden md:block text-right">

                            <h2 className="font-bold text-lg text-slate-800">

                                {user?.name}

                            </h2>

                            <p className="text-sm text-gray-500">

                                Mess Owner

                            </p>

                        </div>

                        {/* Mobile + Desktop Circle */}

                        <div
                            className="
w-12
h-12
rounded-full
bg-gradient-to-r
from-blue-500
to-purple-600
text-white
flex
justify-center
items-center
font-bold
text-lg
"
                        >

                            {user?.name?.charAt(0).toUpperCase()}

                        </div>

                    </div>

                </div>

                {
                    activePage === "dashboard"

                    &&

                    <h1 className="text-4xl font-bold">

                        Welcome {user?.name}

                    </h1>
                }

                {
                    activePage === "students" &&

                    <div className="bg-white p-6 rounded-3xl">

                        <h1 className="text-2xl font-bold mb-6">

                            👨‍🎓 Student Management

                        </h1>

                        <div className="space-y-4">

                            <input
                                type="text"
                                placeholder="Student Name"
                                value={studentName}
                                onChange={(e) =>
                                    setStudentName(
                                        e.target.value
                                    )}
                                className="w-full p-4 border rounded-xl"
                            />

                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={studentPhone}
                                onChange={(e) =>
                                    setStudentPhone(
                                        e.target.value
                                    )}
                                className="w-full p-4 border rounded-xl"
                            />

                            <input
                                type="password"
                                placeholder="6 Digit Password"
                                value={studentPassword}
                                onChange={(e) =>
                                    setStudentPassword(
                                        e.target.value
                                    )}
                                className="w-full p-4 border rounded-xl"
                            />

                            <button
                                onClick={addStudent}
                                className="
bg-blue-600
text-white
px-6
py-4
rounded-xl
">

                                Add Student

                            </button>

                        </div>

                    </div>
                }

                {
                    activePage === "menu"

                    &&

                    <div className="
bg-white
w-full
max-w-[1800px]
mx-auto
p-4
sm:p-6
lg:p-8
xl:p-10
rounded-[30px]
shadow-lg
">

                        <div className="mb-8">

                            <h1 className="text-2xl md:text-3xl font-bold">

                                🍛 Weekly Menu

                            </h1>

                            <p className="text-gray-500 mt-2">

                                Create and manage weekly menu

                            </p>

                        </div>

<<<<<<< HEAD

                        <div>

                            <label className="font-semibold">

                                Select Day

                            </label>

                            <select
                                value={selectedDay}
                                onChange={(e) =>
                                    setSelectedDay(
                                        e.target.value
                                    )
                                }
                                className="w-full mt-2 p-4 rounded-xl border"
                            >

                                <option>Sunday</option>
                                <option>Monday</option>
                                <option>Tuesday</option>
                                <option>Wednesday</option>
                                <option>Thursday</option>
                                <option>Friday</option>
                                <option>Saturday</option>

                            </select>

                        </div>



                        {
                            [
                                {
                                    title: "🍳 Breakfast",
                                    data: breakfast,
                                    type: "breakfast"
                                },
                                {
                                    title: "🍛 Lunch",
                                    data: lunch,
                                    type: "lunch"
                                },
                                {
                                    title: "🌙 Dinner",
                                    data: dinner,
                                    type: "dinner"
                                }
                            ].map((meal) => (

                                <div
                                    key={meal.type}
                                    className="mt-8 bg-slate-50 p-6 rounded-3xl"
                                >

                                    <div className="
flex
flex-col
sm:flex-row
justify-between
gap-4
items-center
">

                                        <h2 className="font-bold text-xl">

                                            {meal.title}

                                        </h2>

                                        <button
                                            onClick={() =>
                                                addItem(meal.type)
                                            }
                                            className="
w-full
sm:w-auto
bg-blue-600
text-white
px-5
py-3
rounded-xl
"
                                        >

                                            + Add Item

                                        </button>

                                    </div>



                                    <div className="space-y-4 mt-5">

                                        {

                                            meal.data.map((item, index) => (

                                                <div
                                                    key={index}
                                                    className="
flex
flex-col
sm:flex-row
gap-3
"
                                                >

                                                    <input
                                                        type="text"
                                                        placeholder="Enter item"
                                                        value={item}
                                                        onChange={(e) =>

                                                            updateItem(
                                                                meal.type,
                                                                index,
                                                                e.target.value
                                                            )

                                                        }
                                                        className="
flex-1
p-4
border
rounded-xl
"
                                                    />

                                                    <button
                                                        onClick={() =>

                                                            removeItem(
                                                                meal.type,
                                                                index
                                                            )

                                                        }
                                                        className="
w-full
sm:w-auto
bg-red-500
text-white
px-6
rounded-xl
"
                                                    >

                                                        ✕

                                                    </button>

                                                </div>

                                            ))

                                        }

                                    </div>

                                </div>

                            ))

                        }



                        <button

                            onClick={saveMenu}

                            className="
mt-10
w-full
md:w-auto
bg-gradient-to-r
from-blue-600
to-purple-600
text-white
px-10
py-4
rounded-2xl
hover:scale-105
duration-300
"

                        >

                           📋  Save Menu

                        </button>


                        <div className="mt-12">

                            <h1 className="text-2xl font-bold">

                                📋 Saved Menus

                            </h1>

                            <div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
mt-6
">

                                {
                                    savedMenus.length === 0 ?

                                        <div className="col-span-full text-center p-10">

                                            <p className="text-gray-500">

                                                No menu created yet

                                            </p>

                                        </div>

                                        :

                                        savedMenus.map((menu, index) => (

                                            <div
                                                key={index}
                                                className="
bg-slate-100
rounded-3xl
p-6
shadow
"
                                            >

                                                <h2 className="font-bold text-xl">

                                                    {menu.day}

                                                </h2>


                                                <div className="mt-4">

                                                    <p className="font-semibold">
                                                        🍳 Breakfast
                                                    </p>

                                                    {
                                                        menu.breakfast.map((item, i) => (

                                                            <p key={i}>
                                                                • {item}
                                                            </p>

                                                        ))
                                                    }

                                                </div>


                                                <div className="mt-4">

                                                    <p className="font-semibold">
                                                        🍛 Lunch
                                                    </p>

                                                    {
                                                        menu.lunch.map((item, i) => (

                                                            <p key={i}>
                                                                • {item}
                                                            </p>

                                                        ))
                                                    }

                                                </div>


                                                <div className="mt-4">

                                                    <p className="font-semibold">
                                                        🌙 Dinner
                                                    </p>

                                                    {
                                                        menu.dinner.map((item, i) => (

                                                            <p key={i}>
                                                                • {item}
                                                            </p>

                                                        ))
                                                    }

                                                </div>

                                            </div>

                                        ))

                                }

                            </div>

                        </div>

=======
>>>>>>> main
                    </div>
                }

                {
                    activePage === "bookings"

                    &&

                    <div className="bg-white p-6 rounded-3xl">

                        Meal Bookings

                    </div>
                }

            </div>

        </div>

    )

}

export default OwnerDashboard;