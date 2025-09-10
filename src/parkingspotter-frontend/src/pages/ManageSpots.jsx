import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import EditSpotModal from "../components/EditSpotModal";

const ManageSpots = () => {
    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParking, setEditingParking] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        totalSpots: "",
        hourlyPrice: "",
    });
    useEffect(() => {
        const fetchParkings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `http://localhost:4002/parkings/list`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setParkings(res.data);

                // Dopo aver caricato i parkings, carico le stats per ognuno

                const statsPromises = res.data.map((p) =>
                    axios
                        .get(`http://localhost:4002/parkings/${p.id}/stats`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })
                        .then((r) => ({ id: p.id, data: r.data }))
                );

                const statsResults = await Promise.all(statsPromises);
                const statsMap = {};
                statsResults.forEach((s) => {
                    statsMap[s.id] = s.data;
                });
                setStats(statsMap);
            } catch (err) {
                setError("Failed to load parkings.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchParkings();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this parking?"))
            return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:4002/parking/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setParkings((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            alert("Failed to delete parking.");
            console.error(err);
        }
    };

    const handleEditClick = (parking) => {
        setEditingParking(parking);
        setFormData({
            name: parking.name,
            type: parking.type,
            totalSpots: parking.totalSpots,
            hourlyPrice: parking.hourlyPrice,
        });
        console.log(parking.id);
        setIsModalOpen(true);
    };

    const filteredParkings = parkings.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCoordinatesFromAddress = async (address) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                address
            )}`
        );
        const data = await res.json();
        if (data.length > 0) {
            return { latitude: data[0].lat, longitude: data[0].lon };
        }
        throw new Error("Address not found");
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="w-full p-4 md:p-10 flex flex-col md:flex-row justify-between items-center mb-8 bg-gradient-to-bl from-blue-500 to-indigo-600 text-white shadow-lg">
                <div>
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
                        Manage Your Parking Spots
                    </h1>
                    <p className="text-lg text-white max-w-prose">
                        Here you can view, edit, or delete your parking spots
                        and check their statistics.
                    </p>
                </div>
                <NavLink
                    to="/add-spot"
                    className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 md:px-10 md:py-4 rounded-full text-lg font-semibold transition"
                >
                    Add Parking Spot
                </NavLink>
            </div>

            {/* Search bar */}
            <div className="w-full px-4 mb-6 flex justify-center items-center">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 p-3 rounded-3xl border-2 border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Parking list section */}
            <div className="w-full p-4">
                {loading ? (
                    <p className="text-gray-600 text-center text-lg">
                        Loading parkings...
                    </p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : filteredParkings.length === 0 ? (
                    <p className="text-gray-500 text-center italic">
                        No parkings found.
                    </p>
                ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredParkings.map((p) => (
                            <li
                                key={p.id}
                                className="bg-white shadow-md rounded-xl p-4 md:p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {p.name}
                                    </h2>
                                    <p className="text-gray-600 text-sm">
                                        Address:{" "}
                                        <span className="font-medium">
                                            {p.address || "N/A"}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Type:{" "}
                                        <span className="font-medium">
                                            {p.type.charAt(0).toUpperCase() +
                                                p.type.slice(1)}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Total Spots:{" "}
                                        <span className="font-medium">
                                            {p.totalSpots}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Hourly Price:{" "}
                                        <span className="font-medium">
                                            €{p.hourlyPrice}
                                        </span>
                                    </p>
                                </div>
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="my-2 flex gap-2 md:gap-4">
                                        <p className="text-gray-600 text-sm flex flex-col">
                                            Occupied Spots:{" "}
                                            <span className="font-medium">
                                                {stats[p.id]?.occupiedSpots ??
                                                    "Loading..."}
                                            </span>
                                        </p>
                                        <p className="text-gray-600 text-sm flex flex-col">
                                            Utilization:{" "}
                                            <span className="font-medium">
                                                {stats[p.id]
                                                    ? `${stats[
                                                          p.id
                                                      ].utilizationRate.toFixed(
                                                          1
                                                      )}%`
                                                    : "Loading..."}
                                            </span>
                                        </p>
                                        <p className="text-gray-600 text-sm flex flex-col">
                                            Active Reservations:{" "}
                                            <span className="font-medium">
                                                {stats[p.id]
                                                    ?.activeReservations ??
                                                    "Loading..."}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-3 flex-grow">
                                        <button
                                            onClick={() => handleEditClick(p)}
                                            className="cursor-pointer flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                        >
                                            Edit Spot
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                                        >
                                            Delete Spot
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* Modal */}
            <EditSpotModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                parking={editingParking}
                onSave={async (updatedData) => {
                    try {
                        const { latitude, longitude } =
                            await getCoordinatesFromAddress(
                                updatedData.address
                            );
                        const token = localStorage.getItem("token");
                        await axios.post(
                            `http://localhost:4002/parkings/${editingParking.id}`,
                            { ...updatedData, latitude, longitude },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        setParkings((prev) =>
                            prev.map((p) =>
                                p.id === editingParking.id
                                    ? {
                                          ...p,
                                          ...updatedData,
                                          latitude,
                                          longitude,
                                      }
                                    : p
                            )
                        );
                        setIsModalOpen(false);
                    } catch (err) {
                        alert("Failed to update parking.");
                        console.error(err);
                    }
                }}
            />
        </div>
    );
};

export default ManageSpots;
