import { useState } from "react";

function Dashboard() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [activePage, setActivePage] =
        useState("dashboard");

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    return (

        <div className="min-h-screen flex bg-slate-100">

            {/* Sidebar */}

            <div className={`

fixed
lg:static
top-0
left-0
z-50
h-full
w-[280px]
bg-slate-950
text-white
p-6
duration-300

${sidebarOpen
                    ?
                    "translate-x-0"
                    :
                    "-translate-x-full"
                }

lg:translate-x-0

`}>

                <div className="flex justify-between items-center">

                    <div>

                        <h1 className="text-3xl font-bold">

                            BookMyMess

                        </h1>

                        <p className="text-gray-400 text-sm">

                            Super Admin

                        </p>

                    </div>

                    <button
                        className="lg:hidden"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                    >

                        ✕

                    </button>

                </div>


                <div className="space-y-3 mt-10">

                    <button

                        onClick={() =>
                            setActivePage(
                                "dashboard"
                            )
                        }

                        className={`

w-full
text-left
p-4
rounded-xl
duration-300

${activePage === "dashboard"

                                ?

                                "bg-gradient-to-r from-blue-600 to-purple-600"

                                :

                                "bg-slate-800"

                            }

`}

                    >

                        🏠 Dashboard

                    </button>



                    <button

                        onClick={() =>
                            setActivePage(
                                "addmess"
                            )
                        }

                        className={`

w-full
text-left
p-4
rounded-xl
duration-300

${activePage === "addmess"

                                ?

                                "bg-gradient-to-r from-blue-600 to-purple-600"

                                :

                                "bg-slate-800"

                            }

`}

                    >

                        🍽 Add Mess

                    </button>



                    <button

                        onClick={() =>
                            setActivePage(
                                "viewmess"
                            )
                        }

                        className={`

w-full
text-left
p-4
rounded-xl
duration-300

${activePage === "viewmess"

                                ?

                                "bg-gradient-to-r from-blue-600 to-purple-600"

                                :

                                "bg-slate-800"

                            }

`}

                    >

                        📋 View Messes

                    </button>

                </div>

            </div>



            {/* Main Content */}

            <div className="flex-1">

                {/* Top Navbar */}

                <div className="bg-white h-[70px] shadow-sm flex justify-between items-center px-6">

                    <div className="flex items-center gap-4">

                        <button

                            className="lg:hidden text-2xl"

                            onClick={() =>
                                setSidebarOpen(true)
                            }

                        >

                            ☰

                        </button>


                        <div>

                            <h2 className="font-bold text-2xl">

                                Dashboard

                            </h2>

                            <p className="text-gray-500 text-sm">

                                Manage your system

                            </p>

                        </div>

                    </div>


                    <div className="flex items-center gap-4">

                        <div className="hidden md:block">

                            <p className="font-semibold">

                                {user?.name}

                            </p>

                            <p className="text-sm text-gray-500">

                                {user?.role}

                            </p>

                        </div>


                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex justify-center items-center">

                            {user?.name?.charAt(0)}

                        </div>

                    </div>

                </div>



                <div className="p-6">

                    {
                        activePage === "dashboard"

                        &&

                        <>

                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-[30px] p-8">

                                <h1 className="text-4xl font-bold">

                                    Welcome 👋

                                </h1>

                                <p className="mt-3">

                                    {user?.name}

                                </p>

                            </div>



                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

                                <div className="bg-white p-6 rounded-3xl shadow">

                                    <h3 className="text-gray-500">

                                        Total Messes

                                    </h3>

                                    <h1 className="text-4xl font-bold mt-3">

                                        10

                                    </h1>

                                </div>



                                <div className="bg-white p-6 rounded-3xl shadow">

                                    <h3 className="text-gray-500">

                                        Owners

                                    </h3>

                                    <h1 className="text-4xl font-bold mt-3">

                                        5

                                    </h1>

                                </div>



                                <div className="bg-white p-6 rounded-3xl shadow">

                                    <h3 className="text-gray-500">

                                        Students

                                    </h3>

                                    <h1 className="text-4xl font-bold mt-3">

                                        500

                                    </h1>

                                </div>



                                <div className="bg-white p-6 rounded-3xl shadow">

                                    <h3 className="text-gray-500">

                                        Status

                                    </h3>

                                    <h1 className="text-green-500 font-bold text-2xl mt-3">

                                        Active

                                    </h1>

                                </div>

                            </div>

                        </>

                    }



                    {
                        activePage === "addmess"

                        &&

                        <div className="bg-white p-8 rounded-3xl shadow-lg">

                            <h1 className="text-3xl font-bold">

                                🍽 Add Mess

                            </h1>

                            <p className="mt-3 text-gray-500">

                                Mess creation form here

                            </p>

                        </div>

                    }



                    {
                        activePage === "viewmess"

                        &&

                        <div className="bg-white p-8 rounded-3xl shadow-lg">

                            <h1 className="text-3xl font-bold">

                                📋 View Messes

                            </h1>

                        </div>

                    }

                </div>

            </div>

        </div>

    )

}

export default Dashboard;