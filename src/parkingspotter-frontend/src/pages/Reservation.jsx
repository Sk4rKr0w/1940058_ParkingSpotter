"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import MapComponent from "../components/MapComponent";

const Reservation = () => {
    const textRefs = useRef([]);
    const containerRef = useRef(null);
    const reservationRef = useRef(null);

    const [showForm, setShowForm] = useState(false);
    const [selectedParking, setSelectedParking] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const [carPlate, setCarPlate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [isBooking, setIsBooking] = useState(false);
    const [bookingMessage, setBookingMessage] = useState("");
    const [validationError, setValidationError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Animazione titolo e paragrafo
        gsap.fromTo(
            textRefs.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: "power1.out", stagger: 0.3 }
        );

        // Animazione MapComponent
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    ease: "power3.out",
                    delay: 0.5,
                }
            );
        }
    }, []);

    useEffect(() => {
        if (showForm && reservationRef.current) {
            reservationRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [showForm]);

    useEffect(() => {
        const savedQuery = localStorage.getItem("searchQuery");
        if (savedQuery) {
            setSearchQuery(savedQuery);
        }
    }, []);

    // ✅ Funzione di validazione date
    const validateDates = () => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (!startTime || !endTime) {
            setValidationError("Seleziona entrambe le date.");
            return false;
        }

        if (start < now) {
            setValidationError("La data di inizio non può essere nel passato.");
            return false;
        }

        if (end <= start) {
            setValidationError(
                "La data di fine deve essere successiva alla data di inizio."
            );
            return false;
        }

        setValidationError("");
        return true;
    };

    useEffect(() => {
        validateDates();
    }, [startTime, endTime]);

    const handleBooking = async () => {
        if (!carPlate || !startTime || !endTime) {
            setBookingMessage("Compila tutti i campi.");
            return;
        }

        if (!validateDates()) {
            setBookingMessage("Correggi le date prima di continuare.");
            return;
        }

        if (!selectedParking?.id) {
            setBookingMessage("Seleziona un parcheggio valido.");
            return;
        }

        setIsBooking(true);
        setBookingMessage("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:4002/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    parkingId: selectedParking.id,
                    carPlate,
                    startTime,
                    endTime,
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Errore nella prenotazione");
            }

            const data = await response.json();
            console.log("Booking response:", data);

            setBookingMessage("Prenotazione completata con successo!");
            setShowForm(false);
            alert("Prenotazione effettuata con successo!");
            navigate("/profile");
        } catch (error) {
            console.error(error);
            setBookingMessage(
                error.message || "Errore durante la prenotazione. Riprova."
            );
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="text-center flex flex-col min-h-screen bg-gradient-to-br from-orange-500 to-orange-200 p-4 md:p-8">
            <h1
                ref={(el) => (textRefs.current[0] = el)}
                className="mt-2 font-medium text-2xl md:text-3xl text-white drop-shadow-md"
            >
                Make your own reservation!
            </h1>
            <p
                ref={(el) => (textRefs.current[1] = el)}
                className="mt-2 text-lg md:text-xl text-white drop-shadow-sm"
            >
                Looking for a spot? Search for your location and hope for a free
                parking spot
            </p>

            <div className="mt-6" ref={containerRef}>
                <MapComponent
                    searchQuery={searchQuery}
                    onSelectParking={(parking) => {
                        setSelectedParking(parking);
                        setShowForm(true);
                    }}
                />
            </div>

            {/* FORM DI PRENOTAZIONE */}
            {showForm && selectedParking && (
                <div
                    ref={reservationRef}
                    className="bg-white/90 rounded-xl shadow-xl p-6 mt-8 max-w-xl mx-auto w-full flex flex-col gap-4"
                >
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Prenotazione
                    </h2>
                    <div className="bg-gray-300/50 p-2 rounded-lg flex flex-col gap-1">
                        <p className="text-gray-700 text-sm">
                            Parcheggio: <strong>{selectedParking.name}</strong>
                        </p>
                        <p className="text-gray-700 text-sm">
                            Tariffa:{" "}
                            <span className="font-semibold">
                                {selectedParking.hourlyPrice}€/h
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="Targa auto"
                            value={carPlate}
                            onChange={(e) => setCarPlate(e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className={`bg-white border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 ${
                                validationError && startTime
                                    ? "border-red-500 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-orange-500"
                            }`}
                        />
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className={`bg-white border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 ${
                                validationError && endTime
                                    ? "border-red-500 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-orange-500"
                            }`}
                        />

                        {validationError && (
                            <p className="text-center text-sm text-red-500">
                                {validationError}
                            </p>
                        )}

                        {bookingMessage && (
                            <p className="text-center text-sm text-gray-600">
                                {bookingMessage}
                            </p>
                        )}

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={handleBooking}
                                disabled={isBooking || validationError}
                                className={`cursor-pointer flex-1 rounded-lg py-2 text-white font-semibold transition ${
                                    isBooking || validationError
                                        ? "bg-orange-300 cursor-not-allowed"
                                        : "bg-orange-500 hover:bg-orange-600"
                                }`}
                            >
                                {isBooking ? "Prenotando..." : "Conferma"}
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="cursor-pointer flex-1 rounded-lg py-2 bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
                            >
                                Annulla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reservation;
