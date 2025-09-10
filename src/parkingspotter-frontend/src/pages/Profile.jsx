import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { NavLink } from "react-router-dom";
import ClipboardIcon from "../assets/clipboard.svg";
import { useUser } from "../utils/UserContext";

const Profile = () => {
    const { user } = useUser();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);

    // Stati per il form
    const [formData, setFormData] = useState({
        name: user?.name || "",
        surname: user?.surname || "",
        email: user?.email || "",
    });
    const [changePassword, setChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [saving, setSaving] = useState(false);
    const [uniqueCode, setUniqueCode] = useState("");

    const containerRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    "http://localhost:4002/reservations",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const sortedReservations = res.data.sort(
                    (a, b) => new Date(b.startTime) - new Date(a.startTime)
                );
                setReservations(sortedReservations);
                console.log(res.data);
            } catch (err) {
                setError("Failed to fetch reservations.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []); // <- vuoto: solo al mount

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
            );
        }
    }, []);

    useEffect(() => {
        const fetchUniqueCode = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    "http://localhost:4001/me/uniqueCode",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUniqueCode(res.data.uniqueCode);
                console.log("Unique Code:", res.data.uniqueCode);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUniqueCode();
    }, []);

    const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

    const handleCancelReservation = (id) => async () => {
        if (
            !window.confirm("Are you sure you want to cancel this reservation?")
        )
            return;
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `http://localhost:4002/reservations/${id}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReservations((prev) =>
                prev.map((r) =>
                    r.id === id ? { ...r, status: "cancelled" } : r
                )
            );
        } catch (err) {
            setError("Failed to cancel reservation.");
            console.error(err);
        }
    };

    // Funzione per aggiornare il profilo
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (changePassword && newPassword !== confirmPassword) {
            setFormError("Passwords do not match.");
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem("token");
            const payload = {
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                ...(changePassword && newPassword
                    ? { password: newPassword }
                    : {}),
            };

            const res = await axios.post(
                "http://localhost:4001/auth/user",
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Aggiorna localStorage con i nuovi dati dell'utente
            localStorage.setItem("user", JSON.stringify(res.data.user));

            setFormSuccess("Profile updated successfully!");
            setTimeout(() => {
                setEditModalOpen(false);
                window.location.reload(); // per riflettere le modifiche subito
            }, 1000);
        } catch (err) {
            setFormError("Failed to update profile.");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const copyToClipboard = async () => {
        if (!uniqueCode) return;
        try {
            await navigator.clipboard.writeText(uniqueCode);
            alert("Copied to clipboard!"); // puoi sostituire con una toast notification se vuoi
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#1c1c1c] flex flex-col items-center px-4 py-6 sm:py-8">
            {user ? (
                <div
                    ref={containerRef}
                    className="bg-white shadow-2xl rounded-2xl p-4 sm:p-8 w-full sm:max-w-full lg:max-w-4xl"
                >
                    {/* HEADER UTENTE */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
                        {/* Avatar */}
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-4xl font-semibold shadow-lg"></div>

                        {/* Info */}
                        <div className="flex flex-col gap-2 text-center md:text-left">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
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
                                    {user.role.charAt(0).toUpperCase() +
                                        user.role.slice(1)}
                                </span>
                            </p>
                            <p className="text-gray-500 text-xs">
                                ID: {user.id}
                            </p>
                        </div>

                        {/* Azioni */}
                        <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4 w-full md:w-auto mt-4 md:mt-0">
                            <NavLink
                                to="/reservation"
                                className={`w-full flex justify-center items-center
                bg-gradient-to-r from-orange-400 to-orange-500
                hover:from-orange-500 hover:to-orange-600
                text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-sm font-semibold
                shadow-md transform transition-all duration-300 hover:scale-105
                ${user.role === "operator" ? "" : "md:col-span-2"}`}
                            >
                                Make your own reservation!
                            </NavLink>

                            {user.role === "operator" && (
                                <NavLink
                                    to="/manage-spots"
                                    className="w-full flex justify-center items-center bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105"
                                >
                                    Manage your parking spots
                                </NavLink>
                            )}

                            <button
                                onClick={() => setEditModalOpen(true)}
                                className="w-full cursor-pointer flex justify-center md:col-span-2 items-center bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105"
                            >
                                Edit Profile
                            </button>

                            {user.role === "operator" && (
                                <div className="w-full flex flex-col md:col-span-2 justify-center p-3 sm:p-4 bg-gray-50 rounded-xl shadow-md border border-gray-200 transition-all hover:shadow-lg">
                                    <div className="text-gray-700 text-sm text-left">
                                        <span className="font-medium">
                                            Your Unique Code:
                                        </span>
                                        <div
                                            onClick={copyToClipboard}
                                            className="flex justify-center items-center gap-3 mt-2 bg-gray-200/50 p-2 rounded-lg cursor-pointer hover:bg-gray-300/50 transition-all"
                                        >
                                            <span
                                                className="font-semibold text-indigo-600 text-left truncate max-w-[220px] sm:max-w-[360px]"
                                                title={
                                                    uniqueCode || "Loading..."
                                                }
                                            >
                                                {uniqueCode || "Loading..."}
                                            </span>
                                            <img
                                                src={ClipboardIcon}
                                                alt="Clipboard"
                                                className="w-5 h-5 hover:text-indigo-700 transition-colors"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-6" />

                    {/* Sezione prenotazioni */}
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
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
                                        className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-center gap-4"
                                    >
                                        <div className="w-full text-sm sm:text-base">
                                            <p className="text-gray-700">
                                                <strong>Parking Spot:</strong>{" "}
                                                {r.Parking.name}
                                            </p>
                                            <p className="text-gray-700">
                                                <strong>Vehicle:</strong>{" "}
                                                {r.carPlate.toUpperCase()}
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
                                                              "expired"
                                                            ? "text-yellow-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {r.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        r.status.slice(1)}
                                                </span>
                                            </p>
                                        </div>
                                        {r.status === "active" && (
                                            <button
                                                onClick={handleCancelReservation(
                                                    r.id
                                                )}
                                                className="cursor-pointer w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
                                            >
                                                Cancel Reservation
                                            </button>
                                        )}
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

            {/* Modale */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                        <form
                            onSubmit={handleUpdateProfile}
                            className="flex flex-col gap-4"
                        >
                            <input
                                type="text"
                                placeholder="Name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                className="border border-gray-300 rounded-lg p-2"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Surname"
                                value={formData.surname}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        surname: e.target.value,
                                    })
                                }
                                className="border border-gray-300 rounded-lg p-2"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="border border-gray-300 rounded-lg p-2"
                                required
                            />

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={changePassword}
                                    onChange={() =>
                                        setChangePassword(!changePassword)
                                    }
                                    className="cursor-pointer"
                                />
                                <span className="text-gray-700">
                                    Change Password
                                </span>
                            </div>

                            {changePassword && (
                                <>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        className="border border-gray-300 rounded-lg p-2"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="border border-gray-300 rounded-lg p-2"
                                    />
                                </>
                            )}

                            {formError && (
                                <p className="text-red-500">{formError}</p>
                            )}
                            {formSuccess && (
                                <p className="text-green-500">{formSuccess}</p>
                            )}

                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="cursor-pointer px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                    {saving ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
