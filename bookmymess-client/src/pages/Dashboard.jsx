import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useEffect } from "react";

function Dashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [activePage, setActivePage] =
        useState("dashboard");

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    }
    const [editModal, setEditModal] = useState(false);

    const [selectedMess, setSelectedMess] =
        useState(null);

    const [editMessName, setEditMessName] =
        useState("");

    const [editOwnerName, setEditOwnerName] =
        useState("");

    const [editOwnerPhone, setEditOwnerPhone] =
        useState("");
    const [messName, setMessName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerPhone, setOwnerPhone] = useState("");
    const [pin, setPin] = useState("");
    const [messes, setMesses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalMesses: 0,
        totalStudents: 0,
        activeStudents: 0,
        inactiveStudents: 0
    });
    const handleAddMess = async (e) => {

        e.preventDefault();

        if (
            !messName ||
            !ownerName ||
            !ownerPhone ||
            !pin
        ) {

            alert("Please fill all fields");
            return;

        }

        if (ownerPhone.length !== 10) {

            alert(
                "Phone number must be 10 digits"
            );

            return;

        }

        if (pin.length !== 6) {

            alert(
                "PIN must be 6 digits"
            );

            return;

        }

        try {

            const res = await API.post(
                "/mess/add",
                {
                    messName,
                    ownerName,
                    ownerPhone,
                    pin
                }
            );

            alert(
                res.data.message
            );

            setMessName("");
            setOwnerName("");
            setOwnerPhone("");
            setPin("");

        }

        catch (error) {

            alert(
                error.response?.data?.message
                ||
                "Something went wrong"
            );

        }

    };
    const handleDeleteMess = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this mess?"
            );

        if (!confirmDelete) return;

        try {

            await API.delete(
                `/mess/delete/${id}`
            );

            alert(
                "Mess deleted successfully"
            );

            fetchMesses();

        }

        catch (error) {

            alert(
                error.response?.data?.message
                ||
                "Delete failed"
            );

        }

    };
    const fetchMesses = async () => {

        try {

            setLoading(true);

            const res =
                await API.get(
                    "/mess/all"
                );

            setMesses(
                res.data.messes
            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    }
    const openEditModal = (mess) => {

        setSelectedMess(mess);

        setEditMessName(
            mess.messName
        );

        setEditOwnerName(
            mess.ownerName
        );

        setEditOwnerPhone(
            mess.ownerPhone
        );

        setEditModal(true);

    };
    const fetchDashboardStats = async () => {

        try {

            const res =
                await API.get(
                    "/mess/dashboard-stats"
                );

            setStats(res.data);

        }

        catch (error) {

            console.log(error);

        }

    };
    const handleUpdateMess = async () => {

        try {

            await API.put(

                `/mess/update/${selectedMess._id}`,

                {
                    messName: editMessName,
                    ownerName: editOwnerName,
                    ownerPhone: editOwnerPhone
                }

            );

            alert(
                "Mess Updated Successfully"
            );

            setEditModal(false);

            fetchMesses();

        }

        catch (error) {

            alert(
                error.response?.data?.message
                ||
                "Update Failed"
            );

        }

    };
    useEffect(() => {

        fetchDashboardStats();

    }, []);

    useEffect(() => {

        if (
            activePage === "messmanagement"
        ) {

            fetchMesses();

        }

    }, [activePage]);

    return (

        <div className="min-h-screen flex bg-slate-100">

            {/* Mobile overlay */}

            {
                sidebarOpen &&

                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            }


            {/* Sidebar */}

            <div className={`

fixed
lg:sticky
top-0
left-0
z-50
h-screen
w-[290px]
bg-slate-950
text-white
flex
flex-col
justify-between
duration-300
shadow-2xl

${sidebarOpen
                    ?
                    "translate-x-0"
                    :
                    "-translate-x-full"
                }

lg:translate-x-0

`}>

                <div>

                    <div className="p-6 border-b border-slate-800">

                        <h1 className="text-3xl font-bold">

                            🍽 BookMyMess

                        </h1>

                        <p className="text-sm text-gray-400 mt-2">

                            Smart Meal Management

                        </p>

                    </div>


                    <div className="p-5 space-y-4">

                        <button
                            onClick={() => {
                                setActivePage("dashboard");
                                setSidebarOpen(false);
                            }}
                            className={`

w-full
text-left
p-4
rounded-2xl
duration-300

${activePage === "dashboard"

                                    ?

                                    "bg-gradient-to-r from-blue-600 to-purple-600"

                                    :

                                    "bg-slate-900 hover:bg-slate-800"

                                }

`}
                        >

                            🏠 Dashboard

                        </button>



                        <button
                            onClick={() => {
                                setActivePage("messmanagement");
                                setSidebarOpen(false);
                            }}
                            className={`

w-full
text-left
p-4
rounded-2xl
duration-300

${activePage === "addmess"

                                    ?

                                    "bg-gradient-to-r from-blue-600 to-purple-600"

                                    :

                                    "bg-slate-900 hover:bg-slate-800"

                                }

`}
                        >

                            🍽 Mess Management

                        </button>




                    </div>

                </div>


                <div className="p-5 border-t border-slate-800">

                    <div className="flex items-center gap-4 mb-5">

                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex justify-center items-center text-xl font-bold">

                            {user?.name?.charAt(0)}

                        </div>

                        <div>

                            <h3 className="font-semibold">

                                {user?.name}

                            </h3>

                            <p className="text-gray-400 text-sm">

                                {user?.role}

                            </p>

                        </div>

                    </div>


                    <button
                        onClick={logout}
                        className="w-full bg-red-500 hover:bg-red-600 p-4 rounded-2xl duration-300"
                    >

                        🚪 Logout

                    </button>

                </div>

            </div>


            {/* Main */}

            <div className="flex-1 overflow-x-hidden">


                {/* Navbar */}

                <div className="sticky top-0 z-30 bg-white h-[75px] shadow flex justify-between items-center px-4 md:px-8">

                    <div className="flex items-center gap-5">

                        <button
                            className="lg:hidden text-3xl"
                            onClick={() => setSidebarOpen(true)}
                        >

                            ☰

                        </button>


                        <div>

                            <h2 className="text-2xl font-bold">

                                Dashboard

                            </h2>

                            <p className="text-gray-500 text-sm">

                                Manage BookMyMess

                            </p>

                        </div>

                    </div>


                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center">

                        {user?.name?.charAt(0)}

                    </div>

                </div>



                <div className="p-4 md:p-8">


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



                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

                                <div className="bg-white p-6 rounded-3xl shadow">

                                    <p className="text-gray-500">

                                        Total Messes

                                    </p>

                                    <h1 className="text-4xl font-bold mt-4">
                                        {stats.totalMesses}
                                    </h1>

                                </div>





                                <div className="bg-white p-6 rounded-3xl shadow">

                                    <p className="text-gray-500">

                                        Students

                                    </p>

                                    <h1 className="text-4xl font-bold mt-4">
                                        {stats.totalStudents}
                                    </h1>

                                </div>


                                <div className="bg-white p-6 rounded-3xl shadow">

                                    <p className="text-gray-500">
                                        Active Students
                                    </p>

                                    <h1 className="text-4xl font-bold mt-4 text-green-600">
                                        {stats.activeStudents}
                                    </h1>

                                </div>

                                <div className="bg-white p-6 rounded-3xl shadow">

                                    <p className="text-gray-500">
                                        Inactive Students
                                    </p>

                                    <h1 className="text-4xl font-bold mt-4 text-red-600">
                                        {stats.inactiveStudents}
                                    </h1>

                                </div>

                            </div>

                        </>

                    }



                    {
                        activePage === "messmanagement" && (

                            <div className="space-y-6">

                                <div className="mb-8">

                                    <h1 className="text-3xl font-bold">

                                        🍽 Add New Mess

                                    </h1>

                                    <p className="text-gray-500 mt-2">

                                        Create a mess and automatically generate an owner login account

                                    </p>

                                </div>


                                <form
                                    onSubmit={handleAddMess}
                                    className="space-y-6"
                                >

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div>

                                            <label
                                                className="font-semibold text-gray-700"
                                            >

                                                Mess Name

                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Enter mess name"
                                                value={messName}
                                                onChange={(e) =>
                                                    setMessName(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full mt-2 p-4 border rounded-2xl outline-none focus:border-blue-500"
                                            />

                                        </div>


                                        <div>

                                            <label
                                                className="font-semibold text-gray-700"
                                            >

                                                Owner Name

                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Enter owner name"
                                                value={ownerName}
                                                onChange={(e) =>
                                                    setOwnerName(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full mt-2 p-4 border rounded-2xl outline-none focus:border-blue-500"
                                            />

                                        </div>



                                        <div>

                                            <label
                                                className="font-semibold text-gray-700"
                                            >

                                                Owner Phone Number

                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Enter phone number"
                                                maxLength="10"
                                                value={ownerPhone}
                                                onChange={(e) =>
                                                    setOwnerPhone(
                                                        e.target.value.replace(/\D/g, "")
                                                    )
                                                }
                                                className="w-full mt-2 p-4 border rounded-2xl outline-none focus:border-blue-500"
                                            />

                                        </div>



                                        <div>

                                            <label
                                                className="font-semibold text-gray-700"
                                            >

                                                6 Digit PIN

                                            </label>

                                            <input
                                                type="password"
                                                placeholder="Enter 6 digit PIN"
                                                maxLength="6"
                                                value={pin}
                                                onChange={(e) =>
                                                    setPin(
                                                        e.target.value
                                                            .replace(/\D/g, "")
                                                    )
                                                }
                                                className="w-full mt-2 p-4 border rounded-2xl outline-none focus:border-blue-500"
                                            />

                                            <p className="text-sm text-gray-500 mt-2">

                                                This PIN will be used by owner for login

                                            </p>

                                        </div>

                                    </div>



                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-semibold hover:scale-105 duration-300"
                                    >

                                        Create Mess

                                    </button>

                                </form>

                            </div>

                        )
                    }



                    {
                        activePage === "messmanagement" && (

                            <>

                                {/* Stats Cards */}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-6">

                                    <div className="bg-white p-6 rounded-[30px] shadow-lg">

                                        <p className="text-gray-500 text-lg">

                                            Total Messes

                                        </p>

                                        <h1 className="text-4xl font-bold mt-4 text-blue-600">

                                            {messes.length}

                                        </h1>

                                    </div>


                                    <div className="bg-white p-6 rounded-[30px] shadow-lg">

                                        <p className="text-gray-500 text-lg">

                                            Total Students

                                        </p>

                                        <h1 className="text-4xl font-bold mt-4 text-purple-600">

                                            0

                                        </h1>

                                    </div>

                                </div>


                                {/* View Messes Card */}
                                <div className="mt-16">

                                    <div className="flex justify-between items-center mb-6">

                                        <div>

                                            <h1 className="text-3xl font-bold">
                                                📋 All Messes
                                            </h1>

                                            <p className="text-gray-500">
                                                View and manage all messes from one place
                                            </p>

                                        </div>

                                    </div>


                                    {
                                        loading ? (

                                            <div className="text-center py-10">

                                                Loading...

                                            </div>

                                        ) : (

                                            <div className="">

                                                <table className="w-full">

                                                    <thead>

                                                        <tr className="border-b">

                                                            <th className="text-left p-4">
                                                                Mess
                                                            </th>

                                                            <th className="text-left p-4">
                                                                Owner
                                                            </th>

                                                            <th className="text-left p-4">
                                                                Phone
                                                            </th>

                                                            <th className="text-left p-4">
                                                                Students
                                                            </th>

                                                            <th className="text-left p-4">
                                                                Active
                                                            </th>

                                                            <th className="text-left p-4">
                                                                Inactive
                                                            </th>

                                                            <th className="text-left p-4">
                                                                Created
                                                            </th>

                                                            <th className="text-left p-4">
                                                                Actions
                                                            </th>

                                                        </tr>

                                                    </thead>


                                                    <tbody>

                                                        {

                                                            messes.map((mess) => (

                                                                <tr
                                                                    key={mess._id}
                                                                    className="border-b hover:bg-gray-50"
                                                                >

                                                                    <td className="p-4">

                                                                        {mess.messName}

                                                                    </td>


                                                                    <td className="p-4">

                                                                        {mess.ownerName}

                                                                    </td>


                                                                    <td className="p-4">

                                                                        {mess.ownerPhone}

                                                                    </td>

                                                                    <td className="p-4 font-semibold text-blue-600">

                                                                        {mess.totalStudents}

                                                                    </td>

                                                                    <td className="p-4 font-semibold text-green-600">

                                                                        {mess.activeStudents}

                                                                    </td>

                                                                    <td className="p-4 font-semibold text-red-600">

                                                                        {mess.inactiveStudents}

                                                                    </td>

                                                                    <td className="p-4">

                                                                        {
                                                                            new Date(
                                                                                mess.createdAt
                                                                            ).toLocaleDateString()
                                                                        }

                                                                    </td>


                                                                    <td className="p-4 flex gap-3">

                                                                        <button
                                                                            onClick={() =>
                                                                                openEditModal(mess)
                                                                            }
                                                                            className="bg-blue-500 px-4 py-2 rounded-xl text-white"
                                                                        >
                                                                            Edit
                                                                        </button>

                                                                        <button
                                                                            onClick={() =>
                                                                                handleDeleteMess(
                                                                                    mess._id
                                                                                )
                                                                            }
                                                                            className="bg-red-500 px-4 py-2 rounded-xl text-white"
                                                                        >
                                                                            Delete
                                                                        </button>

                                                                    </td>

                                                                </tr>

                                                            ))

                                                        }

                                                    </tbody>

                                                </table>

                                            </div>

                                        )
                                    }

                                </div>

                            </>

                        )
                    }

                </div>

            </div>
            {
                editModal && (

                    <div
                        className="
fixed
inset-0
bg-black/50
flex
items-center
justify-center
z-50
"
                    >

                        <div
                            className="
bg-white
p-6
rounded-3xl
w-full
max-w-md
space-y-4
"
                        >

                            <h2
                                className="
text-2xl
font-bold
"
                            >
                                Edit Mess
                            </h2>

                            <input
                                value={editMessName}
                                onChange={(e) =>
                                    setEditMessName(
                                        e.target.value
                                    )
                                }
                                placeholder="Mess Name"
                                className="
w-full
p-3
border
rounded-xl
"
                            />

                            <input
                                value={editOwnerName}
                                onChange={(e) =>
                                    setEditOwnerName(
                                        e.target.value
                                    )
                                }
                                placeholder="Owner Name"
                                className="
w-full
p-3
border
rounded-xl
"
                            />

                            <input
                                value={editOwnerPhone}
                                onChange={(e) =>
                                    setEditOwnerPhone(
                                        e.target.value
                                    )
                                }
                                placeholder="Owner Phone"
                                className="
w-full
p-3
border
rounded-xl
"
                            />

                            <div
                                className="
flex
gap-3
"
                            >

                                <button
                                    onClick={
                                        handleUpdateMess
                                    }
                                    className="
flex-1
bg-green-600
text-white
p-3
rounded-xl
"
                                >
                                    Update
                                </button>

                                <button
                                    onClick={() =>
                                        setEditModal(false)
                                    }
                                    className="
flex-1
bg-gray-500
text-white
p-3
rounded-xl
"
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }
        </div>

    )

}

export default Dashboard