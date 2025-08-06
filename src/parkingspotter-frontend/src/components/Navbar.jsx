import parkingSpotterLogo from "/parkingSpotterLogo.png";

const Navbar = () => {
    return (
        <div className="border-b-2 border-b-[#383838] text-white w-screen h-28 flex flex-row justify-between items-center gap-2">
            <a href="#" className="ml-20">
                <img
                    className="w-32 h-32"
                    src={parkingSpotterLogo}
                    alt="ParkingSpotter logo"
                />
            </a>
            <ul className="flex flex-row gap-x-10">
                <li>
                    <a
                        href="#"
                        className="hover:border-b-2 hover:border-b-yellow-500 transition"
                    >
                        Home
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="hover:border-b-2 hover:border-b-yellow-500 transition"
                    >
                        About
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="hover:border-b-2 hover:border-b-yellow-500 transition"
                    >
                        Contact Us
                    </a>
                </li>
            </ul>
            <div className="flex flex-row gap-x-2 mr-20">
                <a
                    href="#"
                    className="text-white font-medium px-6 py-2 bg-orange-600 rounded hover:bg-[#2c2c2c] hover:text-white transition"
                >
                    Login
                </a>
                <a
                    href="#"
                    className="text-black font-medium px-6 py-2 bg-white rounded hover:bg-[#2c2c2c] hover:text-white transition"
                >
                    Sign Up
                </a>
            </div>
        </div>
    );
};
export default Navbar;
