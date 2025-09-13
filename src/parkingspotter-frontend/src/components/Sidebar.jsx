import { useUser } from "../utils/UserContext";
import { NavLink } from "react-router-dom";
const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useUser();

    // Link role-based
    const links = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact Us" },
        ...(user
            ? [
                  { href: "/profile", label: "Profile" },
                  ...(user.role === "operator"
                      ? [{ href: "/manage-spots", label: "Manage Spots" }]
                      : []),
                  ...(user.role === "admin"
                      ? [{ href: "/admin", label: "Admin Dashboard" }]
                      : []),
              ]
            : [
                  { href: "/login", label: "Login" },
                  { href: "/signup", label: "Register" },
              ]),
    ];

    return (
        <div
            className={`fixed top-0 right-0 overflow-y-scroll h-screen w-72 bg-black/90 backdrop-blur-md z-20 transition-transform duration-300 transform ${
                isOpen ? "translate-x-0" : "translate-x-full"
            } shadow-lg`}
        >
            <button
                onClick={toggleSidebar}
                aria-label="Close sidebar"
                className="cursor-pointer absolute top-4 right-4 text-white text-2xl hover:text-red-500 transition-colors"
            >
                ✖
            </button>
            <ul className="text-white mt-16 flex flex-col gap-4 p-6">
                {user && (
                    <NavLink
                        to="/profile"
                        className="flex justify-start items-center gap-x-2 lg:hidden cursor-pointer text-white font-medium px-6 py-2 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-lg hover:bg-blue-300 transition"
                    >
                        <div className="w-12 h-12 bg-white text-blue-500 font-bold rounded-full flex justify-center items-center">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        {user.name} {user.surname}
                    </NavLink>
                )}
                {links.map((link) => (
                    <li key={link.href}>
                        <a
                            href={link.href}
                            className="block py-2 px-4 rounded hover:bg-white/20 transition-colors"
                        >
                            {link.label}
                        </a>
                    </li>
                ))}

                {/* Logout Button */}
                {user && (
                    <li>
                        <button
                            onClick={() => {
                                logout();
                                toggleSidebar();
                            }}
                            className="cursor-pointer w-full text-left py-2 px-4 rounded bg-red-500 hover:bg-red-600 transition-colors"
                        >
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;
