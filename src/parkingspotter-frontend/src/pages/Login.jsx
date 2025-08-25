import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Qui vai a fare la chiamata al tuo backend
            const response = await fetch("http://localhost:4001/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Errore di login");
            } else {
                localStorage.setItem("token", data.token);
                login(data.user);
                navigate("/profile");
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
                    Login
                </h2>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">
                        {error}
                    </p>
                )}

                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Password */}
                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>

                {/* Bottone */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${
                        loading
                            ? "bg-orange-400 cursor-not-allowed"
                            : "bg-orange-600 hover:bg-orange-700"
                    }`}
                >
                    {loading ? "Loading..." : "Login"}
                </button>
                <span className="text-gray-400 text-sm mt-4 block text-center">
                    You don't have an account?{" "}
                    <NavLink
                        to="/signup"
                        className={
                            "text-orange-500 hover:text-orange-400 transition"
                        }
                    >
                        Let's sign up!
                    </NavLink>
                </span>
            </form>
        </div>
    );
};

export default Login;
