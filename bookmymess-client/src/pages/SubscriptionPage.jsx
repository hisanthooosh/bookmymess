import {
    useState,
    useEffect
} from "react";
import API from "../services/api";

function SubscriptionPage() {

    const [selectedPlan,
        setSelectedPlan] =
        useState("3_months");

    const plans = [

        {
            id: "3_months",
            name: "3 Months",
            price: 30
        },

        {
            id: "1_month",
            name: "1 Month",
            price: 10
        },

        {
            id: "6_months",
            name: "6 Months",
            price: 60
        },

        {
            id: "12_months",
            name: "12 Months",
            price: 120
        }

    ];
    const handlePayment = async () => {

        try {

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
                            localStorage.getItem(
                                "user"
                            )
                        );

                        const verifyRes =
                            await API.post(

                                "/subscription/verify-payment",

                                {

                                    userId:
                                        user._id,

                                    plan:
                                        selectedPlan,

                                    razorpay_order_id:
                                        response.razorpay_order_id,

                                    razorpay_payment_id:
                                        response.razorpay_payment_id,

                                    razorpay_signature:
                                        response.razorpay_signature

                                }

                            );

                        if (
                            verifyRes.data.success
                        ) {

                            user.subscriptionActive =
                                true;

                            localStorage.setItem(

                                "user",

                                JSON.stringify(user)

                            );

                            alert(
                                "Subscription Activated"
                            );

                            window.location.href =
                                "/student-dashboard";

                        }

                    }

                    catch (error) {

                        console.error(error);

                        alert(
                            "Payment verification failed"
                        );

                    }

                },

                theme: {
                    color: "#2563eb"
                }

            };

            const razorpay =

                new window.Razorpay(
                    options
                );

            razorpay.open();

        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to start payment"
            );

        }

    };
    useEffect(() => {

        const script = document.createElement(
            "script"
        );

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        document.body.appendChild(
            script
        );

    }, []);
    return (

        <div
            className="
min-h-screen
bg-gradient-to-br
from-slate-950
via-gray-900
to-black
flex
justify-center
items-center
p-5
"
        >

            <div
                className="
w-full
max-w-lg
bg-white/10
backdrop-blur-xl
border
border-white/20
rounded-3xl
p-8
"
            >

                <h1
                    className="
text-3xl
font-bold
text-white
text-center
"
                >
                    BookMyMess
                </h1>

                <p
                    className="
text-center
text-gray-300
mt-3
mb-8
"
                >
                    Choose a subscription plan
                </p>

                <div className="space-y-4">

                    {
                        plans.map(plan => (

                            <div
                                key={plan.id}
                                onClick={() =>
                                    setSelectedPlan(
                                        plan.id
                                    )
                                }
                                className={`
cursor-pointer
rounded-2xl
p-4
border
${selectedPlan === plan.id
                                        ? "border-green-500 bg-green-500/20"
                                        : "border-white/20 bg-white/5"
                                    }
`}
                            >

                                <div
                                    className="
flex
justify-between
items-center
"
                                >

                                    <div>

                                        <h3
                                            className="
text-white
font-bold
"
                                        >
                                            {plan.name}
                                        </h3>

                                    </div>

                                    <div
                                        className="
text-white
font-bold
text-xl
"
                                    >
                                        ₹{plan.price}
                                    </div>

                                </div>

                            </div>

                        ))
                    }

                </div>

                <button
                    onClick={handlePayment}
                    className="
w-full
mt-8
bg-blue-600
hover:bg-blue-700
text-white
font-bold
py-4
rounded-2xl
"

                >
                    Continue To Payment
                </button>

            </div>

        </div>

    );

}

export default SubscriptionPage;