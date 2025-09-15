import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserContext";
import parkingSpotterLogo from "/parkingSpotterLogo.png";
import Sidebar from "./Sidebar";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate("/");
    };

    return (
        <div className="bg-[#121212] border-b-2 border-b-[#383838] text-white w-screen h-28 flex flex-row justify-around items-center gap-2">
            {/* Logo */}
            <NavLink to="/" className="group relative w-28 h-28">
                <div className="absolute inset-0 scale-85 rounded-full bg-white opacity-0 blur-xl transition duration-500 group-hover:opacity-15 z-0"></div>
                <img
                    className="w-28 h-28 object-contain relative z-10 transition duration-500 group-hover:brightness-110"
                    src={parkingSpotterLogo}
                    alt="ParkingSpotter logo"
                />
            </NavLink>

            {/* Menu Links */}
            <ul className="hidden md:flex flex-row gap-x-10">
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `px-2 py-1 border-2 border-transparent rounded hover:border-b-2 hover:border-b-yellow-500 transition ${
                                isActive ? "border-b-yellow-500" : ""
                            }`
                        }
                    >
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `px-2 py-1 border-2 border-transparent rounded hover:border-b-2 hover:border-b-yellow-500 transition ${
                                isActive ? "border-b-yellow-500" : ""
                            }`
                        }
                    >
                        About
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `px-2 py-1 border-2 border-transparent rounded hover:border-b-2 hover:border-b-yellow-500 transition ${
                                isActive ? "border-b-yellow-500" : ""
                            }`
                        }
                    >
                        Contact Us
                    </NavLink>
                </li>
            </ul>

            {/* Login / Profile */}
            <div className="flex flex-row justify-center items-center">
                <div className="hidden lg:flex flex-row gap-x-2 mr-20 relative">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="cursor-pointer text-white font-medium px-6 py-2 bg-green-600 rounded hover:bg-green-700 transition"
                            >
                                {user.name}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg border border-gray-700 z-10">
                                    <button
                                        onClick={() => {
                                            navigate("/profile");
                                            setDropdownOpen(false);
                                        }}
                                        className="cursor-pointer block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                                    >
                                        Go to your profile
                                    </button>
                                    {user.role === "admin" && (
                                        <button
                                            onClick={() => {
                                                navigate("/admin");
                                                setDropdownOpen(false);
                                            }}
                                            className="cursor-pointer block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                                        >
                                            Admin Dashboard
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="cursor-pointer block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className="text-white font-medium px-6 py-2 bg-orange-600 rounded hover:bg-[#2c2c2c] hover:text-white transition"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className="text-black font-medium px-6 py-2 bg-white rounded hover:bg-[#2c2c2c] hover:text-white transition"
                            >
                                Sign Up
                            </NavLink>
                        </>
                    )}
                </div>

                {/* Hamburger */}
                <div
                    className="flex flex-col justify-between w-6 h-5 cursor-pointer"
                    onClick={toggleSidebar}
                >
                    <span className="h-0.75 bg-white rounded-sm"></span>
                    <span className="h-0.75 bg-white rounded-sm"></span>
                    <span className="h-0.75 bg-white rounded-sm"></span>
                </div>
            </div>

            {/* Sidebar */}
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
        </div>
    );
};

export default Navbar;
