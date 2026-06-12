import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const res = await API.post(
                "/api/auth/login",
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

            if (res.data.user.role === "superadmin") {

                navigate("/dashboard");

            }
            else if (
                res.data.user.role === "owner"
            ) {

                navigate(
                    "/owner-dashboard"
                );

            }
            else if (
                res.data.user.role === "student"
            ) {

                const user = res.data.user;

                const today = new Date();

                const hasSubscription =

                    user.subscriptionActive &&

                    user.subscriptionEndDate &&

                    new Date(
                        user.subscriptionEndDate
                    ) > today;

                if (hasSubscription) {

                    navigate(
                        "/student-dashboard"
                    );

                }
                else {

                    navigate(
                        "/subscription"
                    );

                }

            }

        }
        catch (error) {

            alert(
                error.response?.data?.message
                || "Something went wrong"
            );

        }
        finally {

            setLoading(false);

        }

    }

    return (

        <div
            className="min-h-screen 
        bg-gradient-to-br
        from-slate-950
        via-gray-900
        to-black
        flex
        justify-center
        items-center
        px-5"
        >

            <div
                className="w-full
            max-w-md
            bg-white/10
            backdrop-blur-xl
            border
            border-white/20
            rounded-[30px]
            p-8
            shadow-2xl"
            >

                <div className="text-center mb-8">

                    <div
                        className="w-20
                    h-20
                    rounded-full
                    bg-white
                    flex
                    items-center
                    justify-center
                    mx-auto
                    mb-4"
                    >

                        <span
                            className="text-3xl"
                        >
                            🍽️
                        </span>

                    </div>

                    <h1
                        className="text-4xl
                    font-bold
                    text-white"
                    >
                        BookMyMess
                    </h1>

                    <p
                        className="text-gray-300 mt-2"
                    >
                        Smart Meal Booking Platform
                    </p>

                </div>

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    <div>

                        <label
                            className="text-gray-300
                        text-sm"
                        >
                            Phone Number
                        </label>

                        <input
                            type="text"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            className="
                        w-full
                        mt-2
                        p-4
                        rounded-xl
                        bg-white/10
                        border
                        border-gray-500
                        text-white
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label
                            className="text-gray-300
                        text-sm"
                        >
                            Passcode
                        </label>

                        <input
                            type="password"
                            placeholder="Enter passcode"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            className="
                        w-full
                        mt-2
                        p-4
                        rounded-xl
                        bg-white/10
                        border
                        border-gray-500
                        text-white
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                    w-full
                    p-4
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    text-white
                    font-semibold
                    hover:scale-[1.02]
                    duration-300
                    disabled:opacity-50"
                    >

                        {
                            loading
                                ?
                                "Logging in..."
                                :
                                "Login"
                        }

                    </button>

                </form>

                <div
                    className="mt-8
                text-center
                text-sm
                text-gray-400"
                >

                    Book smarter • Reduce food wastage

                </div>
                <div
                    className="
mt-8
pt-6
border-t
border-white/10
text-center
"
                >

                    <p
                        className="
text-gray-400
text-sm
mb-4
px-2
"
                    >
                        Book smarter • Reduce food wastage
                    </p>

                    <div
                        className="
flex
flex-wrap
justify-center
items-center
gap-x-6
gap-y-3
text-xs
sm:text-sm
text-gray-300
px-2
"
                    >

                        <a
                            href="/privacy-policy"
                            className="
hover:text-white
duration-300
"
                        >
                            Privacy Policy
                        </a>

                        <a
                            href="/terms-and-conditions"
                            className="
hover:text-white
duration-300
"
                        >
                            Terms & Conditions
                        </a>

                        <a
                            href="/refund-policy"
                            className="
hover:text-white
duration-300
"
                        >
                            Refund Policy
                        </a>

                        <a
                            href="/contact-us"
                            className="
hover:text-white
duration-300
"
                        >
                            Contact Us
                        </a>

                    </div>

                    <div
                        className="
mt-4
space-y-1
text-xs
text-gray-500
px-2
"
                    >

                        <p>
                            © 2026 BookMyMess
                        </p>

                        <p>
                            Doneswari Technologies LLP
                        </p>

                    </div>

                </div>
            </div>

        </div>

    );

}

export default Login;