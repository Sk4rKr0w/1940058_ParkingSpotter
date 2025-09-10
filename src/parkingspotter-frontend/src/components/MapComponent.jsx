"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

function MapController({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView([center.lat, center.lng], zoom);
        }
    }, [center, zoom, map]);

    return null;
}

export default function MapComponent({
    searchQuery: initialQuery,
    onSelectParking,
}) {
    const [query, setQuery] = useState(initialQuery || ""); // ✅ Stato locale
    const [visibleMarkers, setVisibleMarkers] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 41.8719, lng: 12.5674 });
    const [mapZoom, setMapZoom] = useState(6);
    const [isLoading, setIsLoading] = useState(false);
    const [searchMessage, setSearchMessage] = useState("");

    const handleSearch = async (q) => {
        const searchTerm = q || query;
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        setSearchMessage("");

        const coords = await geocodeCity(searchTerm);

        if (coords) {
            setMapCenter({ lat: coords.lat, lng: coords.lng });
            setMapZoom(13);

            try {
                const radius = 5;
                const res = await fetch(
                    `http://localhost:4002/parkings/nearby?lat=${coords.lat}&lon=${coords.lng}&radius=${radius}`
                );

                if (!res.ok) {
                    throw new Error("Errore nella chiamata API");
                }

                const data = await res.json();
                if (data.length > 0) {
                    setVisibleMarkers(data);
                    setSearchMessage(
                        `Trovati ${data.length} parcheggi vicino a ${searchTerm}`
                    );
                } else {
                    setVisibleMarkers([]);
                    setSearchMessage(
                        `Nessun parcheggio trovato vicino a ${searchTerm}`
                    );
                }
            } catch (err) {
                console.error(err);
                setSearchMessage("Errore nel caricamento dei parcheggi");
            }
        } else {
            setSearchMessage("Città non trovata. Prova con un nome diverso.");
        }

        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // ✅ Se arriva una query iniziale dalla Home, fai subito la ricerca
    useEffect(() => {
        if (initialQuery) {
            setQuery(initialQuery);
            handleSearch(initialQuery);
        }
    }, [initialQuery]);

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow-md p-4">
                {/* Colonna sinistra */}
                <div className="flex flex-col gap-4 md:w-1/3">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex flex-col gap-3 mb-3">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Cerca una città (es: Roma, Milano...)"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                disabled={isLoading}
                            />
                            <button
                                onClick={() => handleSearch()}
                                disabled={isLoading}
                                className="cursor-pointer px-5 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                            >
                                {isLoading ? "Cercando..." : "Cerca"}
                            </button>
                        </div>

                        {searchMessage && (
                            <p className="text-sm text-gray-600 mb-2">
                                {searchMessage}
                            </p>
                        )}
                    </div>

                    {/* Legenda */}
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

                {/* Mappa */}
                <div className="md:flex-1 h-64 md:h-auto rounded-xl overflow-hidden shadow-md relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

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
                                position={[parking.latitude, parking.longitude]}
                                icon={createCustomIcon(
                                    parking.totalSpots,
                                    parking.tipo || "Scoperto"
                                )}
                            >
                                <Popup>
                                    <div className="text-sm space-y-1">
                                        <strong>{parking.name}</strong>
                                        <div className="text-blue-600">
                                            🏙 Tipo:{" "}
                                            {parking.type
                                                .charAt(0)
                                                .toUpperCase() +
                                                parking.type.slice(1) || "N/D"}
                                        </div>
                                        <div className="text-green-600">
                                            📅 Posti: {parking.totalSpots}
                                        </div>
                                        <div className="text-orange-600">
                                            ✔ Posti Liberi:{" "}
                                            {parking.totalSpots -
                                                parking.occupiedSpots}
                                        </div>
                                        <div className="text-red-600">
                                            💲 Tariffa Oraria:{" "}
                                            {parking.hourlyPrice}€/h
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onSelectParking(parking)}
                                        className="cursor-pointer inline-flex items-center justify-center w-full my-2 bg-blue-500 px-4 py-2 text-white font-medium rounded-lg"
                                    >
                                        Prenota
                                    </button>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
