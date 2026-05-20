import { Link } from "react-router-dom";

function Dashboard() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (

        <div className="p-10">

            <h1 className="text-3xl font-bold">

                Welcome {user?.name}

            </h1>

            <p>Role: {user?.role}</p>

            <Link
                to="/add-mess"
                className="bg-black text-white px-4 py-2 rounded mt-5 inline-block"
            >

                Add Mess

            </Link>
            <Link
                to="/view-mess"
                className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
            >

                View Messes

            </Link>

        </div>

    )

}

export default Dashboard;