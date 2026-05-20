import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post(
                "/auth/login",
                {
                    phone,
                    password
                }
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    res.data.user
                )
            );

            console.log(res.data);

            navigate("/dashboard");

        }
        catch (error) {

            alert(
                error.response?.data?.message
                || "Something went wrong"
            );

        }

    }

    return (

        <div className="min-h-screen flex justify-center items-center bg-gray-100">

            <div className="bg-white shadow-lg p-8 rounded-lg w-[350px]">

                <h1 className="text-3xl font-bold mb-2 text-center">

                    BookMyMess

                </h1>

                <p className="text-center text-gray-500 mb-6">

                    Login to continue

                </p>

                <form onSubmit={handleLogin}>

                    <input
                        type="text"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
                        }
                        className="border w-full p-3 mb-4 rounded"
                    />

                    <input
                        type="password"
                        placeholder="Passcode"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="border w-full p-3 mb-4 rounded"
                    />

                    <button
                        type="submit"
                        className="bg-black text-white w-full p-3 rounded"
                    >

                        Login

                    </button>

                </form>

            </div>

        </div>

    );

}

export default Login;