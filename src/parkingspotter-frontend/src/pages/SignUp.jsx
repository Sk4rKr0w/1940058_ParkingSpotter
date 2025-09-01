import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // <-- import NavLink

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:4001/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                setError(data.message || "Errore di registrazione");
            } else {
                console.log("Registrazione effettuata con successo!", data);
                navigate("/login");
            }
        } catch (err) {
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
                    Sign Up
                </h2>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}

                {/* Nome */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Cognome */}
                <div className="mb-4">
                    <input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Password */}
                <div className="mb-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Conferma Password */}
                <div className="mb-6">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Ruolo */}
                <div className="mb-4">
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="driver">Driver</option>
                        <option value="operator">Parking Owner</option>
                    </select>
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
                    {loading ? "Loading..." : "Sign Up"}
                </button>
                <span className="text-gray-400 text-sm mt-4 block text-center">
                    Do you already have an account?{" "}
                    <NavLink
                        to="/login"
                        className={
                            "text-orange-500 hover:text-orange-400 transition"
                        }
                    >
                        Try to login
                    </NavLink>
                </span>
            </form>
        </div>
    );
};

export default Signup;
