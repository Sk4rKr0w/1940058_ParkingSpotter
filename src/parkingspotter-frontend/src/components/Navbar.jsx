import { useState } from "react";
import parkingSpotterLogo from "/parkingSpotterLogo.png";
import Sidebar from "./Sidebar";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="bg-[#121212] border-b-2 border-b-[#383838] text-white w-screen h-28 flex flex-row justify-between items-center gap-2">
            <a href="#" className="ml-10 md:ml-20 group relative w-28 h-28">
                <div className="absolute inset-0 scale-85 rounded-full bg-white opacity-0 blur-xl transition duration-500 group-hover:opacity-15 z-0"></div>
                <img
                    className="w-28 h-28 object-contain relative z-10 transition duration-500 group-hover:brightness-110"
                    src={parkingSpotterLogo}
                    alt="ParkingSpotter logo"
                />
            </a>

            <ul className="hidden md:flex flex-row gap-x-10">
                <li>
                    <a
                        href="#"
                        className="px-2 py-1 border-2 border-transparent rounded hover:border-b-2 hover:border-b-yellow-500 transition"
                    >
                        Home
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="px-2 py-1 border-2 border-transparent rounded hover:border-b-2 hover:border-b-yellow-500 transition"
                    >
                        About
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="px-2 py-1 border-2 border-transparent rounded hover:border-b-2 hover:border-b-yellow-500 transition"
                    >
                        Contact Us
                    </a>
                </li>
            </ul>

            <div className="flex flex-row justify-center items-center">
                <div className="hidden md:flex flex-row gap-x-2 mr-20">
                    <a
                        href="/login"
                        className="text-white font-medium px-6 py-2 bg-orange-600 rounded hover:bg-[#2c2c2c] hover:text-white transition"
                    >
                        Login
                    </a>
                    <a
                        href="/signup"
                        className="text-black font-medium px-6 py-2 bg-white rounded hover:bg-[#2c2c2c] hover:text-white transition"
                    >
                        Sign Up
                    </a>
                </div>

                <div
                    className="flex flex-col mr-10 justify-between w-6 h-5 cursor-pointer"
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
