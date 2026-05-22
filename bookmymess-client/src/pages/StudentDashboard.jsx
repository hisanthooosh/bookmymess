import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

function StudentDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );
   
    const [sidebarOpen, setSidebarOpen] =
        useState(false);
    const [todayMenu, setTodayMenu] =
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
    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/");

    }
    useEffect(() => {

        fetchTodayMenu();

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

                <div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
">

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
">

                        📋 Book Meal

                    </div>

                </div>

            </div>

        </div>

    )

}

export default StudentDashboard;