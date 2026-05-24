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
    const [reactivateModal, setReactivateModal] =
        useState(false);

    const [selectedStudentId, setSelectedStudentId] =
        useState("");

    const [newStartDate, setNewStartDate] =
        useState("");

    const [newEndDate, setNewEndDate] =
        useState("");
    const [selectedDay, setSelectedDay] =
        useState("Sunday");
    const [extraTab, setExtraTab] =
        useState(
            "payment"
        );
    const [selectedOrder,
        setSelectedOrder] =
        useState(null);

    const [orderModal,
        setOrderModal] =
        useState(false);
    const [extraItems,
        setExtraItems] =
        useState([]);

    const [extraName,
        setExtraName] =
        useState("");

    const [extraPrice,
        setExtraPrice] =
        useState("");

    const [extraMealType,
        setExtraMealType] =
        useState("breakfast");

    const [extraDay,
        setExtraDay] =
        useState("Sunday");
    const [upiId, setUpiId] =
        useState(
            user?.upiId || ""
        );
    const [orders,
        setOrders] =
        useState([]);
    const [upiName, setUpiName] =
        useState(
            user?.upiName || ""
        );
    const [bookingStats, setBookingStats] =
        useState({

            tomorrowTotal: 0,

            todayBreakfastComing: 0,
            todayBreakfastNotComing: 0,
            todayBreakfastNoResponse: 0,

            todayLunchComing: 0,
            todayLunchNotComing: 0,
            todayLunchNoResponse: 0,

            todayDinnerComing: 0,
            todayDinnerNotComing: 0,
            todayDinnerNoResponse: 0,

            breakfastComing: 0,
            breakfastNotComing: 0,
            breakfastNoResponse: 0,

            lunchComing: 0,
            lunchNotComing: 0,
            lunchNoResponse: 0,

            dinnerComing: 0,
            dinnerNotComing: 0,
            dinnerNoResponse: 0

        });
    const [expiryStats, setExpiryStats] =
        useState({

            endingToday: 0,

            endingTomorrow: 0,

            ending7Days: 0

        });
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

    const [students, setStudents] =
        useState([]);
    const [editingExtraId,
        setEditingExtraId] =
        useState(null);
    const [searchTerm, setSearchTerm] =
        useState("");
    const [bookingSearch, setBookingSearch] =
        useState("");

    const [selectedBookingStudent,
        setSelectedBookingStudent] =
        useState(null);
    const [attendanceList,
        setAttendanceList] =
        useState([]);
    const [studentName, setStudentName] =
        useState("");

    const [studentPhone, setStudentPhone] =
        useState("");

    const [studentPassword, setStudentPassword] =
        useState("");

    const [startDate, setStartDate] =
        useState("");

    const [editingStudentId, setEditingStudentId] =
        useState(null);

    const [isEditing, setIsEditing] =
        useState(false);

    const [endDate, setEndDate] =
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
    const fetchBookingStats =
        async () => {

            try {

                const res =
                    await API.get(

                        `/booking/stats/${user.messId}`

                    );

                setBookingStats(
                    res.data
                );

            }

            catch (error) {

                toast.error(
                    "Failed to load stats"
                );

            }

        }

    const fetchExpiryStats =
        async () => {

            try {

                const res =

                    await API.get(

                        `/student/expiry-stats/${user.messId}`

                    );

                setExpiryStats(
                    res.data
                );

            }

            catch (error) {

                toast.error(
                    "Failed to load expiry stats"
                );

            }

        }
    const openOrder =
        (order) => {

            setSelectedOrder(
                order
            );

            setOrderModal(
                true
            );

        }
    const fetchOrders =
        async () => {

            try {

                const res =

                    await API.get(

                        `/booking/extra-orders/${user.messId}`

                    );

                console.log(
                    "Orders Data:",
                    res.data
                );

                setOrders(
                    res.data
                );

            }

            catch (error) {

                console.log(
                    "Order Error:",
                    error
                );

            }

        }
    const savePaymentInfo =
        async () => {

            try {

                await API.put(

                    `/owner/payment/${user._id}`,

                    {

                        upiId,
                        upiName

                    }

                );

                const updatedUser = {

                    ...user,

                    upiId,
                    upiName

                };

                localStorage.setItem(

                    "user",

                    JSON.stringify(
                        updatedUser
                    )

                );

                toast.success(
                    "Payment info saved 🎉"
                );

            }

            catch (error) {

                toast.error(
                    "Failed to save"
                );

            }

        }
    const saveExtraItem =
        async () => {

            try {

                await API.post(

                    "/extra-item/save",

                    {

                        messId:
                            user.messId,

                        day:
                            extraDay,

                        mealType:
                            extraMealType,

                        itemName:
                            extraName,

                        price:
                            extraPrice

                    }

                );

                toast.success(

                    "Extra item added 🎉"

                );

                fetchExtraItems();

                setExtraName("");

                setExtraPrice("");

            }

            catch (error) {

                toast.error(
                    "Failed"
                );

            }

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
    const editExtraItem =
        (item) => {

            setEditingExtraId(
                item._id
            );

            setExtraDay(
                item.day
            );

            setExtraMealType(
                item.mealType
            );

            setExtraName(
                item.itemName
            );

            setExtraPrice(
                item.price
            );

        }
    const updateExtraItem =
        async () => {

            try {

                await API.put(

                    `/extra-item/update/${editingExtraId}`,

                    {

                        day:
                            extraDay,

                        mealType:
                            extraMealType,

                        itemName:
                            extraName,

                        price:
                            extraPrice

                    }

                );

                toast.success(
                    "Updated 🎉"
                );

                setEditingExtraId(
                    null
                );

                setExtraName("");
                setExtraPrice("");

                fetchExtraItems();

            }
            catch (error) {

                toast.error(
                    "Failed"
                );

            }

        }

    const deleteExtraItem =
        async (id) => {

            try {

                await API.delete(

                    `/extra-item/delete/${id}`

                );

                toast.success(
                    "Deleted"
                );

                fetchExtraItems();

            }
            catch (error) {

                toast.error(
                    "Failed"
                );

            }

        }
    const fetchAttendance =
        async () => {

            try {

                if (
                    !bookingSearch.trim()
                )
                    return;


                const res =

                    await API.get(

                        `/booking/attendance/${bookingSearch}`

                    );

                setSelectedBookingStudent(
                    res.data
                );

            }

            catch (error) {

                toast.error(
                    "Student Not Found"
                );

                setSelectedBookingStudent(
                    null
                );

            }

        }
    const confirmOrder =
        async (id) => {

            try {

                await API.put(

                    `/booking/confirm-order/${id}`

                );

                toast.success(

                    "Order confirmed 🎉"

                );

                await fetchOrders();

                if (selectedOrder) {

                    setSelectedOrder({

                        ...selectedOrder,

                        orderStatus:
                            "confirmed"

                    });

                }

            }

            catch (error) {

                toast.error(

                    "Failed"

                );

            }

        }
    const fetchAttendanceList =
        async () => {

            try {

                const res =

                    await API.get(

                        `/student/attendance-list/${user.messId}`

                    );

                console.log(
                    "Attendance Data:",
                    res.data
                );

                setAttendanceList(
                    res.data
                );

            }

            catch (error) {

                console.log(error);

                toast.error(
                    "Failed to load attendance"
                );

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
    const fetchStudents = async () => {

        try {

            const res =

                await API.get(
                    `/student/${user.messId}`
                );

            setStudents(
                res.data.students
            );

        }

        catch (error) {

            toast.error(
                "Failed to load students"
            );

        }

    }
    useEffect(() => {

        fetchMenus();

        fetchStudents();

        fetchBookingStats();

        fetchExpiryStats();
        fetchAttendanceList();
        fetchExtraItems();
        fetchOrders();

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

        if (isEditing) {

            try {

                await API.put(

                    `/student/update/${editingStudentId}`,

                    {

                        name: studentName,
                        phone: studentPhone,
                        studentStartDate: startDate,
                        studentEndDate: endDate

                    }

                );

                toast.success(
                    "Student Updated 🎉"
                );

                setIsEditing(false);

                setEditingStudentId(null);

                setStudentName("");
                setStudentPhone("");
                setStudentPassword("");
                setStartDate("");
                setEndDate("");

                fetchStudents();

                return;

            }

            catch (error) {

                toast.error(
                    "Update failed"
                );

                return;

            }

        }

        try {

            const res =
                await API.post(

                    "/student/add",

                    {
                        name: studentName,
                        phone: studentPhone,
                        password: studentPassword,
                        startDate,
                        endDate,
                        messId: user.messId
                    }

                );

            toast.success(
                "Student Added Successfully 🎉"
            );
            await fetchStudents();
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
    const deleteStudent = async (id) => {

        try {

            await API.delete(
                `/student/delete/${id}`
            );

            toast.success(
                "Student Deleted"
            );

            fetchStudents();

        }

        catch (error) {

            toast.error(
                "Delete failed"
            );

        }

    }

    const reactivateStudent = (id) => {

        setSelectedStudentId(id);

        setReactivateModal(true);

    }
    const editStudent = (student) => {

        setIsEditing(true);

        setEditingStudentId(
            student._id
        );

        setStudentName(
            student.name
        );

        setStudentPhone(
            student.phone
        );

        setStartDate(
            student.studentStartDate
                ?.split("T")[0]
        );

        setEndDate(
            student.studentEndDate
                ?.split("T")[0]
        );

    }
    const filteredStudents =
        students.filter((student) =>

            student.name
                .toLowerCase()
                .includes(
                    searchTerm.toLowerCase()
                )

            ||

            student.phone.includes(
                searchTerm
            )

            ||

            student.studentId
                ?.toLowerCase()

                .includes(

                    bookingSearch
                        .toLowerCase()

                )

        );
    const submitReactivate =
        async () => {

            try {

                await API.put(

                    `/student/reactivate/${selectedStudentId}`,

                    {
                        studentStartDate:
                            newStartDate,

                        studentEndDate:
                            newEndDate
                    }

                );

                toast.success(
                    "Student Reactivated"
                );

                setReactivateModal(false);

                setNewStartDate("");

                setNewEndDate("");

                fetchStudents();

            }

            catch (error) {

                toast.error(
                    "Reactivate Failed"
                );

            }

        }

    const days = [

        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"

    ];

    const todayDay =
        days[
        new Date().getDay()
        ];

    const tomorrowDay =
        days[
        (
            new Date().getDay() + 1
        ) % 7
        ];

    const todayMenu =

        savedMenus.find(
            menu =>
                menu.day === todayDay
        );

    const tomorrowMenu =

        savedMenus.find(
            menu =>
                menu.day === tomorrowDay
        );










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
                            onClick={() => {
                                setActivePage("dashboard");
                                setSidebarOpen(false);
                            }
                            }
                            className="w-full p-4 bg-slate-800 rounded-xl text-left"
                        >

                            🏠 Dashboard

                        </button>

                        <button
                            onClick={() => {
                                setActivePage("students");
                                setSidebarOpen(false);
                            }
                            }
                            className="w-full p-4 bg-slate-800 rounded-xl text-left"
                        >

                            👨‍🎓 Students

                        </button>

                        <button
                            onClick={() => {
                                setActivePage("menu")
                                setSidebarOpen(false);
                            }
                            }
                            className="w-full p-4 bg-slate-800 rounded-xl text-left"
                        >

                            🍛 Menu

                        </button>

                        <button
                            onClick={() => {
                                setActivePage("bookings")
                                setSidebarOpen(false);
                            }
                            }
                            className="w-full p-4 bg-slate-800 rounded-xl text-left"
                        >

                            📋 Meal Attendance

                        </button>
                        <button
                            onClick={() => {
                                setActivePage("extra")
                                setSidebarOpen(false);
                            }}
                            className="
w-full
p-4
bg-slate-800
rounded-xl
text-left
"
                        >

                            🍽 Extra Orders & Payments

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

                    <div className="
grid
grid-cols-1
xl:grid-cols-2
gap-5
mb-6
">
                        <div className="
bg-white
rounded-[30px]
shadow-md
p-6
mb-6
col-span-full
">

                            <div className="
flex
justify-between
items-center
mb-6
">

                                <div>

                                    <h1 className="
text-2xl
font-bold
">

                                        📊 Subscription Status

                                    </h1>

                                    <p className="
text-sm
text-gray-500
">

                                        Student subscription overview

                                    </p>

                                </div>

                            </div>


                            <div className="
grid
grid-cols-1
md:grid-cols-3
gap-5
">

                                {/* Today */}

                                <div className="
bg-red-50
rounded-2xl
p-5
border
border-red-200
">

                                    <div className="
text-4xl
mb-2
">

                                        ⏰

                                    </div>

                                    <h2 className="
font-semibold
text-gray-600
">

                                        Ending Today

                                    </h2>

                                    <p className="
text-5xl
font-bold
text-red-500
mt-3
">

                                        {expiryStats.endingToday}

                                    </p>

                                    <p className="
text-sm
text-gray-500
mt-2
">

                                        Students

                                    </p>

                                </div>


                                {/* Tomorrow */}

                                <div className="
bg-blue-50
rounded-2xl
p-5
border
border-blue-200
">

                                    <div className="
text-4xl
mb-2
">

                                        📅

                                    </div>

                                    <h2 className="
font-semibold
text-gray-600
">

                                        Ending Tomorrow

                                    </h2>

                                    <p className="
text-5xl
font-bold
text-blue-500
mt-3
">

                                        {expiryStats.endingTomorrow}

                                    </p>

                                    <p className="
text-sm
text-gray-500
mt-2
">

                                        Students

                                    </p>

                                </div>


                                {/* 7 days */}

                                <div className="
bg-yellow-50
rounded-2xl
p-5
border
border-yellow-200
">

                                    <div className="
text-4xl
mb-2
">

                                        ⚠

                                    </div>

                                    <h2 className="
font-semibold
text-gray-600
">

                                        Ending In 7 Days

                                    </h2>

                                    <p className="
text-5xl
font-bold
text-yellow-500
mt-3
">

                                        {expiryStats.ending7Days}

                                    </p>

                                    <p className="
text-sm
text-gray-500
mt-2
">

                                        Students

                                    </p>

                                </div>

                            </div>

                        </div>
                        {/* TODAY */}

                        <div className="
bg-white
rounded-[30px]
shadow-md
overflow-hidden
">

                            <div className="
bg-red-500
text-white
p-4
flex
justify-between
items-center
">

                                <div>

                                    <h1 className="
text-xl
font-bold
">

                                        📅 Today

                                    </h1>

                                    <p className="text-sm">

                                        {new Date().toLocaleDateString()}

                                    </p>

                                    <p className="
text-xs
text-white/80
mt-1
">

                                        {todayDay}

                                    </p>

                                </div>

                                <div className="
bg-white/20
px-3
py-1
rounded-full
text-sm
font-bold
">

                                    🔒 Fixed

                                </div>

                            </div>


                            <div className="
p-5
grid
grid-cols-1
md:grid-cols-3
gap-4
">

                                {
                                    [
                                        {
                                            title: "🍳 Breakfast",

                                            menu:
                                                todayMenu?.breakfast?.join(", ")
                                                || "No Menu",

                                            coming: bookingStats.todayBreakfastComing,

                                            notComing: bookingStats.todayBreakfastNotComing,

                                            noResponse: bookingStats.todayBreakfastNoResponse
                                        },

                                        {
                                            title: "🍛 Lunch",

                                            menu:
                                                todayMenu?.lunch?.join(", ")
                                                || "No Menu",

                                            coming: bookingStats.todayLunchComing,

                                            notComing: bookingStats.todayLunchNotComing,

                                            noResponse: bookingStats.todayLunchNoResponse
                                        },

                                        {
                                            title: "🌙 Dinner",

                                            menu:
                                                todayMenu?.dinner?.join(", ")
                                                || "No Menu",

                                            coming: bookingStats.todayDinnerComing,

                                            notComing: bookingStats.todayDinnerNotComing,

                                            noResponse: bookingStats.todayDinnerNoResponse
                                        }
                                    ].map((meal, index) => (

                                        <div
                                            key={index}
                                            className="
bg-slate-50
rounded-2xl
p-4
border
hover:shadow-md
duration-300
"
                                        >

                                            <h2 className="
font-bold
text-sm
text-gray-600
mb-4
">

                                                {meal.title}


                                            </h2>
                                            <p className="
text-xs
text-gray-500
mb-4
leading-5
">

                                                🍽 {meal.menu}

                                            </p>

                                            <div className="space-y-3">

                                                <div className="
flex
justify-between
items-center
">

                                                    <span className="
text-green-600
font-medium
">

                                                        Coming

                                                    </span>

                                                    <span className="
text-3xl
font-bold
">

                                                        {meal.coming}

                                                    </span>

                                                </div>


                                                <div className="
flex
justify-between
items-center
">

                                                    <span className="
text-red-500
font-medium
">

                                                        Not Coming

                                                    </span>

                                                    <span className="
text-3xl
font-bold
">

                                                        {meal.notComing}

                                                    </span>

                                                </div>


                                                <div className="
flex
justify-between
items-center
">

                                                    <span className="
text-gray-500
font-medium
">

                                                        No Reply

                                                    </span>

                                                    <span className="
text-3xl
font-bold
">

                                                        {meal.noResponse}

                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    ))
                                }

                            </div>

                        </div>



                        {/* TOMORROW */}

                        <div className="
bg-white
rounded-[30px]
shadow-md
overflow-hidden
">

                            <div className="
bg-green-500
text-white
p-4
flex
justify-between
items-center
">

                                <div>

                                    <h1 className="
text-xl
font-bold
">

                                        📅 Tomorrow

                                    </h1>

                                    <p className="text-sm">

                                        {
                                            new Date(
                                                Date.now() + 86400000
                                            ).toLocaleDateString()
                                        }

                                    </p>

                                    <p className="
text-xs
text-white/80
mt-1
">

                                        {tomorrowDay}

                                    </p>

                                </div>

                                <div className="
bg-white/20
px-3
py-1
rounded-full
text-sm
font-bold
">

                                    ✏ Editable

                                </div>

                            </div>


                            <div className="
p-5
grid
grid-cols-1
md:grid-cols-3
gap-4
">

                                {
                                    [
                                        {
                                            title: "🍳 Breakfast",

                                            menu:
                                                tomorrowMenu?.breakfast?.join(", ")
                                                || "No Menu",

                                            coming: bookingStats.breakfastComing,

                                            notComing: bookingStats.breakfastNotComing,

                                            noResponse: bookingStats.breakfastNoResponse
                                        },

                                        {
                                            title: "🍛 Lunch",

                                            menu:
                                                tomorrowMenu?.lunch?.join(", ")
                                                || "No Menu",

                                            coming: bookingStats.lunchComing,

                                            notComing: bookingStats.lunchNotComing,

                                            noResponse: bookingStats.lunchNoResponse
                                        },

                                        {
                                            title: "🌙 Dinner",

                                            menu:
                                                tomorrowMenu?.dinner?.join(", ")
                                                || "No Menu",

                                            coming: bookingStats.dinnerComing,

                                            notComing: bookingStats.dinnerNotComing,

                                            noResponse: bookingStats.dinnerNoResponse
                                        }
                                    ].map((meal, index) => (

                                        <div
                                            key={index}
                                            className="
bg-slate-50
rounded-2xl
p-4
border
hover:shadow-md
duration-300
"
                                        >

                                            <h2 className="
font-bold
text-sm
text-gray-600
mb-4
">

                                                {meal.title}

                                            </h2>
                                            <p className="
text-xs
text-gray-500
mb-4
leading-5
">

                                                🍽 {meal.menu}

                                            </p>
                                            <div className="
space-y-3
">

                                                <div className="
flex
justify-between
items-center
">

                                                    <span className="
text-green-600
font-medium
">

                                                        Coming

                                                    </span>

                                                    <span className="
text-3xl
font-bold
">

                                                        {meal.coming}

                                                    </span>

                                                </div>


                                                <div className="
flex
justify-between
items-center
">

                                                    <span className="
text-red-500
font-medium
">

                                                        Not Coming

                                                    </span>

                                                    <span className="
text-3xl
font-bold
">

                                                        {meal.notComing}

                                                    </span>

                                                </div>


                                                <div className="
flex
justify-between
items-center
">

                                                    <span className="
text-gray-500
font-medium
">

                                                        No Reply

                                                    </span>

                                                    <span className="
text-3xl
font-bold
">

                                                        {meal.noResponse}

                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    ))

                                }

                            </div>

                        </div>

                    </div>
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
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(
                                        e.target.value
                                    )
                                }
                                className="
w-full
p-4
border
rounded-xl"
                            />

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                    setEndDate(
                                        e.target.value
                                    )
                                }
                                className="
w-full
p-4
border
rounded-xl"
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

                                {
                                    isEditing
                                        ?
                                        "Update Student"
                                        :
                                        "Add Student"
                                }

                            </button>

                        </div>
                        <div className="mt-10">

                            <h2 className="text-2xl font-bold mb-5">

                                📋 Students List

                            </h2>
                            <input
                                type="text"
                                placeholder="Search by Name, Phone or Student ID"
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                                className="
w-full
p-4
border
rounded-xl
mb-6
"
                            />

                            <div className="overflow-x-auto">

                                <table className="w-full border-collapse">

                                    <thead>

                                        <tr className="bg-slate-800 text-white">

                                            <th className="p-4 text-left">
                                                No
                                            </th>

                                            <th className="p-4 text-left">
                                                Student ID
                                            </th>

                                            <th className="p-4 text-left">
                                                Name
                                            </th>

                                            <th className="p-4 text-left">
                                                Phone
                                            </th>

                                            <th className="p-4 text-left">
                                                Start Date
                                            </th>

                                            <th className="p-4 text-left">
                                                End Date
                                            </th>

                                            <th className="p-4 text-left">
                                                Status
                                            </th>

                                            <th className="p-4 text-left">
                                                Remaining Days
                                            </th>

                                            <th className="p-4 text-left">
                                                Actions
                                            </th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            filteredStudents.map((student, index) => (

                                                <tr
                                                    key={student._id}
                                                    className="
border-b
hover:bg-slate-100
"
                                                >

                                                    <td className="p-4">

                                                        {index + 1}

                                                    </td>

                                                    <td className="p-4">

                                                        {student.studentId}

                                                    </td>

                                                    <td className="p-4">

                                                        {student.name}

                                                    </td>

                                                    <td className="p-4">

                                                        {student.phone}

                                                    </td>

                                                    <td className="p-4">

                                                        {
                                                            new Date(
                                                                student.studentStartDate
                                                            ).toLocaleDateString()
                                                        }

                                                    </td>

                                                    <td className="p-4">

                                                        {
                                                            new Date(
                                                                student.studentEndDate
                                                            ).toLocaleDateString()
                                                        }

                                                    </td>


                                                    <td className="p-4">

                                                        <span
                                                            className={`

px-3
py-1
rounded-full
text-white

${new Date(
                                                                student.studentEndDate
                                                            ) > new Date()

                                                                    ?

                                                                    "bg-green-500"

                                                                    :

                                                                    "bg-red-500"

                                                                }

`}
                                                        >

                                                            {
                                                                new Date(
                                                                    student.studentEndDate
                                                                ) > new Date()

                                                                    ?

                                                                    "Active"

                                                                    :

                                                                    "Expired"

                                                            }

                                                        </span>

                                                    </td>
                                                    <td className="p-4">

                                                        {

                                                            Math.max(

                                                                0,

                                                                Math.ceil(

                                                                    (
                                                                        new Date(
                                                                            student.studentEndDate
                                                                        )

                                                                        -

                                                                        new Date()

                                                                    )

                                                                    /

                                                                    (
                                                                        1000 * 60 * 60 * 24
                                                                    )

                                                                )

                                                            )

                                                        } Days

                                                    </td>
                                                    <td className="p-4 flex gap-2">

                                                        <button
                                                            onClick={() =>
                                                                editStudent(student)
                                                            }
                                                            className="
bg-blue-500
text-white
px-3
py-2
rounded-lg"
                                                        >

                                                            ✏️ Edit

                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                deleteStudent(
                                                                    student._id
                                                                )
                                                            }
                                                            className="
bg-red-500
text-white
px-3
py-2
rounded-lg"
                                                        >

                                                            🗑 Delete

                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                reactivateStudent(
                                                                    student._id
                                                                )
                                                            }
                                                            className="
bg-green-500
text-white
px-3
py-2
rounded-lg"
                                                        >

                                                            🔄 Reactivate

                                                        </button>

                                                    </td>
                                                </tr>

                                            ))
                                        }

                                    </tbody>

                                </table>

                            </div>

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


                    </div>
                }
                {
                    activePage === "extra"

                    &&

                    <div
                        className="
bg-white
p-6
rounded-3xl
space-y-6
"
                    >

                        <div
                            className="
flex
gap-3
border-b
pb-4
"
                        >

                            <button

                                onClick={() =>
                                    setExtraTab(
                                        "payment"
                                    )
                                }

                                className={`

px-5
py-3
rounded-xl

${extraTab === "payment"

                                        ?

                                        "bg-blue-600 text-white"

                                        :

                                        "bg-slate-100"

                                    }

`}

                            >

                                💳 Payment Setup

                            </button>

                            <button

                                onClick={() =>
                                    setExtraTab(
                                        "items"
                                    )
                                }

                                className={`

px-5
py-3
rounded-xl

${extraTab === "items"

                                        ?

                                        "bg-blue-600 text-white"

                                        :

                                        "bg-slate-100"

                                    }

`}

                            >

                                🍗 Extra Items

                            </button>

                            <button

                                onClick={() =>
                                    setExtraTab(
                                        "orders"
                                    )
                                }

                                className={`

px-5
py-3
rounded-xl

${extraTab === "orders"

                                        ?

                                        "bg-blue-600 text-white"

                                        :

                                        "bg-slate-100"

                                    }

`}

                            >

                                📋 Orders

                            </button>

                        </div>

                        {
                            extraTab === "payment"

                            &&

                            <div
                                className="
space-y-4
"
                            >

                                <h1
                                    className="
text-2xl
font-bold
"
                                >

                                    💳 Payment Setup

                                </h1>

                                <input

                                    type="text"

                                    placeholder="UPI Name"

                                    value={upiName}

                                    onChange={(e) =>

                                        setUpiName(
                                            e.target.value
                                        )

                                    }

                                    className="
w-full
p-4
border
rounded-xl
"
                                />

                                <input

                                    type="text"

                                    placeholder="UPI ID"

                                    value={upiId}

                                    onChange={(e) =>

                                        setUpiId(
                                            e.target.value
                                        )

                                    }

                                    className="
w-full
p-4
border
rounded-xl
"
                                />

                                <button

                                    onClick={
                                        savePaymentInfo
                                    }

                                    className="
bg-green-600
text-white
px-8
py-4
rounded-xl
"

                                >

                                    {

                                        user?.upiId

                                            ?

                                            "Update Payment Info"

                                            :

                                            "Save Payment Info"

                                    }

                                </button>

                            </div>

                        }
                        {
                            extraTab === "items"

                            &&

                            <div
                                className="
space-y-5
"
                            >

                                <h1
                                    className="
text-2xl
font-bold
"
                                >

                                    🍗 Extra Meal Items

                                </h1>

                                <select

                                    value={extraDay}

                                    onChange={(e) =>

                                        setExtraDay(
                                            e.target.value
                                        )

                                    }

                                    className="
w-full
p-4
border
rounded-xl
"

                                >

                                    {days.map(day => (

                                        <option
                                            key={day}
                                        >

                                            {day}

                                        </option>

                                    ))}

                                </select>

                                <select

                                    value={
                                        extraMealType
                                    }

                                    onChange={(e) =>

                                        setExtraMealType(
                                            e.target.value
                                        )

                                    }

                                    className="
w-full
p-4
border
rounded-xl
"

                                >

                                    <option value="breakfast">

                                        Breakfast

                                    </option>

                                    <option value="lunch">

                                        Lunch

                                    </option>

                                    <option value="dinner">

                                        Dinner

                                    </option>

                                </select>

                                <input

                                    type="text"

                                    placeholder="Item Name"

                                    value={extraName}

                                    onChange={(e) =>

                                        setExtraName(
                                            e.target.value
                                        )

                                    }

                                    className="
w-full
p-4
border
rounded-xl
"
                                />

                                <input

                                    type="number"

                                    placeholder="Price"

                                    value={extraPrice}

                                    onChange={(e) =>

                                        setExtraPrice(
                                            e.target.value
                                        )

                                    }

                                    className="
w-full
p-4
border
rounded-xl
"
                                />
                                <button

                                    onClick={

                                        editingExtraId

                                            ?

                                            updateExtraItem

                                            :

                                            saveExtraItem

                                    }

                                    className="
bg-green-600
text-white
px-8
py-4
rounded-xl
"

                                >

                                    {

                                        editingExtraId

                                            ?

                                            "Update Item"

                                            :

                                            "Save Item"

                                    }

                                </button>

                                <div
                                    className="
overflow-x-auto
rounded-xl
border
"
                                >

                                    <table
                                        className="
w-full
"
                                    >

                                        <thead>

                                            <tr
                                                className="
bg-slate-900
text-white
"
                                            >

                                                <th className="p-4">
                                                    Day
                                                </th>

                                                <th className="p-4">
                                                    Meal
                                                </th>

                                                <th className="p-4">
                                                    Item
                                                </th>

                                                <th className="p-4">
                                                    Price
                                                </th>

                                                <th className="p-4">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {

                                                extraItems.map(

                                                    item => (

                                                        <tr
                                                            key={item._id}
                                                            className="
border-b
hover:bg-slate-100
"
                                                        >

                                                            <td className="p-4">

                                                                {item.day}

                                                            </td>

                                                            <td className="p-4">

                                                                {item.mealType}

                                                            </td>

                                                            <td className="p-4">

                                                                {item.itemName}

                                                            </td>

                                                            <td className="p-4">

                                                                ₹{item.price}

                                                            </td>

                                                            <td
                                                                className="
p-4
flex
gap-2
"
                                                            >

                                                                <button

                                                                    onClick={() =>
                                                                        editExtraItem(
                                                                            item
                                                                        )
                                                                    }

                                                                    className="
bg-blue-500
text-white
px-3
py-2
rounded-lg
"

                                                                >

                                                                    ✏️

                                                                </button>

                                                                <button

                                                                    onClick={() =>

                                                                        deleteExtraItem(
                                                                            item._id
                                                                        )

                                                                    }

                                                                    className="
bg-red-500
text-white
px-3
py-2
rounded-lg
"

                                                                >

                                                                    🗑

                                                                </button>

                                                            </td>

                                                        </tr>

                                                    )

                                                )

                                            }

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        }
                        {
                            extraTab === "orders"

                            &&

                            <div
                                className="
space-y-4
"
                            >

                                <h1
                                    className="
text-2xl
font-bold
"
                                >

                                    📋 Extra Orders

                                </h1>

                                {

                                    orders.length === 0

                                        ?

                                        <p>

                                            No Orders

                                        </p>

                                        :

                                        orders.map(

                                            order => (

                                                <div

                                                    key={order._id}

                                                    className="
bg-slate-100
rounded-xl
p-5
space-y-3
"

                                                >

                                                    <p>

                                                        🆔

                                                        {order.studentId}

                                                    </p>

                                                    <p>

                                                        💰 ₹

                                                        {order.extraTotal}

                                                    </p>
                                                    <p>

                                                        💳 Transaction:

                                                        <b>

                                                            {

                                                                order.transactionId

                                                                ||

                                                                "Not Provided"

                                                            }

                                                        </b>

                                                    </p>
                                                    <div>

                                                        🍗 Items:

                                                        {
                                                            order.extraItems?.length > 0

                                                                ?

                                                                order.extraItems.map(

                                                                    item => (

                                                                        <div
                                                                            key={item.itemId}
                                                                            className="
bg-white
p-3
rounded-lg
mb-2
"
                                                                        >

                                                                            {item.itemName}

                                                                            x

                                                                            {item.quantity}

                                                                            —

                                                                            ₹{item.price * item.quantity}

                                                                        </div>

                                                                    )

                                                                )

                                                                :

                                                                <p>

                                                                    No extra items

                                                                </p>

                                                        }

                                                    </div>

                                                    <div
                                                        className={`

text-white
px-4
py-2
rounded-xl
inline-block

${order.orderStatus === "confirmed"

                                                                ?

                                                                "bg-green-500"

                                                                :

                                                                "bg-yellow-500"

                                                            }

`}

                                                    >

                                                        {

                                                            order.orderStatus === "confirmed"

                                                                ?

                                                                "✅ Confirmed"

                                                                :

                                                                "⏳ Waiting"

                                                        }

                                                    </div>

                                                    {

                                                        order.orderStatus !== "confirmed"

                                                        &&

                                                        <button

                                                            onClick={() =>

                                                                openOrder(
                                                                    order
                                                                )

                                                            }

                                                            className="
bg-blue-600
text-white
px-5
py-3
rounded-xl
"

                                                        >

                                                            👁 View

                                                        </button>

                                                    }

                                                </div>

                                            )

                                        )

                                }

                            </div>
                        }
                    </div>

                }
                {
                    activePage === "bookings"

                    &&

                    <div className="
bg-white
p-6
rounded-3xl
space-y-6
">

                        <h1 className="
text-3xl
font-bold
">

                            📋 Meal Attendance

                        </h1>


                        {/* Search */}

                        <div className="
flex
gap-3
flex-col
md:flex-row
">

                            <input
                                type="text"
                                placeholder="
Search Student ID / Name
"

                                value={bookingSearch}

                                onChange={(e) => {

                                    setBookingSearch(
                                        e.target.value
                                    );

                                }}

                                className="
flex-1
p-4
border
rounded-xl
"
                            />

                        </div>


                        {/* Attendance Table */}

                        <div className="
overflow-x-auto
rounded-3xl
border
">

                            <table className="
w-full
">

                                <thead>

                                    <tr className="
bg-slate-900
text-white
">

                                        <th className="
p-4
text-left
">

                                            ID

                                        </th>

                                        <th className="
p-4
text-left
">

                                            Name

                                        </th>

                                        <th className="
p-4
text-left
">

                                            Phone

                                        </th>

                                        <th className="
p-4
text-center
">

                                            🍳

                                        </th>

                                        <th className="
p-4
text-center
">

                                            🍛

                                        </th>

                                        <th className="
p-4
text-center
">

                                            🌙

                                        </th>

                                        <th className="
p-4
text-center
">

                                            Days Left

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        attendanceList

                                            .filter(student =>

                                                student.studentId
                                                    .toLowerCase()

                                                    .includes(

                                                        bookingSearch
                                                            .toLowerCase()

                                                    )

                                                ||

                                                student.name
                                                    .toLowerCase()

                                                    .includes(

                                                        bookingSearch
                                                            .toLowerCase()

                                                    )

                                            )

                                            .map(student => (

                                                <tr
                                                    key={student._id}

                                                    className="
border-b
hover:bg-slate-100
duration-300
"
                                                >

                                                    <td className="
p-4
font-semibold
">

                                                        {student.studentId}

                                                    </td>

                                                    <td className="
p-4
">

                                                        {student.name}

                                                    </td>

                                                    <td className="
p-4
">

                                                        {student.phone}

                                                    </td>


                                                    {/* Breakfast */}

                                                    <td className="
p-4
text-center
text-2xl
">

                                                        {

                                                            student.breakfast === true

                                                                ?

                                                                "✅"

                                                                :

                                                                student.breakfast === false

                                                                    ?

                                                                    "❌"

                                                                    :

                                                                    "⏳"

                                                        }

                                                    </td>


                                                    {/* Lunch */}

                                                    <td className="
p-4
text-center
text-2xl
">

                                                        {

                                                            student.lunch === true

                                                                ?

                                                                "✅"

                                                                :

                                                                student.lunch === false

                                                                    ?

                                                                    "❌"

                                                                    :

                                                                    "⏳"

                                                        }

                                                    </td>


                                                    {/* Dinner */}

                                                    <td className="
p-4
text-center
text-2xl
">

                                                        {

                                                            student.dinner === true

                                                                ?

                                                                "✅"

                                                                :

                                                                student.dinner === false

                                                                    ?

                                                                    "❌"

                                                                    :

                                                                    "⏳"

                                                        }

                                                    </td>


                                                    <td className="
p-4
text-center
font-bold
">

                                                        {

                                                            student.remainingDays

                                                        }

                                                    </td>

                                                </tr>

                                            ))

                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>
                }

            </div>
            {
                reactivateModal &&

                <div className="
fixed
inset-0
bg-black/50
flex
justify-center
items-center
z-50
">

                    <div className="
bg-white
p-6
rounded-3xl
w-[400px]
space-y-4
">

                        <h1 className="text-2xl font-bold">

                            🔄 Reactivate Student

                        </h1>

                        <input
                            type="date"
                            value={newStartDate}
                            onChange={(e) =>
                                setNewStartDate(
                                    e.target.value
                                )
                            }
                            className="
w-full
p-4
border
rounded-xl"
                        />

                        <input
                            type="date"
                            value={newEndDate}
                            onChange={(e) =>
                                setNewEndDate(
                                    e.target.value
                                )
                            }
                            className="
w-full
p-4
border
rounded-xl"
                        />

                        <div className="
flex
gap-4
">

                            <button
                                onClick={submitReactivate}
                                className="
flex-1
bg-green-500
text-white
p-4
rounded-xl"
                            >

                                Submit

                            </button>

                            <button
                                onClick={() =>
                                    setReactivateModal(false)
                                }
                                className="
flex-1
bg-red-500
text-white
p-4
rounded-xl"
                            >

                                Cancel

                            </button>

                        </div>

                    </div>

                </div>
            }
            {
                orderModal

                &&

                <div
                    className="
fixed
inset-0
bg-black/50
flex
justify-center
items-center
z-50
"
                >

                    <div
                        className="
bg-white
w-[500px]
max-h-[80vh]
overflow-y-auto
rounded-3xl
p-6
space-y-5
"
                    >

                        <div
                            className="
flex
justify-between
items-center
"
                        >

                            <h1
                                className="
text-2xl
font-bold
"
                            >

                                📋 Order Details

                            </h1>

                            <button

                                onClick={() =>

                                    setOrderModal(
                                        false
                                    )

                                }

                                className="
text-2xl
font-bold
"

                            >

                                ✕

                            </button>

                        </div>


                        <div
                            className="
bg-slate-100
rounded-xl
p-4
space-y-2
"
                        >

                            <p>

                                👤 Name:

                                <b>

                                    {selectedOrder?.student?.name}

                                </b>

                            </p>

                            <p>

                                📞 Phone:

                                <b>

                                    {selectedOrder?.student?.phone}

                                </b>

                            </p>

                            <p>

                                🆔 Student ID:

                                <b>

                                    {selectedOrder?.studentId}

                                </b>

                            </p>

                            <p>

                                📅 Order Date:

                                <b>

                                    {

                                        new Date(

                                            selectedOrder?.createdAt

                                        ).toLocaleString()

                                    }

                                </b>

                            </p>

                        </div>


                        <p>

                            💰 Amount:

                            <b>

                                ₹{selectedOrder?.extraTotal}

                            </b>

                        </p>


                        <p>

                            💳 Transaction:

                            <b>

                                {

                                    selectedOrder?.transactionId

                                    ||

                                    "Not Provided"

                                }

                            </b>

                        </p>


                        <div>

                            <h2
                                className="
font-bold
mb-3
"
                            >

                                🍗 Items

                            </h2>

                            {

                                selectedOrder?.extraItems?.map(

                                    item => (

                                        <div

                                            key={item.itemId}

                                            className="
bg-slate-100
rounded-xl
p-3
mb-2
"
                                        >

                                            {item.itemName}

                                            x

                                            {item.quantity}

                                            —

                                            ₹

                                            {

                                                item.price *

                                                item.quantity

                                            }

                                        </div>

                                    )

                                )

                            }

                        </div>


                        {

                            selectedOrder?.orderStatus

                            !==

                            "confirmed"

                            &&

                            <button

                                onClick={() =>

                                    confirmOrder(

                                        selectedOrder._id

                                    )

                                }

                                className="
w-full
bg-green-600
text-white
p-4
rounded-xl
"

                            >

                                ✅ Confirm Order

                            </button>

                        }

                    </div>

                </div>

            }
        </div >

    )

}

export default OwnerDashboard;