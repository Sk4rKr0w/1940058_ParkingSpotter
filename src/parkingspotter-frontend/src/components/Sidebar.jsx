import { useUser } from "../utils/UserContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useUser(); // aggiungiamo logout dal context

    // Lista di link con controllo ruoli
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
            className={`fixed top-0 right-0 h-screen w-72 bg-black/90 backdrop-blur-md z-20 transition-transform duration-300 transform ${
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

                {/* Bottone logout gestito dal context */}
                {user && (
                    <li>
                        <button
                            onClick={() => {
                                logout();
                                toggleSidebar(); // chiudi la sidebar dopo logout
                            }}
                            className="w-full text-left py-2 px-4 rounded hover:bg-red-600 transition-colors"
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
