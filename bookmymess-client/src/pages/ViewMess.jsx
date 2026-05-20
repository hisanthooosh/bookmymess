import { useEffect, useState }
    from "react";

import API from "../services/api";

function ViewMess() {

    const [messes, setMesses] =
        useState([]);

    useEffect(() => {

        fetchMesses();

    }, []);

    const fetchMesses =
        async () => {

            try {

                const res =
                    await API.get(
                        "/mess/all"
                    );

                setMesses(
                    res.data.messes
                );

            }
            catch (error) {

                console.log(
                    error
                );

            }

        }

    return (

        <div className="p-10">

            <h1
                className="text-3xl font-bold mb-5"
            >

                All Messes

            </h1>

            {

                messes.map((mess) => (

                    <div
                        key={mess._id}
                        className="border p-4 rounded mb-3"
                    >

                        <h2>{mess.messName}</h2>

                        <p>
                            Owner:
                            {mess.ownerName}
                        </p>

                        <p>
                            Phone:
                            {mess.ownerPhone}
                        </p>

                        <p>
                            Address:
                            {mess.address}
                        </p>

                    </div>

                ))

            }

        </div>

    )

}

export default ViewMess;