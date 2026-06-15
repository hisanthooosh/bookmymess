import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [deferredPrompt, setDeferredPrompt] =
        useState(null);

    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("3_months");
    const [paymentLoading, setPaymentLoading] = useState(false);
    const installApp = async () => {

        if (deferredPrompt) {

            deferredPrompt.prompt();

            await deferredPrompt.userChoice;

        } else {

            alert(
                "For iPhone: Share → Add to Home Screen"
            );

        }

    };
    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

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

                    navigate("/student-dashboard");

                }
                else {
                    setShowSubscriptionModal(true);

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

    };

    useEffect(() => {

        const handler = (e) => {

            e.preventDefault();

            setDeferredPrompt(e);

        };

        window.addEventListener(
            "beforeinstallprompt",
            handler
        );
        const script = document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        document.body.appendChild(script);
        return () => {

            window.removeEventListener(
                "beforeinstallprompt",
                handler
            );

        };

    }, []);

    const handleSubscriptionPayment = async () => {

        try {

            setPaymentLoading(true);

            const res = await API.post(
                "/subscription/create-order",
                {
                    plan: selectedPlan
                }
            );

            const { order, key } = res.data;

            const options = {

                key,

                amount: order.amount,

                currency: order.currency,

                name: "BookMyMess",

                description: "Student Subscription",

                order_id: order.id,

                handler: async function (response) {

                    try {

                        const user = JSON.parse(
                            localStorage.getItem("user")
                        );

                        const verifyRes =
                            await API.post(
                                "/subscription/verify-payment",
                                {
                                    userId: user._id,
                                    plan: selectedPlan,
                                    razorpay_order_id:
                                        response.razorpay_order_id,
                                    razorpay_payment_id:
                                        response.razorpay_payment_id,
                                    razorpay_signature:
                                        response.razorpay_signature
                                }
                            );

                        if (verifyRes.data.success) {
                            const updatedUser = {

                                ...user,

                                subscriptionActive: true,

                                subscriptionPlan: selectedPlan

                            };

                            localStorage.setItem(
                                "user",
                                JSON.stringify(updatedUser)
                            );

                            setShowSubscriptionModal(false);

                            navigate("/student-dashboard");

                        }

                    }

                    catch (error) {

                        alert("Payment verification failed");

                    }

                }

            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        }

        catch (error) {

            alert("Unable to start payment");

        }

        finally {

            setPaymentLoading(false);

        }

    };
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
                        className="
w-24
h-24
rounded-3xl
bg-white
flex
items-center
justify-center
mx-auto
mb-5
shadow-xl
overflow-hidden
"
                    >

                        <img
                            src="/icon.jpg"
                            alt="BookMyMess"
                            className="
w-full
h-full
object-cover
"
                        />

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
                <button
                    type="button"
                    onClick={installApp}
                    className="
w-full
mt-3
p-4
rounded-xl
bg-green-600
hover:bg-green-700
text-white
font-semibold
"
                >
                    📱 Get The App
                </button>
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
            {
                showSubscriptionModal && (

                    <div className="
fixed
inset-0
bg-black/80
backdrop-blur-sm
flex
justify-center
items-center
z-50
p-4
">

                        <div className="
w-full
max-w-md
bg-gradient-to-br
from-slate-900
to-slate-800
border
border-slate-700
rounded-3xl
p-6
shadow-2xl
">

                            <div className="text-center mb-6">

                                <div className="
w-16
h-16
mx-auto
mb-4
rounded-2xl
bg-blue-600/20
flex
items-center
justify-center
text-3xl
">
                                    🍽️
                                </div>

                                <h2 className="
text-3xl
font-bold
text-white
mb-2
">
                                    BookMyMess Premium
                                </h2>

                                <p className="
text-gray-300
text-sm
leading-6
">
                                    Activate your subscription to continue
                                    booking meals and managing your mess
                                    seamlessly.
                                </p>

                            </div>

                            <div className="space-y-3">

                                <div
                                    onClick={() => setSelectedPlan("1_month")}
                                    className={`
cursor-pointer
p-4
rounded-2xl
border
transition-all
duration-300
${selectedPlan === "1_month"
                                            ? "border-green-500 bg-green-500/20"
                                            : "border-slate-600 hover:border-slate-500"
                                        }
`}
                                >
                                    <div className="flex justify-between items-center text-white">
                                        <span>1 Month</span>
                                        <span className="font-bold">₹10</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSelectedPlan("3_months")}
                                    className={`
cursor-pointer
p-4
rounded-2xl
border
transition-all
duration-300
${selectedPlan === "3_months"
                                            ? "border-green-500 bg-green-500/20"
                                            : "border-slate-600 hover:border-slate-500"
                                        }
`}
                                >
                                    <div className="flex justify-between items-center text-white">
                                        <span>3 Months</span>
                                        <span className="font-bold">₹30</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSelectedPlan("6_months")}
                                    className={`
cursor-pointer
p-4
rounded-2xl
border
transition-all
duration-300
${selectedPlan === "6_months"
                                            ? "border-green-500 bg-green-500/20"
                                            : "border-slate-600 hover:border-slate-500"
                                        }
`}
                                >
                                    <div className="flex justify-between items-center text-white">
                                        <span>6 Months</span>
                                        <span className="font-bold">₹60</span>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setSelectedPlan("12_months")}
                                    className={`
cursor-pointer
p-4
rounded-2xl
border
transition-all
duration-300
${selectedPlan === "12_months"
                                            ? "border-green-500 bg-green-500/20"
                                            : "border-slate-600 hover:border-slate-500"
                                        }
`}
                                >
                                    <div className="flex justify-between items-center text-white">
                                        <span>12 Months</span>
                                        <span className="font-bold">₹120</span>
                                    </div>
                                </div>

                            </div>

                            <button
                                onClick={handleSubscriptionPayment}
                                disabled={paymentLoading}
                                className="
w-full
mt-6
bg-gradient-to-r
from-blue-600
to-indigo-600
hover:from-blue-700
hover:to-indigo-700
text-white
font-bold
py-4
rounded-2xl
transition-all
duration-300
"
                            >

                                {
                                    paymentLoading
                                        ? "Opening Razorpay..."
                                        : "🔒 Secure Payment"
                                }

                            </button>

                            <p className="
text-center
text-xs
text-gray-400
mt-4
">
                                Secure payments powered by Razorpay
                            </p>

                        </div>

                    </div>

                )
            }
        </div>

    );

}

export default Login;