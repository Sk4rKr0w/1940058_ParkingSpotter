import "./App.css";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { UserProvider, useUser } from "./utils/UserContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Reservation from "./pages/Reservation";
import ManageSpots from "./pages/ManageSpots";
import AddSpot from "./pages/AddSpot";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";

function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useUser();

    if (loading) return <div className="text-center p-4">Loading...</div>;

    if (!user || !user.role) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

function App() {
    return (
        <Router>
            <UserProvider>
                <Navbar />
                <Routes>
                    {/* Rotte pubbliche */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />

                    {/* Rotte per tutti gli utenti loggati (Driver, Operator, Admin) */}
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute
                                allowedRoles={["driver", "operator", "admin"]}
                            >
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Rotte per Driver */}
                    <Route
                        path="/reservation"
                        element={
                            <ProtectedRoute
                                allowedRoles={["driver", "operator", "admin"]}
                            >
                                <Reservation />
                            </ProtectedRoute>
                        }
                    />

                    {/* Rotte per Operator */}
                    <Route
                        path="/manage-spots"
                        element={
                            <ProtectedRoute allowedRoles={["operator"]}>
                                <ManageSpots />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/add-spot"
                        element={
                            <ProtectedRoute allowedRoles={["operator"]}>
                                <AddSpot />
                            </ProtectedRoute>
                        }
                    />

                    {/* Esempio rotta Admin */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={["admin"]}>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                <Footer />
            </UserProvider>
        </Router>
    );
}

export default App;
