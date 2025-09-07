import { useState, useEffect } from "react";
import axios from "axios";
import EditSpotModal from "../components/EditSpotModal";

export default function Admin() {
    const [userCounter, setUserCounter] = useState(null);
    const [users, setUsers] = useState([]);
    const [todayReservations, setTodayReservations] = useState(null);
    const [ticketsCounter, setTicketsCounter] = useState({
        total: null,
        today: null,
    });
    const [parkings, setParkings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchEmail, setSearchEmail] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParking, setEditingParking] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const [
                    usersStatsRes,
                    reservationsRes,
                    ticketsRes,
                    usersListRes,
                    parkingsListRes,
                ] = await Promise.all([
                    axios.get(`http://localhost:4001/auth/stats`, { headers }),
                    axios.get(
                        `http://localhost:4002/reservations/stats/today`,
                        { headers }
                    ),
                    axios.get(`http://localhost:4003/tickets/stats`, {
                        headers,
                    }),
                    axios.get(`http://localhost:4001/auth/list?limit=3`, {
                        headers,
                    }),
                    axios.get(
                        `http://localhost:4002/parkings/list/admin?limit=10`,
                        { headers }
                    ),
                ]);

                setUserCounter(usersStatsRes.data.totalUsers);
                setTodayReservations(reservationsRes.data.reservations);
                setTicketsCounter({
                    total: ticketsRes.data.totalTickets,
                    today: ticketsRes.data.todayTickets,
                });
                setUsers(usersListRes.data || []);
                setParkings(parkingsListRes.data || []);
            } catch (err) {
                console.error("Errore nel caricamento dati:", err);
                setError("Impossibile caricare i dati. Riprova più tardi.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = async () => {
        if (!searchEmail) return;

        setSearchLoading(true);
        setSearchError(null);
        setSearchResults([]);

        try {
            const token = localStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            const res = await axios.get(
                `http://localhost:4002/parkings/list/admin/search?email=${encodeURIComponent(
                    searchEmail
                )}`,
                { headers }
            );

            setSearchResults(res.data.parkings || []);
        } catch (err) {
            console.error("Errore nella ricerca parkings:", err);
            setSearchError(
                err.response?.data?.error || "Errore durante la ricerca"
            );
        } finally {
            setSearchLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 text-lg">Caricamento in corso...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    const handleEditClick = (parking) => {
        setEditingParking(parking);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Admin Dashboard
                </h1>

                {/* Statistic Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Registered Users
                        </h2>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {userCounter}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Today's Reservations
                        </h2>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {todayReservations}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Tickets (Total / Today)
                        </h2>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {ticketsCounter.total} / {ticketsCounter.today}
                        </p>
                    </div>
                </div>

                {/* Tables */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Latest Registered Users
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                                    <th className="py-3 px-4">Name</th>
                                    <th className="py-3 px-4">Surname</th>
                                    <th className="py-3 px-4">Role</th>
                                    <th className="py-3 px-4">
                                        Registration Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-4"
                                        >
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200"
                                        >
                                            <td className="py-3 px-4">
                                                {user.name}
                                            </td>
                                            <td className="py-3 px-4">
                                                {user.surname}
                                            </td>
                                            <td className="py-3 px-4">
                                                {user.role.toUpperCase()}
                                            </td>
                                            <td className="py-3 px-4">
                                                {user.registrationDate}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">
                        Parking Lots
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                                    <th className="py-3 px-4">Parking Name</th>
                                    <th className="py-3 px-4">Total Spots</th>
                                    <th className="py-3 px-4">
                                        Occupied Spots
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {parkings.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="text-center py-4"
                                        >
                                            No parking lots found
                                        </td>
                                    </tr>
                                ) : (
                                    parkings.map((parking, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-200"
                                        >
                                            <td className="py-3 px-4">
                                                {parking.name}
                                            </td>
                                            <td className="py-3 px-4">
                                                {parking.totalSpots}
                                            </td>
                                            <td className="py-3 px-4">
                                                {parking.occupiedSpots}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Search parking by operator email */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Search Parking by Operator Email
                        </h3>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="border rounded px-4 py-2 flex-1"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                            />
                            <button
                                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>

                        {searchLoading && (
                            <p className="text-gray-600">Loading...</p>
                        )}
                        {searchError && (
                            <p className="text-red-600">{searchError}</p>
                        )}

                        {searchResults.length > 0 && (
                            <div className="overflow-x-auto mt-4">
                                <table className="min-w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                                            <th className="py-3 px-4">
                                                Parking Name
                                            </th>
                                            <th className="py-3 px-4">
                                                Total Spots
                                            </th>
                                            <th className="py-3 px-4">
                                                Occupied Spots
                                            </th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchResults.map((parking, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-gray-200"
                                            >
                                                <td className="py-3 px-4">
                                                    {parking.name}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {parking.totalSpots}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {parking.occupiedSpots}
                                                </td>
                                                <td>
                                                    <button
                                                        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                parking
                                                            )
                                                        }
                                                    >
                                                        Edit Spot
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EditSpotModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                parking={editingParking}
                onSave={async (updatedData) => {
                    try {
                        // Calculate coordinates if needed
                        let latitude = editingParking.latitude;
                        let longitude = editingParking.longitude;

                        if (updatedData.address) {
                            const res = await fetch(
                                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                                    updatedData.address
                                )}`
                            );
                            const data = await res.json();
                            if (data.length > 0) {
                                latitude = data[0].lat;
                                longitude = data[0].lon;
                            }
                        }

                        const token = localStorage.getItem("token");
                        await axios.post(
                            `http://localhost:4002/parkings/${editingParking.id}`,
                            { ...updatedData, latitude, longitude },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        // Update state for parkings (main list and search results)
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

                        setSearchResults((prev) =>
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
                        console.error("Error updating parking:", err);
                        alert("Failed to update parking.");
                    }
                }}
            />
        </div>
    );
}
