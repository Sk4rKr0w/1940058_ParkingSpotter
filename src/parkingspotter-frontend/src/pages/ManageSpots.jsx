import { NavLink } from "react-router-dom";

const ManageSpots = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 ">
            <div className="w-full p-4 md:p-10 flex flex-col md:flex-row justify-between items-center mb-8 bg-gradient-to-bl from-blue-500 to-indigo-600 text-white shadow-lg">
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
                        Manage Your Parking Spots
                    </h1>
                    <p className="text-lg text-black max-w-prose">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Soluta ea, eveniet nisi ipsum adipisci voluptas hic
                        reiciendis reprehenderit numquam? Temporibus id enim
                        culpa assumenda neque.
                    </p>
                </div>
                <NavLink
                    to="/add-spot"
                    className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 md:px-10 md:py-4 rounded-full text-lg font-semibold transition"
                >
                    Add Parking Spot
                </NavLink>
            </div>
            {/* Add your parking spot management UI here */}
            <h1>
                FARE CHIAMATA API PER OTTENERE TUTTI I PARCHEGGI DA ME POSSEDUTI
            </h1>
            <div>
                <p>LISTA DEI PARCHEGGI</p>
                <p>OGNI PARCHEGGIO AVRA' UN PULSANTE PER MODIFICARLO</p>
                <p>OGNI PARCHEGGIO AVRA' UN PULSANTE PER ELIMINARLO</p>
                <p>
                    OGNI PARCHEGGIO AVRA' UN PULSANTE PER VEDERE LE STATISTICHE
                </p>
            </div>
        </div>
    );
};

export default ManageSpots;
