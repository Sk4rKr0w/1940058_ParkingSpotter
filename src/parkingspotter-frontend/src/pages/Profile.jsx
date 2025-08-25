import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { NavLink } from "react-router-dom";

const Profile = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const containerRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("token"); // assuming you store JWT here
                const res = await axios.get(
                    "http://localhost:4001/reservations",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setReservations(res.data);
            } catch (err) {
                setError("Failed to fetch reservations.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [user]);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
        }
    }, []);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

    return (
        <div className="w-full min-h-screen bg-[#1c1c1c] flex flex-col items-center px-4 py-8">
            {user ? (
                <div
                    ref={containerRef}
                    className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-4xl"
                >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-semibold shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex flex-col gap-2 text-center md:text-left">
                            <h1 className="text-2xl font-bold text-gray-800">
                                {user.name} {user.surname || "COGNOME"}
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Email:{" "}
                                <span className="font-medium">
                                    {user.email}
                                </span>
                            </p>
                            <p className="text-gray-600 text-sm">
                                Role:{" "}
                                <span className="font-semibold text-indigo-600">
                                    {user.role === "driver"
                                        ? "Driver"
                                        : "Parking Owner"}
                                </span>
                            </p>
                            <p className="text-gray-500 text-xs">
                                ID: {user.id}
                            </p>
                        </div>

                        <NavLink
                            to="/reservation"
                            className="flex justify-center items-center bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
                        >
                            Make your own reservation!
                        </NavLink>
                    </div>

                    <div className="border-t border-gray-200 my-6" />

                    <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Your Reservations
                        </h3>
                        {loading ? (
                            <p className="text-gray-500 animate-pulse">
                                Loading...
                            </p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : reservations.length === 0 ? (
                            <p className="text-gray-400 italic">
                                No reservations found.
                            </p>
                        ) : (
                            <ul className="space-y-4">
                                {reservations.map((r) => (
                                    <li
                                        key={r.id}
                                        className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition-shadow"
                                    >
                                        <p className="text-gray-700">
                                            <strong>Spot ID:</strong> {r.spotId}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>From:</strong>{" "}
                                            {formatDate(r.startTime)}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>To:</strong>{" "}
                                            {formatDate(r.endTime)}
                                        </p>
                                        <p className="text-gray-700">
                                            <strong>Status:</strong>{" "}
                                            <span
                                                className={`font-semibold ${
                                                    r.status === "active"
                                                        ? "text-green-600"
                                                        : r.status ===
                                                          "completed"
                                                        ? "text-gray-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {r.status}
                                            </span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-300 text-center mt-10">
                    No user data found. Please log in.
                </p>
            )}
        </div>
    );
};

export default Profile;
