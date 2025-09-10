import { createContext, useContext, useState, useEffect } from "react";
import * as jwtDecode from "jwt-decode";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode.jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({
                        id: decoded.userId,
                        name: decoded.name,
                        surname: decoded.surname,
                        email: decoded.email,
                        role: decoded.role,
                    });
                } else {
                    console.warn("Token scaduto");
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Errore decoding token:", error);
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        const decoded = jwtDecode.jwtDecode(token);
        setUser({
            id: decoded.userId,
            name: decoded.name,
            surname: decoded.surname,
            email: decoded.email,
            role: decoded.role,
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
