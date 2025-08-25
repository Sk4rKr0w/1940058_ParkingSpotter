import { useState, useEffect } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error("Errore parsing user dal localStorage", error);
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, []);

    return (
        <div
            className={`fixed top-0 right-0 h-screen w-[300px] bg-black/50 z-20 transition-transform duration-300 transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <button
                onClick={toggleSidebar}
                className="cursor-pointer absolute top-4 right-4"
            >
                ✖
            </button>
            <ul className="text-white mt-16 flex flex-col gap-4 p-4">
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/about">About</a>
                </li>
                <li>
                    <a href="/contact">Contact Us</a>
                </li>
                {user && (
                    <li>
                        <a href="/profile">Profile</a>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
