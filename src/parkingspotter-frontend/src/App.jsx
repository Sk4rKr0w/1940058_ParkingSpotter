import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./utils/UserContext";
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

function App() {
    return (
        <Router>
            <UserProvider>
                {" "}
                {/* Wrappa tutto con UserProvider */}
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/reservation" element={<Reservation />} />
                    <Route path="/manage-spots" element={<ManageSpots />} />
                    <Route path="/add-spot" element={<AddSpot />} />
                </Routes>
                <Footer />
            </UserProvider>
        </Router>
    );
}

export default App;
