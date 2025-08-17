import React, { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Qui vai a fare la chiamata al tuo backend
            const response = await fetch("https://tuo-backend.com/api/login", {
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
                // Login riuscito: salva token, redireziona, ecc.
                console.log("Login effettuato con successo!", data);
            }
        } catch (err) {
            setError("Errore di connessione al server");
        }

        setLoading(false);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>

                {error && <p>{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
