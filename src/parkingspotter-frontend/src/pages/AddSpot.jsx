import { useState } from "react";

const AddSpot = () => {
    const [formData, setFormData] = useState({
        name: "",
        city: "",
        street: "",
        totalSpots: "",
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
            // 1. Otteniamo lat/lon da Nominatim
            const query = `${formData.street}, ${formData.city}`;
            const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}`
            );
            const geoData = await geoRes.json();

            if (geoData.length === 0) {
                setError("Indirizzo non trovato. Verifica città e via.");
                setLoading(false);
                return;
            }

            const latitude = parseFloat(geoData[0].lat);
            const longitude = parseFloat(geoData[0].lon);

            // 2. Invio dati al backend
            const response = await fetch("http://localhost:4002/parkings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    latitude,
                    longitude,
                    totalSpots: parseInt(formData.totalSpots) || 0,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error || "Errore durante l'aggiunta del parcheggio"
                );
            } else {
                setSuccess("Parcheggio aggiunto con successo!");
                setFormData({ name: "", city: "", street: "", totalSpots: "" });
            }
        } catch (err) {
            console.error(err);
            setError("Errore di connessione al server");
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
                    Aggiungi Parcheggio
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

                {/* Nome Parcheggio */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nome Parcheggio"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Città */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="city"
                        placeholder="Città"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Via */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="street"
                        placeholder="Via (es. Via Roma 10)"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Numero di posti */}
                <div className="mb-4">
                    <input
                        type="number"
                        name="totalSpots"
                        placeholder="Numero di posti"
                        value={formData.totalSpots}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Bottone */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`cursor-pointer w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${
                        loading
                            ? "bg-orange-400 cursor-not-allowed"
                            : "bg-orange-600 hover:bg-orange-700"
                    }`}
                >
                    {loading ? "Aggiungendo..." : "Aggiungi Parcheggio"}
                </button>
            </form>
        </div>
    );
};

export default AddSpot;
