import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

function OwnerDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [activePage, setActivePage] = useState("dashboard");

  const [selectedDay, setSelectedDay] = useState("Sunday");

  const [breakfast, setBreakfast] = useState([""]);

  const [lunch, setLunch] = useState([""]);

  const [dinner, setDinner] = useState([""]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [savedMenus, setSavedMenus] = useState([]);

  const [studentName, setStudentName] = useState("");

  const [studentPhone, setStudentPhone] = useState("");

  const [studentPassword, setStudentPassword] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.info("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const addItem = (type) => {
    if (type === "breakfast") {
      setBreakfast([...breakfast, ""]);
    }

    if (type === "lunch") {
      setLunch([...lunch, ""]);
    }

    if (type === "dinner") {
      setDinner([...dinner, ""]);
    }
  };

  const updateItem = (type, index, value) => {
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
  };

  const removeItem = (type, index) => {
    if (type === "breakfast") {
      setBreakfast(breakfast.filter((_, i) => i !== index));
    }

    if (type === "lunch") {
      setLunch(lunch.filter((_, i) => i !== index));
    }

    if (type === "dinner") {
      setDinner(dinner.filter((_, i) => i !== index));
    }
  };

  const saveMenu = async () => {
    try {
      await API.post("/menu/save", {
        messId: user.messId,

        day: selectedDay,

        breakfast: breakfast.filter((item) => item.trim()),

        lunch: lunch.filter((item) => item.trim()),

        dinner: dinner.filter((item) => item.trim()),
      });

      await fetchMenus();

      toast.success("Menu Saved Successfully 🎉");
    } catch (error) {
      toast.error("Failed to save menu ❌");
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await API.get(`/menu/${user.messId}`);

      const daysOrder = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const sortedMenus = res.data.menus.sort(
        (a, b) =>
          daysOrder.indexOf(a.day) -
          daysOrder.indexOf(b.day)
      );

      setSavedMenus(sortedMenus);
    } catch (error) {
      toast.error("Failed to fetch menu ❌");
    }
  };

  const deleteMenu = async (day) => {
    try {
      await API.delete(`/menu/delete/${user.messId}/${day}`);

      toast.success(`${day} menu deleted 🗑️`);

      fetchMenus();

      if (selectedDay === day) {
        setBreakfast([""]);
        setLunch([""]);
        setDinner([""]);
      }
    } catch (error) {
      toast.error("Failed to delete menu ❌");
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    const menu = savedMenus.find(
      (item) => item.day === selectedDay
    );

    if (menu) {
      setBreakfast(menu.breakfast);

      setLunch(menu.lunch);

      setDinner(menu.dinner);
    } else {
      setBreakfast([""]);
      setLunch([""]);
      setDinner([""]);
    }
  }, [selectedDay, savedMenus]);

  const addStudent = async () => {
    try {
      await API.post("/student/add", {
        name: studentName,
        phone: studentPhone,
        password: studentPassword,
        messId: user.messId,
      });

      toast.success("Student Added Successfully 🎉");

      setStudentName("");
      setStudentPhone("");
      setStudentPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add student");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 relative">
      {sidebarOpen && (
        <div
          className="
fixed
inset-0
bg-black/50
z-40
lg:hidden
"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}

      <div
        className={`
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

${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

lg:translate-x-0
`}
      >
        <div>
          <h1 className="text-3xl font-bold">🍽 Owner Panel</h1>

          <p className="text-gray-400 mt-2">{user?.name}</p>

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

      <div
        className="
flex-1
lg:ml-[280px]
p-4
md:p-8
overflow-x-hidden
"
      >
        {/* Navbar */}

        <div
          className="
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
"
        >
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-3xl"
              onClick={() => setSidebarOpen(true)}
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

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <h2 className="font-bold text-lg text-slate-800">
                {user?.name}
              </h2>

              <p className="text-sm text-gray-500">
                Mess Owner
              </p>
            </div>

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

        {/* Dashboard */}

        {activePage === "dashboard" && (
          <div>
            <h1 className="text-4xl font-bold">
              Welcome {user?.name}
            </h1>

            <p className="text-gray-500 mt-2">
              Here is today's mess menu 🍛
            </p>

            <div className="mt-8">
              {(() => {
                const today = new Date().toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                  }
                );

                const todayMenu = savedMenus.find(
                  (menu) => menu.day === today
                );

                if (!todayMenu) {
                  return (
                    <div className="bg-white p-8 rounded-3xl shadow">
                      <h2 className="text-2xl font-bold text-red-500">
                        No Menu Added For Today
                      </h2>
                    </div>
                  );
                }

                return (
                  <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
                    <h2 className="text-3xl font-bold">
                      📅 {today}
                    </h2>

                    {/* Breakfast */}

                    <div className="mt-8 bg-orange-50 p-6 rounded-3xl">
                      <h3 className="text-2xl font-bold">
                        🍳 Breakfast
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {todayMenu.breakfast.map((item, index) => (
                          <div
                            key={index}
                            className="
bg-white
px-5
py-3
rounded-2xl
shadow
"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lunch */}

                    <div className="mt-6 bg-green-50 p-6 rounded-3xl">
                      <h3 className="text-2xl font-bold">
                        🍛 Lunch
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {todayMenu.lunch.map((item, index) => (
                          <div
                            key={index}
                            className="
bg-white
px-5
py-3
rounded-2xl
shadow
"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dinner */}

                    <div className="mt-6 bg-blue-50 p-6 rounded-3xl">
                      <h3 className="text-2xl font-bold">
                        🌙 Dinner
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-3">
                        {todayMenu.dinner.map((item, index) => (
                          <div
                            key={index}
                            className="
bg-white
px-5
py-3
rounded-2xl
shadow
"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Students */}

        {activePage === "students" && (
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
                  setStudentName(e.target.value)
                }
                className="w-full p-4 border rounded-xl"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={studentPhone}
                onChange={(e) =>
                  setStudentPhone(e.target.value)
                }
                className="w-full p-4 border rounded-xl"
              />

              <input
                type="password"
                placeholder="6 Digit Password"
                value={studentPassword}
                onChange={(e) =>
                  setStudentPassword(e.target.value)
                }
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
"
              >
                Add Student
              </button>
            </div>
          </div>
        )}

        {/* Menu */}

        {activePage === "menu" && (
          <div
            className="
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
"
          >
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold">
                🍛 Weekly Menu
              </h1>

              <p className="text-gray-500 mt-2">
                Create and manage weekly menu
              </p>
            </div>

            {/* Day Select */}

            <div>
              <label className="font-semibold">
                Select Day
              </label>

              <select
                value={selectedDay}
                onChange={(e) =>
                  setSelectedDay(e.target.value)
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

            {/* Meals */}

            {[
              {
                title: "🍳 Breakfast",
                data: breakfast,
                type: "breakfast",
              },
              {
                title: "🍛 Lunch",
                data: lunch,
                type: "lunch",
              },
              {
                title: "🌙 Dinner",
                data: dinner,
                type: "dinner",
              },
            ].map((meal) => (
              <div
                key={meal.type}
                className="mt-8 bg-slate-50 p-6 rounded-3xl"
              >
                <div
                  className="
flex
flex-col
sm:flex-row
justify-between
gap-4
items-center
"
                >
                  <h2 className="font-bold text-xl">
                    {meal.title}
                  </h2>

                  <button
                    onClick={() => addItem(meal.type)}
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
                  {meal.data.map((item, index) => (
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
                          removeItem(meal.type, index)
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
                  ))}
                </div>
              </div>
            ))}

            {/* Save Button */}

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
              📋 Save Menu
            </button>

            {/* Saved Weekly Menus */}

            <div className="mt-14">
              <h1 className="text-3xl font-bold">
                📅 Saved Weekly Menus
              </h1>

              <div
                className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
mt-8
"
              >
                {savedMenus.length === 0 ? (
                  <div className="bg-slate-100 p-8 rounded-3xl">
                    <p className="text-gray-500">
                      No menu added yet
                    </p>
                  </div>
                ) : (
                  savedMenus.map((menu, index) => (
                    <div
                      key={index}
                      className="
bg-slate-100
rounded-3xl
p-6
shadow
relative
"
                    >
                      {/* Delete Button */}

                      <button
                        onClick={() =>
                          deleteMenu(menu.day)
                        }
                        className="
absolute
top-4
right-4
bg-red-500
hover:bg-red-600
text-white
px-4
py-2
rounded-xl
"
                      >
                        Delete
                      </button>

                      <h2 className="text-2xl font-bold">
                        📅 {menu.day}
                      </h2>

                      {/* Breakfast */}

                      <div className="mt-5">
                        <h3 className="font-bold text-lg">
                          🍳 Breakfast
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {menu.breakfast.map((item, i) => (
                            <div
                              key={i}
                              className="
bg-white
px-4
py-2
rounded-xl
shadow-sm
"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Lunch */}

                      <div className="mt-5">
                        <h3 className="font-bold text-lg">
                          🍛 Lunch
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {menu.lunch.map((item, i) => (
                            <div
                              key={i}
                              className="
bg-white
px-4
py-2
rounded-xl
shadow-sm
"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dinner */}

                      <div className="mt-5">
                        <h3 className="font-bold text-lg">
                          🌙 Dinner
                        </h3>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {menu.dinner.map((item, i) => (
                            <div
                              key={i}
                              className="
bg-white
px-4
py-2
rounded-xl
shadow-sm
"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}

        {activePage === "bookings" && (
          <div className="bg-white p-6 rounded-3xl">
            Meal Bookings
          </div>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;