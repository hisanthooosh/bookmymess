import { useState } from "react";
import API from "../services/api";

function AddMess() {

    const [formData, setFormData] = useState({

        messName: "",
        ownerName: "",
        ownerPhone: "",
        address: ""

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await API.post(
                "/mess/add",
                formData
            );

            alert(
                res.data.message
            );

            setFormData({

                messName: "",
                ownerName: "",
                ownerPhone: "",
                address: ""

            });

        }
        catch (error) {

            alert(
                error.response?.data?.message
                || "Something went wrong"
            );

        }

    };

    return (

        <div className="p-10">

            <h1 className="text-2xl font-bold mb-5">

                Add Mess

            </h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 w-[400px]"
            >

                <input
                    name="messName"
                    placeholder="Mess Name"
                    value={formData.messName}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="ownerName"
                    placeholder="Owner Name"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="ownerPhone"
                    placeholder="Owner Phone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <button
                    className="bg-black text-white p-2 rounded"
                >

                    Add Mess

                </button>

            </form>

        </div>

    );

}

export default AddMess;