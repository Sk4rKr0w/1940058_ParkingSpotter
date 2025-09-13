import { createContext, useContext, useState, useEffect } from "react";
import * as jwtDecode from "jwt-decode";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token) {
            try {
                const decoded = jwtDecode.jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    // if token is valid
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        // fallback if user info is not in localStorage
                        setUser({
                            id: decoded.userId,
                            name: decoded.name,
                            surname: decoded.surname,
                            email: decoded.email,
                            role: decoded.role,
                        });
                    }
                } else {
                    console.warn("Token scaduto");
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            } catch (error) {
                console.error("Errore decoding token:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const decoded = jwtDecode.jwtDecode(token);
        const newUser = {
            id: decoded.userId,
            name: decoded.name,
            surname: decoded.surname,
            email: decoded.email,
            role: decoded.role,
        };
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{ user, setUser: updateUser, login, logout, loading }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
