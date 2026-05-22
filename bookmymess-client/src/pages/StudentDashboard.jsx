import { useNavigate } from "react-router-dom";

function StudentDashboard() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/");

    }

    return (

        <div className="min-h-screen bg-slate-100 p-8">

            <div className="
bg-white
rounded-3xl
p-8
shadow
">

                <h1 className="text-3xl font-bold">

                    👨‍🎓 Student Dashboard

                </h1>

                <p className="mt-2 text-gray-500">

                    Welcome {user?.name}

                </p>

                <div className="
grid
md:grid-cols-3
gap-6
mt-10
">

                    <div className="
bg-blue-500
text-white
p-6
rounded-3xl
">

                        🍛 Today's Menu

                    </div>

                    <div className="
bg-green-500
text-white
p-6
rounded-3xl
">

                        📋 Book Meal

                    </div>

                    <div className="
bg-red-500
text-white
p-6
rounded-3xl
cursor-pointer
"
                        onClick={logout}
                    >

                        🚪 Logout

                    </div>

                </div>

            </div>

        </div>

    )

}

export default StudentDashboard;