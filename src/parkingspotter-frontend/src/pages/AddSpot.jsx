import { useState } from "react";

const AddSpot = () => {
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        street: "",
        totalSpots: "",
        hourlyPrice: "",
        type: "uncovered", // default
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // 1. Get latitude/longitude from Nominatim
            const query = `${formData.street}, ${formData.city}`;
            const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}`
            );

            const geoData = await geoRes.json();

            if (geoData.length === 0) {
                setError("Address not found. Please check city and street.");
                setLoading(false);
                return;
            }

            const latitude = parseFloat(geoData[0].lat);
            const longitude = parseFloat(geoData[0].lon);

            // 2. Get token from localStorage
            const token = localStorage.getItem("token");
            if (!token) {
                setError(
                    "You must be logged in as an operator to add a parking spot."
                );
                setLoading(false);
                return;
            }

            // 3. Send data to backend with Authorization header
            const response = await fetch("http://localhost:4002/parkings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    latitude,
                    longitude,
                    totalSpots: parseInt(formData.totalSpots) || 0,
                    hourlyPrice: parseFloat(formData.hourlyPrice) || 0,
                    type: formData.type || "uncovered",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Error while adding the parking spot");
            } else {
                setSuccess("Parking spot added successfully!");
                setFormData({
                    name: "",
                    city: "",
                    street: "",
                    totalSpots: "",
                    hourlyPrice: "",
                    type: "uncovered",
                });
            }
        } catch (err) {
            console.error(err);
            setError("Server connection error");
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-md mx-2"
            >
                <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">
                    Add Parking Spot
                </h2>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-500 text-sm mb-4 text-center">
                        {success}
                    </p>
                )}

                {/* Parking Name */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Parking Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* City */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Street */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="street"
                        placeholder="Street (e.g., 10 Roma St)"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Total Spots */}
                <div className="mb-4">
                    <input
                        type="number"
                        name="totalSpots"
                        placeholder="Total Spots"
                        value={formData.totalSpots}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Hourly Price */}
                <div className="mb-4">
                    <input
                        type="number"
                        step="0.01"
                        name="hourlyPrice"
                        placeholder="Hourly Price (€)"
                        value={formData.hourlyPrice}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Type (uncovered, covered, multi-storey) */}
                <div className="mb-6">
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="uncovered">Uncovered</option>
                        <option value="covered">Covered</option>
                        <option value="multi-storey">Multi-storey</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`cursor-pointer w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${
                        loading
                            ? "bg-orange-400 cursor-not-allowed"
                            : "bg-orange-600 hover:bg-orange-700"
                    }`}
                >
                    {loading ? "Adding..." : "Add Parking Spot"}
                </button>
            </form>
        </div>
    );
};

export default AddSpot;
