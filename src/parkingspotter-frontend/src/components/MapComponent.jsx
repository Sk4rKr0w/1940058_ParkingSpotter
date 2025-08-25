"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Database di parcheggi organizzato per città italiane principali
const parkingDatabase = {
    Roma: [
        {
            id: 1,
            lat: 41.9028,
            lng: 12.4964,
            nome: "Parcheggio Colosseo",
            posti: 150,
            prezzo: "2.50€/h",
            tipo: "Coperto",
        },
        {
            id: 2,
            lat: 41.8986,
            lng: 12.4769,
            nome: "Parcheggio Pantheon",
            posti: 80,
            prezzo: "3.00€/h",
            tipo: "Scoperto",
        },
        {
            id: 3,
            lat: 41.9109,
            lng: 12.4818,
            nome: "Parcheggio Piazza di Spagna",
            posti: 60,
            prezzo: "3.50€/h",
            tipo: "Interrato",
        },
        {
            id: 4,
            lat: 41.896,
            lng: 12.4823,
            nome: "Parcheggio Campo de' Fiori",
            posti: 45,
            prezzo: "2.80€/h",
            tipo: "Scoperto",
        },
    ],
    Milano: [
        {
            id: 5,
            lat: 45.4642,
            lng: 9.19,
            nome: "Parcheggio Duomo",
            posti: 200,
            prezzo: "4.00€/h",
            tipo: "Interrato",
        },
        {
            id: 6,
            lat: 45.4656,
            lng: 9.1859,
            nome: "Parcheggio La Scala",
            posti: 120,
            prezzo: "3.80€/h",
            tipo: "Coperto",
        },
        {
            id: 7,
            lat: 45.4721,
            lng: 9.1927,
            nome: "Parcheggio Brera",
            posti: 90,
            prezzo: "3.50€/h",
            tipo: "Scoperto",
        },
    ],
    Napoli: [
        {
            id: 8,
            lat: 40.8518,
            lng: 14.2681,
            nome: "Parcheggio Centro Storico",
            posti: 100,
            prezzo: "2.00€/h",
            tipo: "Coperto",
        },
        {
            id: 9,
            lat: 40.8359,
            lng: 14.2488,
            nome: "Parcheggio Porto",
            posti: 180,
            prezzo: "1.80€/h",
            tipo: "Scoperto",
        },
    ],
    Firenze: [
        {
            id: 10,
            lat: 43.7696,
            lng: 11.2558,
            nome: "Parcheggio Uffizi",
            posti: 75,
            prezzo: "3.20€/h",
            tipo: "Interrato",
        },
        {
            id: 11,
            lat: 43.7731,
            lng: 11.256,
            nome: "Parcheggio Duomo",
            posti: 95,
            prezzo: "3.00€/h",
            tipo: "Coperto",
        },
    ],
    Venezia: [
        {
            id: 12,
            lat: 45.4408,
            lng: 12.3155,
            nome: "Parcheggio Tronchetto",
            posti: 3000,
            prezzo: "25.00€/giorno",
            tipo: "Multipiano",
        },
        {
            id: 13,
            lat: 45.4434,
            lng: 12.2764,
            nome: "Parcheggio Mestre",
            posti: 500,
            prezzo: "15.00€/giorno",
            tipo: "Scoperto",
        },
    ],
    Torino: [
        {
            id: 14,
            lat: 45.0703,
            lng: 7.6869,
            nome: "Parcheggio Porta Nuova",
            posti: 150,
            prezzo: "2.20€/h",
            tipo: "Interrato",
        },
        {
            id: 15,
            lat: 45.0614,
            lng: 7.6722,
            nome: "Parcheggio Mole Antonelliana",
            posti: 80,
            prezzo: "2.50€/h",
            tipo: "Coperto",
        },
    ],
    Bologna: [
        {
            id: 19,
            lat: 44.4949,
            lng: 11.3426,
            nome: "Parcheggio Piazza Maggiore",
            posti: 90,
            prezzo: "2.80€/h",
            tipo: "Interrato",
        },
        {
            id: 20,
            lat: 44.4948,
            lng: 11.3464,
            nome: "Parcheggio Due Torri",
            posti: 70,
            prezzo: "3.00€/h",
            tipo: "Coperto",
        },
    ],
};

// Funzione per cercare coordinate di una città usando Nominatim
async function geocodeCity(cityName) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                cityName
            )},Italy&limit=1`
        );
        const data = await response.json();
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                displayName: data[0].display_name,
            };
        }
        return null;
    } catch (error) {
        console.error("Errore geocoding:", error);
        return null;
    }
}

const createCustomIcon = (label, tipo) => {
    const color =
        tipo === "Interrato"
            ? "#1f77b4"
            : tipo === "Coperto"
            ? "#ff7f0e"
            : tipo === "Multipiano"
            ? "#2ca02c"
            : "#d62728";

    return L.divIcon({
        html: `<div style="background-color: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${label}</div>`,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
    });
};

// Componente per centrare la mappa su una posizione
function MapController({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView([center.lat, center.lng], zoom);
        }
    }, [center, zoom, map]);

    return null;
}

export default function MapComponent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleMarkers, setVisibleMarkers] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 41.8719, lng: 12.5674 });
    const [mapZoom, setMapZoom] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [searchMessage, setSearchMessage] = useState("");

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setSearchMessage("");

        // Prima controlla se la città è nel nostro database
        const cityKey = Object.keys(parkingDatabase).find((city) =>
            city.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (cityKey) {
            // Città trovata nel database
            const parkings = parkingDatabase[cityKey];
            setVisibleMarkers(parkings);

            // Centra la mappa sul primo parcheggio della città
            if (parkings.length > 0) {
                setMapCenter({ lat: parkings[0].lat, lng: parkings[0].lng });
                setMapZoom(14);
            }
            setSearchMessage(
                `Trovati ${parkings.length} parcheggi a ${cityKey}`
            );
        } else {
            // Cerca la città usando geocoding
            const coords = await geocodeCity(searchQuery);
            if (coords) {
                setMapCenter({ lat: coords.lat, lng: coords.lng });
                setMapZoom(13);
                setVisibleMarkers([]);
                setSearchMessage(
                    `Posizione trovata: ${coords.displayName}. Non ci sono parcheggi registrati in questa zona.`
                );
            } else {
                setSearchMessage(
                    "Città non trovata. Prova con un nome diverso."
                );
            }
        }

        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-md p-4">
                {/* Colonna sinistra (Search + Legend su desktop) */}
                <div className="flex flex-col gap-4 md:w-1/3">
                    {/* Barra di ricerca */}
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex flex-col gap-3 mb-3">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Cerca una città (es: Roma, Milano, Bologna...)"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="cursor-pointer px-5 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                            >
                                {isLoading ? "Cercando..." : "Cerca"}
                            </button>
                        </div>

                        {searchMessage && (
                            <p className="text-sm text-gray-600 mb-2">
                                {searchMessage.startsWith(
                                    "Posizione trovata"
                                ) ? (
                                    <>
                                        <strong>Posizione trovata:</strong>{" "}
                                        {searchMessage.replace(
                                            "Posizione trovata: ",
                                            ""
                                        )}
                                    </>
                                ) : (
                                    searchMessage
                                )}
                            </p>
                        )}
                    </div>

                    {/* Legenda (desktop in colonna, mobile in fondo) */}
                    <div className="bg-gray-50 p-4 rounded-xl shadow-inner border-b-1 border-b-gray-300 ">
                        <h4 className="font-semibold mb-3">Legenda:</h4>
                        <div className="flex flex-wrap gap-4 text-sm">
                            {[
                                { color: "bg-blue-500", label: "Interrato" },
                                { color: "bg-orange-500", label: "Coperto" },
                                { color: "bg-green-600", label: "Multipiano" },
                                { color: "bg-red-600", label: "Scoperto" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className={`w-4 h-4 rounded-full ${item.color}`}
                                    ></div>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mappa (a destra su desktop, sotto su mobile) */}
                <div className="md:flex-1 h-64 md:h-auto rounded-xl overflow-hidden shadow-md">
                    <MapContainer
                        center={[mapCenter.lat, mapCenter.lng]}
                        zoom={mapZoom}
                        minZoom={5}
                        maxZoom={18}
                        style={{ height: "100%", width: "100%" }}
                        maxBounds={[
                            [35.0, 5.0],
                            [48.0, 19.0],
                        ]}
                        maxBoundsViscosity={1.0}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapController center={mapCenter} zoom={mapZoom} />

                        {visibleMarkers.map((parking) => (
                            <Marker
                                key={parking.id}
                                position={[parking.lat, parking.lng]}
                                icon={createCustomIcon(
                                    parking.posti,
                                    parking.tipo
                                )}
                            >
                                <Popup>
                                    <div className="text-sm space-y-1">
                                        <strong>{parking.nome}</strong>
                                        <div className="text-blue-600">
                                            📍 Tipo: {parking.tipo}
                                        </div>
                                        <div className="text-green-600">
                                            🚗 Posti: {parking.posti}
                                        </div>
                                        <div className="text-red-600">
                                            💰 Prezzo: {parking.prezzo}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
